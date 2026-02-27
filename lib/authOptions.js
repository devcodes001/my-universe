import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                const user = await User.findOne({ email: credentials.email }).select(
                    "+password"
                );

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const isValid = await user.comparePassword(credentials.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    coupleId: user.coupleId,
                    createdAt: user.createdAt,
                    anniversaryDate: user.anniversaryDate,
                    milestoneName: user.milestoneName,
                    togetherSince: user.togetherSince,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.coupleId = user.coupleId;
                token.createdAt = user.createdAt;
                token.anniversaryDate = user.anniversaryDate;
                token.milestoneName = user.milestoneName;
                token.togetherSince = user.togetherSince;
            }
            if (trigger === "update") {
                if (session?.anniversaryDate) token.anniversaryDate = session.anniversaryDate;
                if (session?.milestoneName) token.milestoneName = session.milestoneName;
                if (session?.togetherSince) token.togetherSince = session.togetherSince;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.coupleId = token.coupleId;
            session.user.createdAt = token.createdAt;
            session.user.anniversaryDate = token.anniversaryDate;
            session.user.milestoneName = token.milestoneName;
            session.user.togetherSince = token.togetherSince;
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
