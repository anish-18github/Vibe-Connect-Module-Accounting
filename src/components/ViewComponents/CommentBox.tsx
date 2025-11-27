import React, { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline } from "react-feather";
import "./viewComponent.css";

const CommentBox: React.FC = () => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const [comments, setComments] = useState<Array<{ id: number; html: string }>>([]);
    const [nextId, setNextId] = useState(1);

    // Apply formatting
    const applyFormat = (cmd: "bold" | "italic" | "underline") => {
        document.execCommand(cmd);
        editorRef.current?.focus();
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (document.activeElement !== editorRef.current) return;

            if (e.ctrlKey || e.metaKey) {
                const key = e.key.toLowerCase();

                if (key === "b") {
                    e.preventDefault();
                    applyFormat("bold");
                } else if (key === "i") {
                    e.preventDefault();
                    applyFormat("italic");
                } else if (key === "u") {
                    e.preventDefault();
                    applyFormat("underline");
                }
            }
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    // -------------------------
    // Add Comment (Temporary)
    // -------------------------
    const handleAddComment = () => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML.trim();

        if (!html || html === "<br>") return;

        const newComment = { id: nextId, html };

        setComments((prev) => [...prev, newComment]);
        setNextId((n) => n + 1);

        editorRef.current.innerHTML = "";
        editorRef.current.focus();

        // Auto-scroll to bottom smoothly
        setTimeout(() => {
            listRef.current?.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: "smooth",
            });
        }, 50);
    };

    return (
        <>
            <div className="comment-box border rounded shadow-sm">

                {/* Header */}
                <div
                    className="commentBox-header d-flex align-items-center gap-3 px-3 py-2"
                    style={{ background: "#E0E0E0", borderBottom: "1px solid #C4C4C4" }}
                >
                    <button
                        type="button"
                        className="btn btn-sm fw-bold"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            editorRef.current?.focus();
                            applyFormat("bold");
                        }}
                    >
                        <Bold size={17} strokeWidth={3} />
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm fw-bold"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            editorRef.current?.focus();
                            applyFormat("italic");
                        }}
                        style={{ fontStyle: "italic" }}
                    >
                        <Italic size={17} strokeWidth={3} />
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm fw-bold"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            editorRef.current?.focus();
                            applyFormat("underline");
                        }}
                        style={{ textDecoration: "underline" }}
                    >
                        <Underline size={17} strokeWidth={3} />
                    </button>
                </div>

                {/* Editor */}
                <div className="comment-area p-3">
                    <div
                        ref={editorRef}
                        className="comment-editor"
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            minHeight: 100,
                            border: "1px solid #D0D0D0",
                            borderRadius: 6,
                            padding: "8px 10px",
                            outline: "none",
                            fontSize: 14,
                            background: "#ffffff",
                        }}
                    />
                </div>

                {/* Footer */}
                <div className="d-flex justify-content-start px-3 pb-3">
                    <button
                        className="btn border btn-sm px-4 py-2"
                        style={{ borderColor: "#B6B6B6", color: "#5E5E5E" }}
                        onClick={handleAddComment}
                    >
                        Add Comment
                    </button>
                </div>
            </div>


            {/* Comments Section */}
            <div className="all-comments mt-4">

                {/* Title with Count */}
                <h6 className="fw-semibold mb-2" style={{ color: "#4A4A4A" }}>
                    All Comments <span className="text-muted">({comments.length})</span>
                </h6>

                {/* Scrollable Comment List */}
                <div
                    ref={listRef}
                    style={{
                        maxHeight: "240px",
                        overflowY: "auto",
                        paddingRight: "4px",
                        scrollSnapType: "y mandatory",
                        scrollBehavior: "smooth",
                    }}
                >
                    {comments.length === 0 ? (
                        <div
                            className="text-muted d-flex justify-content-center align-items-center"
                            style={{ height: "80px", fontSize: "14px" }}
                        >
                            No comments yet.
                        </div>
                    ) : (
                        comments.map((c, index) => (
                            <div
                                key={c.id}
                                className="p-3 mb-2 fade-in"
                                style={{
                                    background: "#fff",
                                    border: "1px solid #E6E6E6",
                                    borderRadius: 10,
                                    animation: "fadeIn 0.3s ease",
                                    scrollSnapAlign: "start",
                                }}
                            >
                                {/* Comment Header (Admin + Time) */}
                                <div className="d-flex align-items-center mb-2">
                                    {/* Avatar */}
                                    <div
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: "50%",
                                            background: "#0D6EFD",
                                            color: "white",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                    >
                                        A
                                    </div>

                                    {/* Name + Time */}
                                    <div className="ms-2">
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>Admin</div>
                                        <div style={{ fontSize: 12, color: "#6c757d" }}>Just now</div>
                                    </div>
                                </div>

                                {/* Comment Text */}
                                <div dangerouslySetInnerHTML={{ __html: c.html }} />

                                {/* Separator */}
                                {index !== comments.length - 1 && (
                                    <hr style={{ marginTop: "12px", marginBottom: "6px" }} />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

        </>
    );
};

export default CommentBox;
