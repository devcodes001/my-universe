import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import dbConnect from "@/lib/db";
import LoveNote from "@/models/LoveNote";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const notes = await LoveNote.find({ coupleId: session.user.coupleId }).sort({ createdAt: -1 });
        return NextResponse.json({ notes });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch love notes" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { content } = await request.json();

        const note = await LoveNote.create({
            content,
            userId: session.user.id,
            authorName: session.user.name,
            coupleId: session.user.coupleId,
        });

        return NextResponse.json({ note }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save love note" }, { status: 500 });
    }
}
