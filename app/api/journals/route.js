import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import dbConnect from "@/lib/db";
import Journal from "@/models/Journal";

// GET — fetch all journal entries for the couple
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const journals = await Journal.find({ coupleId: session.user.coupleId })
            .sort({ date: -1 })
            .lean();

        return NextResponse.json({ journals });
    } catch (error) {
        console.error("Get journals error:", error);
        return NextResponse.json(
            { error: "Failed to fetch journals" },
            { status: 500 }
        );
    }
}

// POST — create/update a journal entry
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { content, mood, date } = await request.json();

        // We'll allow multiple entries per day or just one, let's keep it simple: new entry
        const journal = await Journal.create({
            content,
            mood,
            date: date || new Date(),
            userId: session.user.id,
            authorName: session.user.name,
            coupleId: session.user.coupleId,
        });

        return NextResponse.json({ journal }, { status: 201 });
    } catch (error) {
        console.error("Create journal error:", error);
        return NextResponse.json(
            { error: "Failed to save journal entry" },
            { status: 500 }
        );
    }
}
