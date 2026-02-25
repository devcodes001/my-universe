import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import dbConnect from "@/lib/db";
import Pulse from "@/models/Pulse";

// GET — fetch the latest heart pulse from your partner
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        // Get the MOST RECENT pulse from the PARTNER
        const pulse = await Pulse.findOne({
            coupleId: session.user.coupleId,
            fromUserId: { $ne: session.user.id }
        }).sort({ lastPulse: -1 });

        return NextResponse.json({ pulse });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch pulse" }, { status: 500 });
    }
}

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        // Update or create pulse from current user
        const pulse = await Pulse.findOneAndUpdate(
            { coupleId: session.user.coupleId, fromUserId: session.user.id },
            { lastPulse: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json({ pulse });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send pulse" }, { status: 500 });
    }
}
