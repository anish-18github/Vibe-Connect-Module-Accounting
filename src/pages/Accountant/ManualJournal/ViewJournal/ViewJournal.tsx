// import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import jsPDF from "jspdf"

export default function ViewJournal() {
    const navigate = useNavigate();
    const { id } = useParams(); // assuming route: /accountant/view-journal/:id

    // TODO: replace this with real data lookup using `id`
    const journal = {
        id,
        journal: "Opening Balance Adjustment",
        referenceNo: "MJ-0001",
        status: "Posted",
        notes: "Opening balance for FY 24-25",
        amount: 5000,
        currency: "INR",
        createdOn: "2025-12-05",
        createdBy: "Admin",
    };

    // ---- DOWNLOAD PDF ----
    const handleDownloadPdf = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Manual Journal", 14, 18);

        doc.setFontSize(11);
        let y = 30;

        doc.text(`Journal: ${journal.journal}`, 14, y); y += 7;
        doc.text(`Reference No: ${journal.referenceNo}`, 14, y); y += 7;
        doc.text(`Status: ${journal.status}`, 14, y); y += 7;
        doc.text(`Date: ${journal.createdOn}`, 14, y); y += 7;
        doc.text(`Created By: ${journal.createdBy}`, 14, y); y += 10;

        doc.text(`Amount: ${journal.amount} ${journal.currency}`, 14, y); y += 10;

        doc.text("Notes:", 14, y); y += 6;
        doc.text(journal.notes || "-", 14, y, { maxWidth: 180 });

        doc.save(`journal-${journal.referenceNo}.pdf`);
    };

    // ---- SEND PDF (placeholder) ----
    const handleSendPdf = () => {
        // Real implementation: generate PDF Blob and POST to your backend / mail API
        alert("Send PDF: here you can call your API with the generated PDF.");
    };

    // ---- EDIT JOURNAL ----
    const handleEdit = () => {
        navigate(`/accountant/edit-manualJournal/${journal.id}`);
    };

    return (
        <>
            <Header />

            {/* Top bar with title + actions */}
            <div className="d-flex justify-content-between align-items-center px-4 pt-3">
                <h1 className="h5 mb-0">Manual Journal</h1>

                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleSendPdf}
                    >
                        Send PDF
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={handleDownloadPdf}
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            {/* “PDF-like” preview card */}
            <div className="px-4 pb-4 pt-3">
                <div
                    className="bg-white shadow-sm"
                    style={{
                        borderRadius: 8,
                        padding: "24px 32px",
                        maxWidth: 800,
                        margin: "0 auto",
                    }}
                >
                    {/* Header section */}
                    <div className="d-flex justify-content-between mb-3">
                        <div>
                            <h2 className="h6 mb-1">Manual Journal</h2>
                            <div className="small text-muted">
                                Journal #{journal.referenceNo}
                            </div>
                        </div>
                        <div className="text-end small">
                            <div>
                                <strong>Date:</strong> {journal.createdOn}
                            </div>
                            <div>
                                <strong>Status:</strong> {journal.status}
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* Basic details */}
                    <div className="row small mb-2">
                        <div className="col-sm-6 mb-1">
                            <strong>Journal:</strong> {journal.journal}
                        </div>
                        <div className="col-sm-6 mb-1">
                            <strong>Created By:</strong> {journal.createdBy}
                        </div>
                    </div>

                    <div className="row small mb-2">
                        <div className="col-sm-6 mb-1">
                            <strong>Reference No:</strong> {journal.referenceNo}
                        </div>
                        <div className="col-sm-6 mb-1">
                            <strong>Currency:</strong> {journal.currency}
                        </div>
                    </div>

                    <div className="row small mb-3">
                        <div className="col-sm-6 mb-1">
                            <strong>Amount:</strong> {journal.amount.toFixed
                                ? journal.amount.toFixed(2)
                                : journal.amount}{" "}
                            {journal.currency}
                        </div>
                    </div>

                    <hr />

                    {/* Notes */}
                    <div className="small">
                        <strong>Notes</strong>
                        <div className="mt-1 text-muted">
                            {journal.notes || "-"}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
