import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import DateIdea from "@/models/DateIdea";

const CATEGORIES = ["home", "outdoor", "adventure", "fancy", "creative", "spontaneous"];

// GET — fetch all date ideas for the couple
export const GET = withAuth(async (req, { user }) => {
    const ideas = await DateIdea.find({ coupleId: user.coupleId })
        .sort({ createdAt: -1 })
        .lean();
    return NextResponse.json({ ideas });
});

// POST — add a new date idea
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();
    const validated = validateBody(body, {
        title: { required: true, maxLength: 200 },
        category: { enum: CATEGORIES },
    });

    const idea = await DateIdea.create({
        ...validated,
        addedBy: user.name,
        coupleId: user.coupleId,
    });

    return NextResponse.json({ idea }, { status: 201 });
});

// PATCH — mark an idea as used
export const PATCH = withAuth(async (req, { user }) => {
    const body = await req.json();
    const { id, isUsed } = body;

    const idea = await DateIdea.findOneAndUpdate(
        { _id: id, coupleId: user.coupleId },
        { isUsed: Boolean(isUsed) },
        { new: true }
    );

    if (!idea) {
        return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json({ idea });
});
