import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import Reflection from "@/models/Reflection";

// GET — fetch reflections for the couple
// Only returns reflections that have passed the 24-hour visibility window
// OR reflections authored by the requesting user
export const GET = withAuth(async (req, { user }) => {
    const now = new Date();

    const reflections = await Reflection.find({
        coupleId: user.coupleId,
    })
        .sort({ createdAt: -1 })
        .lean();

    // Group reflections by date (same day = same "fight event")
    const grouped = {};
    reflections.forEach((r) => {
        const dateKey = new Date(r.createdAt).toISOString().split("T")[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];

        // Only show full content if:
        // 1. It's the user's own reflection, OR
        // 2. The visibility window has passed
        const canSeeContent =
            r.userId.toString() === user.id || new Date(r.visibleAfter) <= now;

        grouped[dateKey].push({
            ...r,
            // Redact partner's answers if visibility window hasn't passed
            whatHurt: canSeeContent ? r.whatHurt : null,
            whatLearned: canSeeContent ? r.whatLearned : null,
            doDifferently: canSeeContent ? r.doDifferently : null,
            isOwn: r.userId.toString() === user.id,
            isRevealed: new Date(r.visibleAfter) <= now,
        });
    });

    return NextResponse.json({ reflections: grouped });
});

// POST — submit a healing reflection
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();

    const validated = validateBody(body, {
        whatHurt: { required: true, maxLength: 3000 },
        whatLearned: { required: true, maxLength: 3000 },
        doDifferently: { required: true, maxLength: 3000 },
    });

    // Set visibility to 24 hours from now
    const visibleAfter = new Date();
    visibleAfter.setHours(visibleAfter.getHours() + 24);

    const reflection = await Reflection.create({
        ...validated,
        userId: user.id,
        authorName: user.name,
        coupleId: user.coupleId,
        visibleAfter,
    });

    return NextResponse.json({ reflection }, { status: 201 });
});
