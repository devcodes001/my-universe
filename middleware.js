import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth/login",
    },
});

// Protect all app routes — require authentication
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/memories/:path*",
        "/letters/:path*",
        "/journal/:path*",
        "/bucket-list/:path*",
    ],
};
