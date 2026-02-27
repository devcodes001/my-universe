import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { validateBody } from "@/lib/validate";
import QuestionAnswer from "@/models/QuestionAnswer";

// Deep relationship questions pool
const QUESTIONS = [
    "What's something I do that makes you feel truly loved?",
    "If you could relive one day together, which would you choose?",
    "What's a dream you haven't told me about yet?",
    "What moment made you realize you loved me?",
    "What's your favorite inside joke between us?",
    "If our love story was a movie, what genre would it be?",
    "What's one thing you want us to do before we're old?",
    "What's your favorite physical feature of mine?",
    "What song makes you think of us?",
    "What's something small I do that means the world to you?",
    "Where do you see us in 5 years?",
    "What's a challenge we overcame that made us stronger?",
    "What were you thinking on our first date?",
    "What's one thing you'd change about how we communicate?",
    "What's your favorite memory of us this year?",
    "If you could describe our love in 3 words, what would they be?",
    "What's the bravest thing we've done together?",
    "What do you admire most about me?",
    "What's a tradition you'd love to start together?",
    "What makes our relationship different from others?",
    "What's something you've learned about yourself through us?",
    "If we had one day with no responsibilities, what would we do?",
    "What's the kindest thing I've ever done for you?",
    "What's one thing you wish I knew about you?",
    "What does 'home' mean to you in our relationship?",
    "What's a fear you have about the future that I can help with?",
    "What moment with me made you laugh the hardest?",
    "What do you think is our greatest strength as a couple?",
    "What's something you're grateful for about us today?",
    "If you wrote me a letter from the future, what would it say?",
];

// GET — get today's question + answers
export const GET = withAuth(async (req, { user }) => {
    const now = new Date();
    const dayOfYear = Math.floor(
        (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const questionIndex = dayOfYear % QUESTIONS.length;
    const questionId = `q-${now.getFullYear()}-${dayOfYear}`;
    const questionText = QUESTIONS[questionIndex];

    // Fetch answers for today's question
    const answers = await QuestionAnswer.find({
        coupleId: user.coupleId,
        questionId,
    }).lean();

    const myAnswer = answers.find((a) => a.userId.toString() === user.id);
    const partnerAnswer = answers.find((a) => a.userId.toString() !== user.id);
    const bothAnswered = answers.length >= 2;

    return NextResponse.json({
        questionId,
        questionText,
        myAnswer: myAnswer || null,
        // Only reveal partner's answer if both have answered
        partnerAnswer: bothAnswered ? partnerAnswer : (partnerAnswer ? { answered: true } : null),
        bothAnswered,
    });
});

// POST — submit an answer
export const POST = withAuth(async (req, { user }) => {
    const body = await req.json();
    const validated = validateBody(body, {
        questionId: { required: true, maxLength: 50 },
        questionText: { required: true, maxLength: 500 },
        answer: { required: true, maxLength: 2000 },
    });

    // Check if already answered
    const existing = await QuestionAnswer.findOne({
        coupleId: user.coupleId,
        questionId: validated.questionId,
        userId: user.id,
    });

    if (existing) {
        return NextResponse.json({ error: "Already answered today's question" }, { status: 400 });
    }

    const qa = await QuestionAnswer.create({
        ...validated,
        userId: user.id,
        authorName: user.name,
        coupleId: user.coupleId,
    });

    return NextResponse.json({ answer: qa }, { status: 201 });
});
