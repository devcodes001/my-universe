import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";

/**
 * Higher-order function that wraps API route handlers with:
 * 1. Authentication check (session + coupleId)
 * 2. Database connection
 * 3. Consistent error handling
 *
 * Usage:
 *   export const GET = withAuth(async (req, { session, user }) => {
 *     // user = { id, coupleId, name, email, ... }
 *     return NextResponse.json({ data: "your response" });
 *   });
 */
export function withAuth(handler) {
    return async function (request, context) {
        try {
            const session = await getServerSession(authOptions);

            if (!session?.user?.id) {
                return NextResponse.json(
                    { error: "Unauthorized — please sign in" },
                    { status: 401 }
                );
            }

            if (!session.user.coupleId) {
                return NextResponse.json(
                    { error: "No couple link found — please complete setup" },
                    { status: 403 }
                );
            }

            await dbConnect();

            const user = {
                id: session.user.id,
                coupleId: session.user.coupleId,
                name: session.user.name,
                email: session.user.email,
            };

            return await handler(request, { session, user, ...context });
        } catch (error) {
            console.error(`[API Error] ${request.url}:`, error);
            return NextResponse.json(
                { error: error.message || "Internal server error" },
                { status: error.status || 500 }
            );
        }
    };
}
