import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import Journal from "@/models/Journal";
import Reflection from "@/models/Reflection";
import LoveNote from "@/models/LoveNote";

/**
 * GET /api/streaks
 * Returns love streak counters:
 *   - daysTogether: total days since first user created account
 *   - daysSinceLastFight: days since last reflection entry
 *   - gratitudeStreak: consecutive days with love notes
 *   - journalStreak: consecutive days with journal entries (by couple)
 */
export const GET = withAuth(async (req, { user, session }) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // ─── Days Together ──────────────────────────────────
    // Use togetherSince if set, otherwise fall back to account creation date
    const togetherDate = session.user.togetherSince
        ? new Date(session.user.togetherSince)
        : new Date(session.user.createdAt || now);
    const daysTogether = Math.max(
        1,
        Math.floor((now - togetherDate) / (1000 * 60 * 60 * 24))
    );

    // ─── Days Since Last Fight ──────────────────────────
    const lastReflection = await Reflection.findOne({
        coupleId: user.coupleId,
    }).sort({ createdAt: -1 }).lean();

    let daysSinceLastFight = daysTogether; // default to all days if no fights
    if (lastReflection) {
        daysSinceLastFight = Math.floor(
            (now - new Date(lastReflection.createdAt)) / (1000 * 60 * 60 * 24)
        );
    }

    // ─── Journal Streak (consecutive days with entries) ─
    const journals = await Journal.find({ coupleId: user.coupleId })
        .sort({ date: -1 })
        .select("date")
        .lean();

    let journalStreak = 0;
    if (journals.length > 0) {
        const journalDates = new Set(
            journals.map((j) => new Date(j.date).toISOString().split("T")[0])
        );

        let checkDate = new Date(today);
        // Check if today has an entry; if not, start from yesterday
        if (!journalDates.has(checkDate.toISOString().split("T")[0])) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (journalDates.has(checkDate.toISOString().split("T")[0])) {
            journalStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }

    // ─── Gratitude Streak (consecutive days with love notes) ─
    const notes = await LoveNote.find({ coupleId: user.coupleId })
        .sort({ createdAt: -1 })
        .select("createdAt")
        .lean();

    let gratitudeStreak = 0;
    if (notes.length > 0) {
        const noteDates = new Set(
            notes.map((n) => new Date(n.createdAt).toISOString().split("T")[0])
        );

        let checkDate = new Date(today);
        if (!noteDates.has(checkDate.toISOString().split("T")[0])) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (noteDates.has(checkDate.toISOString().split("T")[0])) {
            gratitudeStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }

    return NextResponse.json({
        daysTogether,
        daysSinceLastFight,
        journalStreak,
        gratitudeStreak,
    });
});
