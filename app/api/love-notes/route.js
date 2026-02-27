import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import LoveNote from "@/models/LoveNote";

// GET — fetch all love notes for the couple
export const GET = withAuth(async (req, { user }) => {
    const notes = await LoveNote.find({ coupleId: user.coupleId })
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json({ notes });
});

// POST — add a love note to the jar
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();

    const validated = validateBody(body, {
        content: { required: true, maxLength: 500 },
    });

    const note = await LoveNote.create({
        content: validated.content,
        userId: user.id,
        authorName: user.name,
        coupleId: user.coupleId,
    });

    return NextResponse.json({ note }, { status: 201 });
});
