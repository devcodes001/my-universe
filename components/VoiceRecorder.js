"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceRecorder({ onUploadComplete }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
                uploadAudio(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Please allow microphone access to record voice memories!");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const uploadAudio = async (blob) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", blob, "voice-memory.wav");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setAudioUrl(data.url);
                onUploadComplete(data.url);
            }
        } catch (err) {
            console.error("Audio upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-xl">🎙️</span>
                    <div>
                        <p className="text-sm font-bold text-white uppercase tracking-wider">Voice Memo</p>
                        <p className="text-[10px] text-white/40">Add your voice to this memory</p>
                    </div>
                </div>

                {!audioUrl ? (
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isRecording
                                ? "bg-red-500 animate-pulse"
                                : "bg-purple-600 hover:bg-purple-500"
                            }`}
                    >
                        {isRecording ? (
                            <div className="w-4 h-4 bg-white rounded-sm" />
                        ) : (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                            </svg>
                        )}
                    </motion.button>
                ) : (
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                        <span className="text-xs text-green-400 font-bold uppercase tracking-widest">Recorded</span>
                        <button
                            type="button"
                            onClick={() => setAudioUrl(null)}
                            className="text-white/40 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {uploading && (
                <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        className="h-full bg-purple-500"
                    />
                </div>
            )}
        </div>
    );
}
