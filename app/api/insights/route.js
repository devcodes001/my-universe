import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import Memory from "@/models/Memory";
import Journal from "@/models/Journal";

/**
 * GET /api/insights
 * Returns:
 *   - onThisDay: memories & journals from this date in previous years
 *   - moodTrend: last 7 days of mood data
 *   - stats: total counts and streaks
 */
export const GET = withAuth(async (req, { user }) => {
    const now = new Date();
    const todayMonth = now.getMonth();
    const todayDay = now.getDate();

    // ─── On This Day ────────────────────────────────────
    // Find memories that happened on this month+day in any year
    const allMemories = await Memory.find({ coupleId: user.coupleId }).lean();
    const onThisDayMemories = allMemories.filter((m) => {
        const d = new Date(m.date);
        return d.getMonth() === todayMonth && d.getDate() === todayDay && d.getFullYear() !== now.getFullYear();
    });

    const allJournals = await Journal.find({ coupleId: user.coupleId }).lean();
    const onThisDayJournals = allJournals.filter((j) => {
        const d = new Date(j.date);
        return d.getMonth() === todayMonth && d.getDate() === todayDay && d.getFullYear() !== now.getFullYear();
    });

    // ─── Mood Trend (last 14 days) ──────────────────────
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentJournals = allJournals
        .filter((j) => new Date(j.date) >= fourteenDaysAgo)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const moodMap = {};
    recentJournals.forEach((j) => {
        const dateKey = new Date(j.date).toISOString().split("T")[0];
        if (!moodMap[dateKey]) moodMap[dateKey] = [];
        moodMap[dateKey].push(j.mood);
    });

    const moodTrend = Object.entries(moodMap).map(([date, moods]) => ({
        date,
        moods,
        count: moods.length,
    }));

    // ─── Daily Prompt ───────────────────────────────────
    const prompts = [
        "What made you smile today thinking about your partner?",
        "Describe a small moment together that meant the world.",
        "What's something your partner does that you find adorable?",
        "Write about a dream you both share for the future.",
        "What song reminds you of your relationship right now?",
        "If you could relive one day together, which would it be?",
        "What's something new you learned about your partner recently?",
        "Describe how your partner makes ordinary moments special.",
        "What are you most grateful for in your relationship today?",
        "Write a message your future self would love to read.",
        "What's the bravest thing you've done together?",
        "Describe the feeling when you see your partner after time apart.",
        "What inside joke always makes you both laugh?",
        "What quality in your partner inspires you the most?",
        "If your love story was a movie, what would today's scene be?",
        "What's a tiny detail about your partner others might not notice?",
        "Describe the most peaceful moment you've shared recently.",
        "What adventure do you want to plan together next?",
        "Write about a challenge you overcame together.",
        "What would you whisper to your partner right now?",
        "What tradition would you love to start together?",
        "Describe the color of your love today.",
        "What's something your partner said that you'll never forget?",
        "If you could give your partner one superpower, what would it be?",
        "What three words describe your relationship this week?",
        "Write about a favorite meal you've shared together.",
        "What makes your partner your safe place?",
        "Describe a moment when your partner surprised you.",
        "What's on your couple bucket list that excites you most?",
        "If your partner could read your mind right now, what would they see?",
    ];

    // Use day of year as seed for consistent daily prompt
    const dayOfYear = Math.floor(
        (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const dailyPrompt = prompts[dayOfYear % prompts.length];

    // ─── Stats ──────────────────────────────────────────
    const totalMemories = allMemories.length;
    const totalJournals = allJournals.length;

    return NextResponse.json({
        onThisDay: {
            memories: onThisDayMemories,
            journals: onThisDayJournals,
            hasContent: onThisDayMemories.length > 0 || onThisDayJournals.length > 0,
        },
        moodTrend,
        dailyPrompt,
        stats: {
            totalMemories,
            totalJournals,
        },
    });
});
