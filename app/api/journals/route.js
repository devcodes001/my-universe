import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import Journal from "@/models/Journal";

const MOODS = ["✨", "❤️", "😊", "🥰", "🌟", "🎉", "🥺", "💫", "🍃", "☁️"];

// GET — fetch all journal entries for the couple
export const GET = withAuth(async (req, { user }) => {
    const journals = await Journal.find({ coupleId: user.coupleId })
        .sort({ date: -1 })
        .lean();

    return NextResponse.json({ journals });
});

// POST — create a journal entry
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();

    const validated = validateBody(body, {
        content: { required: true, maxLength: 5000 },
        mood: { enum: MOODS },
        date: { type: "date" },
    });

    const journal = await Journal.create({
        content: validated.content,
        mood: validated.mood || "😊",
        date: validated.date || new Date(),
        userId: user.id,
        authorName: user.name,
        coupleId: user.coupleId,
    });

    return NextResponse.json({ journal }, { status: 201 });
});
