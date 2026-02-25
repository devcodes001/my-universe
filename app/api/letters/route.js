import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import dbConnect from "@/lib/db";
import Letter from "@/models/Letter";

// GET — fetch all letters for the couple
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const letters = await Letter.find({ coupleId: session.user.coupleId })
            .sort({ openDate: 1 })
            .lean();

        return NextResponse.json({ letters });
    } catch (error) {
        console.error("Get letters error:", error);
        return NextResponse.json(
            { error: "Failed to fetch letters" },
            { status: 500 }
        );
    }
}

// POST — create a new letter
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const letter = await Letter.create({
            ...body,
            userId: session.user.id,
            authorName: session.user.name,
            coupleId: session.user.coupleId,
        });

        return NextResponse.json({ letter }, { status: 201 });
    } catch (error) {
        console.error("Create letter error:", error);
        return NextResponse.json(
            { error: "Failed to create letter" },
            { status: 500 }
        );
    }
}
