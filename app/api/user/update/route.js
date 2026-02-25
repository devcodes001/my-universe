import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { anniversaryDate, milestoneName } = await request.json();

        const user = await User.findByIdAndUpdate(
            session.user.id,
            {
                anniversaryDate: anniversaryDate ? new Date(anniversaryDate) : undefined,
                milestoneName
            },
            { new: true }
        );

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
