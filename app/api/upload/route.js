import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request) {
    try {
        // Auth check — was missing before!
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.formData();
        const file = data.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 10MB." },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "audio/webm", "audio/mp4", "audio/mpeg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Unsupported file type" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "our-universe",
                        resource_type: "auto",
                        // Limit image dimensions for performance
                        transformation: file.type.startsWith("image/")
                            ? [{ width: 1920, height: 1920, crop: "limit", quality: "auto:good", format: "auto" }]
                            : undefined,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
