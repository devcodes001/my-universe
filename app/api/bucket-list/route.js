import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import dbConnect from "@/lib/db";
import BucketItem from "@/models/BucketItem";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const items = await BucketItem.find({ coupleId: session.user.coupleId }).sort({ isCompleted: 1, createdAt: -1 });
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch bucket list" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const body = await request.json();

        const item = await BucketItem.create({
            ...body,
            coupleId: session.user.coupleId,
        });

        return NextResponse.json({ item }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save bucket item" }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { id, isCompleted, memoryId } = await request.json();

        const item = await BucketItem.findOneAndUpdate(
            { _id: id, coupleId: session.user.coupleId },
            {
                isCompleted,
                memoryId,
                completedDate: isCompleted ? new Date() : null
            },
            { new: true }
        );

        return NextResponse.json({ item });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update bucket item" }, { status: 500 });
    }
}
