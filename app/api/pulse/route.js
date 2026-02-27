import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import Pulse from "@/models/Pulse";

// GET — fetch the latest heart pulse from your partner
export const GET = withAuth(async (req, { user }) => {
    const pulse = await Pulse.findOne({
        coupleId: user.coupleId,
        fromUserId: { $ne: user.id },
    }).sort({ lastPulse: -1 });

    return NextResponse.json({ pulse });
});

// POST — send a heart pulse to your partner
export const POST = withAuth(async (req, { user }) => {
    const pulse = await Pulse.findOneAndUpdate(
        { coupleId: user.coupleId, fromUserId: user.id },
        { lastPulse: new Date() },
        { upsert: true, new: true }
    );

    return NextResponse.json({ pulse });
});
