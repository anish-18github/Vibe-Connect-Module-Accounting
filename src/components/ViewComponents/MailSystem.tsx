import { useState } from "react";
import { ChevronDown, AlertTriangle } from "react-feather";

const MailSystem = () => {
    const [openDropdown, setOpenDropdown] = useState(false);

    return (
        <div>

            {/* ================= TOP HEADER BAR ================= */}
            <div
                className="d-flex justify-content-between align-items-center px-3 py-2"
                style={{
                    background: "#D9D9D9",
                    borderRadius: "8px 8px 0 0",  // TOP ONLY
                    border: "none",
                }}
            >
                <span className="fw-semibold" style={{ fontSize: "15px" }}>
                    System Mails
                </span>

                {/* Dropdown Button */}
                <div
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpenDropdown(!openDropdown)}
                >
                    <div className="d-flex align-items-center gap-1 text-primary">
                        <span style={{ fontSize: "14px", fontWeight: 500 }}>Link Email Account</span>
                        <ChevronDown size={16} />
                    </div>

                    {/* ==================== DROPDOWN ==================== */}
                    {openDropdown && (
                        <div
                            className="position-absolute mt-2 shadow"
                            style={{
                                background: "#E7E6E6",
                                width: "180px",
                                right: 0,
                                borderRadius: "8px",
                                overflow: "hidden",
                                zIndex: 20
                            }}
                        >
                            {/* Outlook (active) */}
                            <div
                                style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    background: "#7792CA",
                                    color: "white",
                                    fontWeight: 500,
                                }}
                            >
                                Outlook
                            </div>

                            {/* Zoho Mail */}
                            <div
                                style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                }}
                            >
                                Zoho Mail
                            </div>

                            {/* Link with work account */}
                            <div
                                style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#000",
                                }}
                            >
                                Link with work account
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= MAIL CONTENT CARD ================= */}
            <div
                className="p-4 d-flex align-items-center justify-content-center gap-2"
                style={{
                    backgroundColor: "#EDEDED",
                    borderRadius: "0 0 8px 8px",
                    border: "none",
                    minHeight: "100px",
                }}
            >
                <AlertTriangle size={18} color="#ff9800" />

{/* Add this as a placeholder */}
                <span className="text-muted" style={{ fontSize: "15px" }}>
                    No emails sent.
                </span>
            </div>



        </div>
    );
};

export default MailSystem;
