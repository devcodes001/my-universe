import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
    try {
        await dbConnect();

        const { name, email, password, partnerEmail } = await request.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            );
        }

        // Bidirectional Coupling Logic:
        // 1. Check if the partner is already registered
        // 2. Check if someone has already registered and invited THIS user (by email)

        let coupleId = uuidv4();

        // Check if someone invited me
        const inviter = await User.findOne({ partnerEmail: email });

        if (inviter && inviter.coupleId) {
            coupleId = inviter.coupleId;
        } else if (partnerEmail) {
            // Check if my partner is already here
            const partner = await User.findOne({ email: partnerEmail });
            if (partner && partner.coupleId) {
                coupleId = partner.coupleId;
            } else if (partner) {
                // Partner is here but hasn't set up a coupleId? Unlikely but safe fallback
                coupleId = uuidv4();
                partner.coupleId = coupleId;
                await partner.save();
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            partnerEmail: partnerEmail || "",
            coupleId,
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    coupleId: user.coupleId,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
