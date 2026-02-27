import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import Memory from "@/models/Memory";

const MOODS = ["❤️", "😊", "🥰", "✨", "🌟", "🎉", "🥺", "💫"];
const CATEGORIES = ["milestone", "date", "travel", "everyday", "special"];

// GET — fetch all memories for the couple (with pagination)
export const GET = withAuth(async (req, { user }) => {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const skip = (page - 1) * limit;

    const [memories, total] = await Promise.all([
        Memory.find({ coupleId: user.coupleId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Memory.countDocuments({ coupleId: user.coupleId }),
    ]);

    return NextResponse.json({
        memories,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

// POST — create a new memory
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();

    const validated = validateBody(body, {
        title: { required: true, maxLength: 200 },
        description: { maxLength: 2000 },
        date: { required: true, type: "date" },
        category: { enum: CATEGORIES },
        mood: { enum: MOODS },
        imageUrl: { maxLength: 500 },
        audioUrl: { maxLength: 500 },
    });

    const memory = await Memory.create({
        ...validated,
        userId: user.id,
        coupleId: user.coupleId,
    });

    return NextResponse.json({ memory }, { status: 201 });
});

// DELETE — delete a memory (only own memories)
export const DELETE = withAuth(async (req, { user }) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Memory ID is required" }, { status: 400 });
    }

    const memory = await Memory.findOne({
        _id: id,
        coupleId: user.coupleId,
    });

    if (!memory) {
        return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    await Memory.deleteOne({ _id: id });

    return NextResponse.json({ message: "Memory deleted" });
});
