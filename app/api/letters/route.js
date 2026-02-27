import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import Letter from "@/models/Letter";

// GET — fetch all letters for the couple
export const GET = withAuth(async (req, { user }) => {
    const letters = await Letter.find({ coupleId: user.coupleId })
        .sort({ openDate: 1 })
        .lean();

    return NextResponse.json({ letters });
});

// POST — create a new time capsule letter
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();

    const validated = validateBody(body, {
        title: { required: true, maxLength: 200 },
        content: { required: true, maxLength: 5000 },
        openDate: { required: true, type: "date" },
    });

    // Ensure openDate is in the future
    if (validated.openDate <= new Date()) {
        return NextResponse.json(
            { error: "Open date must be in the future" },
            { status: 400 }
        );
    }

    const letter = await Letter.create({
        ...validated,
        userId: user.id,
        authorName: user.name,
        coupleId: user.coupleId,
    });

    return NextResponse.json({ letter }, { status: 201 });
});
