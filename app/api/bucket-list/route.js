import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import BucketItem from "@/models/BucketItem";

// GET — fetch all bucket list items for the couple
export const GET = withAuth(async (req, { user }) => {
    const items = await BucketItem.find({ coupleId: user.coupleId })
        .sort({ isCompleted: 1, createdAt: -1 })
        .lean();

    return NextResponse.json({ items });
});

// POST — add a new bucket list item
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();

    const validated = validateBody(body, {
        title: { required: true, maxLength: 200 },
        description: { maxLength: 1000 },
    });

    const item = await BucketItem.create({
        ...validated,
        coupleId: user.coupleId,
    });

    return NextResponse.json({ item }, { status: 201 });
});

// PATCH — toggle completion of a bucket list item
export const PATCH = withAuth(async (req, { user }) => {
    const body = await req.json();

    const validated = validateBody(body, {
        id: { required: true, maxLength: 30 },
        isCompleted: { type: "boolean" },
    });

    const item = await BucketItem.findOneAndUpdate(
        { _id: validated.id, coupleId: user.coupleId },
        {
            isCompleted: validated.isCompleted,
            completedDate: validated.isCompleted ? new Date() : null,
        },
        { new: true }
    );

    if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
});
