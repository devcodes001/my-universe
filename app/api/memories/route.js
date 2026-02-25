import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import dbConnect from "@/lib/db";
import Memory from "@/models/Memory";

// GET — fetch all memories for the couple
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const memories = await Memory.find({ coupleId: session.user.coupleId })
            .sort({ date: -1 })
            .lean();

        return NextResponse.json({ memories });
    } catch (error) {
        console.error("Get memories error:", error);
        return NextResponse.json(
            { error: "Failed to fetch memories" },
            { status: 500 }
        );
    }
}

// POST — create a new memory
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const memory = await Memory.create({
            ...body,
            userId: session.user.id,
            coupleId: session.user.coupleId,
        });

        return NextResponse.json({ memory }, { status: 201 });
    } catch (error) {
        console.error("Create memory error:", error);
        return NextResponse.json(
            { error: "Failed to create memory" },
            { status: 500 }
        );
    }
}

// DELETE — delete a memory
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        const memory = await Memory.findOne({
            _id: id,
            coupleId: session.user.coupleId,
        });

        if (!memory) {
            return NextResponse.json(
                { error: "Memory not found" },
                { status: 404 }
            );
        }

        await Memory.deleteOne({ _id: id });

        return NextResponse.json({ message: "Memory deleted" });
    } catch (error) {
        console.error("Delete memory error:", error);
        return NextResponse.json(
            { error: "Failed to delete memory" },
            { status: 500 }
        );
    }
}
