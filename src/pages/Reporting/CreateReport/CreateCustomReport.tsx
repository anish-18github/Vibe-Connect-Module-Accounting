import React, { useState } from "react";
import Header from "../../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import './createCustomReport.css'

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    // PDFDownloadLink,
} from "@react-pdf/renderer";
import { Globe, Lock, User } from "react-feather";

/* ---------- Types ---------- */

type StepId = 1 | 2 | 3 | 4;

const steps = [
    { id: 1, label: "General" },
    { id: 2, label: "Show / Hide Columns" },
    { id: 3, label: "Report Layout" },
    { id: 4, label: "Report Preferences" },
];

type ColumnItem = {
    id: string;
    label: string;
    group?: string;
    isDefault?: boolean;
};

const allColumns: ColumnItem[] = [
    { id: "accountDescription", label: "Account Description", group: "Reports" },
    { id: "yearToDate", label: "Year To Date", group: "Reports" },
    { id: "account", label: "Account (Reports)", isDefault: true },
    { id: "total", label: "Total (Reports)", isDefault: true },
];

type LayoutState = {
    details: {
        orgName: boolean;
        reportBasis: boolean;
        pageNumber: boolean;
        generatedBy: boolean;
        generatedDate: boolean;
        generatedTime: boolean;
    };
    tableDensity: "Classic" | "Compact" | "SuperCompact";
    autoResize: boolean;
    paperSize: "A4" | "LETTER";   // <-- NOTE: LETTER in all caps
    fontFamily: string;
    margins: {
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
};


/* ---------- Font registration for PDF (optional, needs font files) ---------- */

Font.register({
    family: "Ubuntu",
    src: "/fonts/Ubuntu-Regular.ttf",
});

Font.register({
    family: "Roboto",
    src: "/fonts/Roboto-Regular.ttf",
});

/* ---------- Main component ---------- */

const CreateCustomReport: React.FC = () => {

    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState<StepId>(1);
    const location = useLocation();

    const reportTypeFromState =
        (location.state as { reportType?: string } | null)?.reportType ?? "";

    // columns state for step 2
    const [available, setAvailable] = useState<ColumnItem[]>(
        allColumns.filter((c) => !c.isDefault)
    );
    const [selected, setSelected] = useState<ColumnItem[]>(
        allColumns.filter((c) => c.isDefault)
    );

    const [layout, setLayout] = useState<LayoutState>({
        details: {
            orgName: true,
            reportBasis: true,
            pageNumber: false,
            generatedBy: false,
            generatedDate: false,
            generatedTime: false,
        },
        tableDensity: "Classic",
        autoResize: true,
        paperSize: "A4",
        fontFamily: "Ubuntu",
        margins: {
            top: "0.7",
            bottom: "0.7",
            left: "0.55",
            right: "0.2",
        },
    });

    // sample data rows – replace with real report data
    const [rows] = useState<any[]>([
        {
            accountDescription: "Sales",
            yearToDate: "₹150,000",
            account: "4000",
            total: "₹150,000",
        },
        {
            accountDescription: "Expenses",
            yearToDate: "₹80,000",
            account: "5000",
            total: "₹80,000",
        },
    ]);

    const handleNext = () => {
        setActiveStep((prev) => (prev < 4 ? ((prev + 1) as StepId) : prev));
    };


    const handleCancel = () => {
        setActiveStep(1);
        navigate("/reporting");
    };

    const handleSaveReport = () => {
        // save logic here if needed
        navigate("/reporting/final-report");
        console.log("Saving custom report...");
    };


    return (
        <>
            <Header />

            <div
                className="sales-orders-page custom-report-steps"
                style={{ padding: "56px 0 0" }}
            >
                <div className="mx-5 mb-3 my-4">
                    <h4 className="mb-0">Create Custom Report</h4>
                </div>

                <div className="mx-5 mb-4 border-bottom pb-3">
                    <WizardSteps
                        steps={steps}
                        activeStep={activeStep}
                        onStepClick={setActiveStep}
                    />
                </div>

                <div className="mx-5">
                    {/* Step 1 */}
                    {activeStep === 1 && <GeneralStep />}

                    {/* Step 2 */}
                    {activeStep === 2 && (
                        <ShowHideStep
                            available={available}
                            selected={selected}
                            setAvailable={setAvailable}
                            setSelected={setSelected}
                        />
                    )}

                    {/* Step 3 */}
                    {activeStep === 3 && (
                        <ReportLayoutStep layout={layout} setLayout={setLayout} />
                    )}

                    {/* Step 4 */}
                    {activeStep === 4 && (
                        <ReportPreferencesStep initialReportName={reportTypeFromState} />
                    )}

                    {/* Buttons - CONDITIONAL TEXT & HANDLER */}
                    <div className="d-flex justify-content-center gap-3 mt-5 mb-5">
                        <button
                            type="button"
                            className="btn px-5"
                            style={{ background: activeStep === 4 ? "#7991BB" : "#7991BB", color: "#FFF" }}
                            onClick={activeStep === 4 ? handleSaveReport : handleNext}
                        >
                            {activeStep === 4 ? "Save Custom Report" : "Update"}
                        </button>

                        <button
                            type="button"
                            className="btn border me-3 px-4"
                            style={{ background: "#E5E7EB", color: "#111827" }}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default CreateCustomReport;

/* ---------- Step navigation ---------- */

interface WizardStepsProps {
    steps: { id: number; label: string }[];
    activeStep: number;
    onStepClick: (id: StepId) => void;
}

const WizardSteps: React.FC<WizardStepsProps> = ({
    steps,
    activeStep,
    onStepClick,
}) => (
    <div className="d-flex align-items-center gap-4">
        {steps.map((step) => {
            const isActive = step.id === activeStep;
            return (
                <button
                    key={step.id}
                    type="button"
                    className="border-0 bg-transparent d-flex align-items-center p-0"
                    onClick={() => onStepClick(step.id as StepId)}
                >
                    <span
                        className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
                        style={{
                            width: 32,
                            height: 32,
                            backgroundColor: isActive ? "#4B6CB7" : "#E5E7EB",
                            color: isActive ? "#FFFFFF" : "#111827",
                            fontWeight: 600,
                        }}
                    >
                        {step.id}
                    </span>
                    <span
                        style={{
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? "#111827" : "#6B7280",
                        }}
                    >
                        {step.label}
                    </span>
                </button>
            );
        })}
    </div>
);

/* ---------- Step 1: General ---------- */
const GeneralStep: React.FC = () => (
    <div className="so-details-card mb-4 mx-auto" style={{ maxWidth: 900 }}>
        {/* Card Header - Right aligned */}
        <div className="d-flex justify-content-end mb-4" style={{ marginRight: '-20px' }}>
            <div className="px-3 py- rounded" style={{ fontSize: '0.875rem', marginLeft: 'auto', marginRight: '207px' }}>
                <span className="fw-semibold text-muted">Compare Based on Period/ Year</span>
            </div>
        </div>

        {/* Fields Row - Perfectly aligned */}
        <div className="row gx-5 my-3">
            {/* Date Range - Left column */}
            <div className="col-md-6">
                <div className="so-form-group mb-0 h-100 d-flex flex-column">
                    <label className="so-label text-sm text-muted-foreground fw-bold mb-2">
                        Date Range
                    </label>
                    <select className="form-select so-control flex-grow-1">
                        <option value="Today">Today</option>
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                        <option value="This Quarter">This Quarter</option>
                        <option value="This Year">This Year</option>
                        <option value="Yesterday">Yesterday</option>
                        <option value="Previous Week">Previous Week</option>
                        <option value="Previous Month">Previous Month</option>
                        <option value="Previous Quarter">Previous Quarter</option>
                        <option value="Previous Year">Previous Year</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>
            </div>

            {/* Compare With - Right column */}
            <div className="col-md-6">
                <div className="so-form-group mb-0 h-100 d-flex flex-column">
                    <label className="so-label text-sm text-muted-foreground fw-bold mb-2">
                        Compare With
                    </label>
                    <select className="form-select so-control flex-grow-1">
                        <option value="None">None</option>
                        <option value="Previous Period">Previous Period</option>
                        <option value="Previous Year">Previous Year</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
);




/* ---------- Step 4 placeholder ---------- */

// interface PlaceholderProps {
//     title: string;
// }

// const PlaceholderStep: React.FC<PlaceholderProps> = ({ title }) => (
//     <div className="so-details-card mb-4 p-4" style={{ maxWidth: 520 }}>
//         <p className="text-muted mb-0">{title} configuration will go here.</p>
//     </div>
// );

/* ---------- Step 2: Show / Hide Columns (drag & drop) ---------- */

interface ShowHideProps {
    available: ColumnItem[];
    selected: ColumnItem[];
    setAvailable: React.Dispatch<React.SetStateAction<ColumnItem[]>>;
    setSelected: React.Dispatch<React.SetStateAction<ColumnItem[]>>;
}

const ShowHideStep: React.FC<ShowHideProps> = ({
    available,
    selected,
    setAvailable,
    setSelected,
}) => {
    const [search, setSearch] = useState("");

    const handleMove = (item: ColumnItem, fromAvailable: boolean) => {
        if (fromAvailable) {
            setAvailable((prev) => prev.filter((c) => c.id !== item.id));
            setSelected((prev) => [...prev, item]);
        } else {
            setSelected((prev) => prev.filter((c) => c.id !== item.id));
            setAvailable((prev) => [...prev, item]);
        }
    };

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        item: ColumnItem,
        from: "available" | "selected"
    ) => {
        e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ id: item.id, from })
        );
    };

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        target: "available" | "selected"
    ) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        if (!data) return;

        const { id, from } = JSON.parse(data) as {
            id: string;
            from: "available" | "selected";
        };

        if (from === target) return;

        const sourceList = from === "available" ? available : selected;
        const item = sourceList.find((c) => c.id === id);
        if (!item) return;

        handleMove(item, from === "available");
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const filteredAvailable = available.filter((c) =>
        c.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="so-details-card mb-4 p-4">
            <div className="row">
                {/* Available Columns */}
                <div className="col-md-5">
                    <h6 className="mb-2">Available Columns</h6>
                    <div className="mb-2">
                        <input
                            type="text"
                            className="form-control so-control"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div
                        className="border rounded bg-white"
                        style={{ minHeight: 260 }}
                        onDrop={(e) => handleDrop(e, "available")}
                        onDragOver={handleDragOver}
                    >
                        <div className="px-3 pt-2 text-muted small">Reports</div>
                        <div className="list-group border-0">
                            {filteredAvailable.map((item) => (
                                <div
                                    key={item.id}
                                    className="list-group-item border-0 py-1 small"
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, item, "available")
                                    }
                                    onDoubleClick={() => handleMove(item, true)}
                                    style={{ cursor: "grab" }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <div className="col-md-2 d-flex align-items-center justify-content-center">
                    <span style={{ fontSize: 24 }}>→</span>
                </div>

                {/* Selected Columns */}
                <div className="col-md-5">
                    <h6 className="mb-2">Selected Columns</h6>

                    <div
                        className="border rounded bg-white"
                        style={{ minHeight: 260 }}
                        onDrop={(e) => handleDrop(e, "selected")}
                        onDragOver={handleDragOver}
                    >
                        <div className="list-group border-0">
                            {selected.map((item) => (
                                <div
                                    key={item.id}
                                    className="list-group-item border-0 py-1 small"
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, item, "selected")
                                    }
                                    onDoubleClick={() => handleMove(item, false)}
                                    style={{ cursor: "grab" }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------- Step 3: Report Layout + Preview ---------- */

interface ReportLayoutProps {
    layout: LayoutState;
    setLayout: React.Dispatch<React.SetStateAction<LayoutState>>;
}



const ReportLayoutStep: React.FC<ReportLayoutProps> = ({
    layout,
    setLayout,
}) => {
    const handleDetailChange = (key: keyof LayoutState["details"]) => {
        setLayout((prev) => ({
            ...prev,
            details: { ...prev.details, [key]: !prev.details[key] },
        }));
    };

    const handleDensityChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value as LayoutState["tableDensity"];
        setLayout((prev) => ({ ...prev, tableDensity: value }));
    };

    const handleAutoResizeChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setLayout((prev) => ({ ...prev, autoResize: e.target.checked }));
    };

    const handlePaperSizeChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value as LayoutState["paperSize"]; // "A4" | "LETTER"
        setLayout((prev) => ({ ...prev, paperSize: value }));
    };


    const handleFontChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setLayout((prev) => ({ ...prev, fontFamily: e.target.value }));
    };

    const handleMarginChange = (
        key: keyof LayoutState["margins"],
        value: string
    ) => {
        setLayout((prev) => ({
            ...prev,
            margins: { ...prev.margins, [key]: value },
        }));
    };

    return (
        <div className="so-details-card mb-4 p-4">
            <div className="row">
                {/* Left controls */}
                <div className="col-lg-7">
                    <h6 className="mb-3">Choose Details to Display</h6>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="orgName"
                                    checked={layout.details.orgName}
                                    onChange={() => handleDetailChange("orgName")}
                                />
                                <label className="form-check-label" htmlFor="orgName">
                                    Organization Name
                                </label>
                            </div>
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="generatedBy"
                                    checked={layout.details.generatedBy}
                                    onChange={() => handleDetailChange("generatedBy")}
                                />
                                <label className="form-check-label" htmlFor="generatedBy">
                                    Generated By
                                </label>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="reportBasis"
                                    checked={layout.details.reportBasis}
                                    onChange={() => handleDetailChange("reportBasis")}
                                />
                                <label className="form-check-label" htmlFor="reportBasis">
                                    Report Basis
                                </label>
                            </div>
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="generatedDate"
                                    checked={layout.details.generatedDate}
                                    onChange={() => handleDetailChange("generatedDate")}
                                />
                                <label className="form-check-label" htmlFor="generatedDate">
                                    Generated Date
                                </label>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="pageNumber"
                                    checked={layout.details.pageNumber}
                                    onChange={() => handleDetailChange("pageNumber")}
                                />
                                <label className="form-check-label" htmlFor="pageNumber">
                                    Page Number
                                </label>
                            </div>
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="generatedTime"
                                    checked={layout.details.generatedTime}
                                    onChange={() => handleDetailChange("generatedTime")}
                                />
                                <label className="form-check-label" htmlFor="generatedTime">
                                    Generated Time
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Report layout options */}
                    <h6 className="mb-2">Report Layout</h6>
                    <div className="so-form-group mb-3">
                        <label className="so-label text-sm text-muted-foreground fw-bold">
                            Table Density:
                        </label>
                        <select
                            className="form-select so-control"
                            value={layout.tableDensity}
                            onChange={handleDensityChange}
                        >
                            <option value="Classic">Classic</option>
                            <option value="Compact">Compact</option>
                            <option value="SuperCompact">Super Compact</option>
                        </select>
                    </div>


                    <div className="form-check mb-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="autoResize"
                            checked={layout.autoResize}
                            onChange={handleAutoResizeChange}
                        />
                        <label className="form-check-label" htmlFor="autoResize">
                            Re-size the table and its font automatically to fit the content
                            within the table.
                        </label>
                    </div>

                    {/* Paper size */}
                    <div className="mb-3">
                        <div className="mb-1 fw-semibold text-muted">Paper Size</div>
                        <div className="d-flex align-items-center gap-4">
                            <label className="d-flex align-items-center gap-2">
                                <input
                                    type="radio"
                                    name="paperSize"
                                    value="A4"
                                    checked={layout.paperSize === "A4"}
                                    onChange={handlePaperSizeChange}
                                />
                                <span>A4</span>
                            </label>
                            <label className="d-flex align-items-center gap-2">
                                <input
                                    type="radio"
                                    name="paperSize"
                                    value="LETTER"                      // <-- LETTER
                                    checked={layout.paperSize === "LETTER"}
                                    onChange={handlePaperSizeChange}
                                />
                                <span>Letter</span>
                            </label>
                        </div>
                    </div>

                    {/* Font + margins */}
                    <div className="row mt-4">
                        <div className="col-md-6 mb-3">
                            <label className="so-label text-sm text-muted-foreground fw-bold">
                                Font Family
                            </label>
                            <select
                                className="form-select so-control"
                                value={layout.fontFamily}
                                onChange={handleFontChange}
                            >
                                <option value="Ubuntu">Ubuntu</option>
                                <option value="Roboto">Roboto</option>
                                <option value="System">System Default</option>
                            </select>
                            <small className="text-muted d-block mt-1">
                                Supports English and European languages. This font can also
                                render Indian Rupees symbol.
                            </small>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="so-label text-sm text-muted-foreground fw-bold d-block">
                                Margins
                            </label>
                            <div className="d-flex flex-wrap gap-2">
                                <div style={{ width: 70 }}>
                                    <input
                                        type="text"
                                        className="form-control so-control"
                                        value={layout.margins.top}
                                        onChange={(e) =>
                                            handleMarginChange("top", e.target.value)
                                        }
                                    />
                                    <small className="text-muted">Top</small>
                                </div>
                                <div style={{ width: 70 }}>
                                    <input
                                        type="text"
                                        className="form-control so-control"
                                        value={layout.margins.bottom}
                                        onChange={(e) =>
                                            handleMarginChange("bottom", e.target.value)
                                        }
                                    />
                                    <small className="text-muted">Bottom</small>
                                </div>
                                <div style={{ width: 70 }}>
                                    <input
                                        type="text"
                                        className="form-control so-control"
                                        value={layout.margins.left}
                                        onChange={(e) =>
                                            handleMarginChange("left", e.target.value)
                                        }
                                    />
                                    <small className="text-muted">Left</small>
                                </div>
                                <div style={{ width: 70 }}>
                                    <input
                                        type="text"
                                        className="form-control so-control"
                                        value={layout.margins.right}
                                        onChange={(e) =>
                                            handleMarginChange("right", e.target.value)
                                        }
                                    />
                                    <small className="text-muted">Right</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: HTML preview */}
                <div className="col-lg-5 d-flex justify-content-end">
                    <ReportLayoutPreview layout={layout} />
                </div>
            </div>
        </div>
    );
};

interface PreviewProps {
    layout: LayoutState;
}

const now = new Date();
const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0');
const year = now.getFullYear();
const currentDate = `${day}/${month}/${year}`;

const currentTime = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
});

const ReportLayoutPreview: React.FC<PreviewProps> = ({ layout }) => {
    // Dynamic values based on density
    const lines =
        layout.tableDensity === "SuperCompact"
            ? 12
            : layout.tableDensity === "Compact"
                ? 10
                : 8;

    const height =
        layout.tableDensity === "SuperCompact"
            ? 360
            : layout.tableDensity === "Compact"
                ? 380
                : 420;

    const lineHeight =
        layout.tableDensity === "SuperCompact"
            ? 6
            : layout.tableDensity === "Compact"
                ? 8
                : 12;

    const rowGap =
        layout.tableDensity === "SuperCompact"
            ? 4
            : layout.tableDensity === "Compact"
                ? 6
                : 10;

    return (
        <div
            className="border rounded p-3 shadow-sm transition-all duration-300"
            style={{
                width: 280,
                height: height,  // Dynamic height
                background: "white",
                display: "flex",
                flexDirection: "column",
                fontFamily: layout.fontFamily === "System" ? "inherit" : layout.fontFamily,
                position: "relative",
                overflow: "hidden",
                transition: "height 0.3s ease",  // Smooth height transition
            }}
        >
            {/* Header */}
            <div className={`p-${layout.tableDensity === "SuperCompact" ? "1" : "2"} pt-${layout.tableDensity === "SuperCompact" ? "2" : "3"}`}>
                {layout.details.orgName && (
                    <div className="text-center text-muted mb-1" style={{ fontSize: layout.tableDensity === "SuperCompact" ? 9 : 11 }}>
                        vibe
                    </div>
                )}
                {layout.details.reportBasis && (
                    <div className="text-center mb-1" style={{
                        fontSize: layout.tableDensity === "SuperCompact" ? 11 : 13,
                        fontWeight: 600
                    }}>
                        Basis: Accrual
                    </div>
                )}
            </div>

            {/* Table lines */}
            <div className={`flex-grow-1 p-${layout.tableDensity === "SuperCompact" ? "2" : "3"}`}>
                {/* Table header */}
                <div className={`d-flex mb-${rowGap / 2} pb-1 border-bottom opacity-75`} style={{ borderBottomColor: "#E5E7EB" }}>
                    <div className="flex-grow-1 h-2 bg-gray-400 rounded me-2" style={{ height: lineHeight / 2 }} />
                    <div className="w-16 h-2 bg-gray-400 rounded" style={{ height: lineHeight / 2 }} />
                </div>

                {/* Data rows */}
                {Array.from({ length: lines }).map((_, idx) => (
                    <div key={idx} style={{ marginBottom: `${rowGap}px` }}>
                        <div className="d-flex align-items-center py-0 border-bottom" style={{
                            borderBottomColor: "#F9FAFB",
                            borderBottomWidth: "0.5px",
                            padding: `${layout.tableDensity === "SuperCompact" ? "1px 0" : "2px 0"}px 0`
                        }}>
                            <div
                                className="flex-grow-1 me-2"
                                style={{
                                    height: lineHeight,
                                    background: "#ffff",
                                    borderRadius: 2
                                }}
                            />
                            <div
                                className="w-14"
                                style={{
                                    height: lineHeight,
                                    background: `linear-gradient(90deg, #10B981 0%, #34D399 100%)`,
                                    borderRadius: 2
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer - NO MORE "p..." */}
            <div
                style={{
                    fontSize: layout.tableDensity === "SuperCompact" ? 8 : 9,
                    borderTop: "1px solid #E5E7EB",
                    backgroundColor: "#F9FAFB",
                    padding: `${layout.tableDensity === "SuperCompact" ? "5px 6px" : "7px 8px"}`
                }}
            >
                <div className="d-flex align-items-center" style={{ height: '18px' }}>
                    {/* Left */}
                    <div style={{ width: '80px', flexShrink: 0 }}>
                        {layout.details.generatedBy && <span className="text-muted">John Doe</span>}
                    </div>

                    {/* Center - FIXED */}
                    <div className="flex-grow-1 text-center px-1" style={{ minWidth: '50px', maxWidth: '50px' }}>
                        {layout.details.pageNumber && <span className="text-muted fw-semibold">Pg 1</span>}
                    </div>

                    {/* Right: Date & Time */}
                    <div className="text-end" style={{
                        width: '105px',
                        flexShrink: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {layout.details.generatedDate && (
                            <span className="text-muted">
                                {currentDate}
                                {layout.details.generatedTime && <span>, {currentTime}</span>}
                            </span>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
};




interface ReportPreferencesProps {
    initialReportName?: string;
}


const ReportPreferencesStep: React.FC<ReportPreferencesProps> = ({
    initialReportName = "",
}) => {
    const [reportName, setReportName] = useState("");
    const [exportName, setExportName] = useState(initialReportName);
    const [description, setDescription] = useState("");
    const [shareWith, setShareWith] = useState<"me" | "selected" | "everyone">("me");

    React.useEffect(() => {
        setExportName(initialReportName);
    }, [initialReportName]);

    const radioBtnClass = (key: "me" | "selected" | "everyone") =>
        "btn w-100 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg active:scale-95";

    const radioBtnStyle = (key: "me" | "selected" | "everyone") =>
        shareWith === key
            ? { backgroundColor: "#7991BB", borderColor: "#7991BB", color: "#fff" }
            : { borderColor: "#ced4da" };



    return (
        <div className="so-details-card mb-4 p-4 mx-auto" style={{ maxWidth: 1200 }}>
            {/* THREE FIELDS IN ONE ROW */}
            <div className="row gx-5 p-3 mb-4 mt-2">
                {/* Report Name - 1/3 width */}
                <div className="col-md-4 ">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Report Name
                    </label>
                    <input
                        type="text"
                        className="form-control so-control"
                        value={reportName}
                        placeholder="Enter report name..."
                        onChange={(e) => setReportName(e.target.value)}
                    />
                </div>

                {/* Name in Export - 1/3 width */}
                <div className="col-md-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Name in Export
                    </label>
                    <input
                        type="text"
                        className="form-control so-control"
                        value={exportName}
                        onChange={(e) => setExportName(e.target.value)}
                    />
                </div>

                {/* Description - 1/3 width */}
                <div className="col-md-4">
                    <label className="so-label text-sm text-muted-foreground fw-bold">
                        Description
                    </label>
                    <textarea
                        className="form-control so-control"
                        rows={3}
                        value={description}
                        placeholder="Description..."
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            {/* Helper text box */}
            <div
                className="mb-4 p-3"
                style={{
                    background: "#F3F4F6",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#4B5563",
                }}
            >
                You can use report descriptions to help you identify the details of the
                reports for your reference.
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Configure Permissions */}
            <div>
                <h6 className="mb-3">Configure Permissions:</h6>
                <div className="border p-3" style={{ borderRadius: "5px" }}>
                    <div className="mb-3 fw-semibold">Share This with</div>

                    <div className="row g-3">
                        <div className="col-md-4">
                            <button
                                type="button"
                                className={`d-flex align-items-center justify-content-center  ${radioBtnClass("me")}`}
                                onClick={() => setShareWith("me")}
                                style={radioBtnStyle("me")}
                            >
                                <Lock size={14} className="me-2 flex-shrink-0" />
                                Only me
                            </button>
                        </div>

                        <div className="col-md-4">
                            <button
                                type="button"
                                className={`d-flex align-items-center justify-content-center  ${radioBtnClass("selected")}`}
                                onClick={() => setShareWith("selected")}
                                style={radioBtnStyle("selected")}
                            >
                                <User size={14} className="me-2 flex-shrink-0" />
                                Selected Users & Roles
                            </button>
                        </div>

                        <div className="col-md-4">
                            <button
                                type="button"
                                className={`d-flex align-items-center justify-content-center  ${radioBtnClass("everyone")}`}
                                onClick={() => setShareWith("everyone")}
                                style={radioBtnStyle("everyone")}
                            >
                                <Globe size={14} className="me-2 flex-shrink-0" />
                                Everyone
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};



/* ---------- PDF document using @react-pdf/renderer ---------- */

const createPdfStyles = (layout: LayoutState) =>
    StyleSheet.create({
        page: {
            paddingTop: Number(layout.margins.top || "0") * 72,
            paddingBottom: Number(layout.margins.bottom || "0") * 72,
            paddingLeft: Number(layout.margins.left || "0") * 72,
            paddingRight: Number(layout.margins.right || "0") * 72,
            fontFamily:
                layout.fontFamily === "System" ? "Helvetica" : layout.fontFamily,
            fontSize:
                layout.tableDensity === "Compact"
                    ? 9
                    : layout.tableDensity === "Comfortable"
                        ? 11
                        : 10,
        },
        headerOrg: {
            textAlign: "center",
            color: "#6B7280",
            fontSize: 10,
            marginBottom: 4,
        },
        headerTitle: {
            textAlign: "center",
            fontSize: 12,
            marginBottom: 12,
        },
        table: {
            marginTop: 8,
        },
        row: {
            flexDirection: "row",
            borderBottomWidth: 0.5,
            borderBottomColor: "#E5E7EB",
            paddingVertical:
                layout.tableDensity === "Compact"
                    ? 2
                    : layout.tableDensity === "SuperCompact"
                        ? 5
                        : 3,
        },
        headerRow: {
            borderBottomWidth: 1,
            borderBottomColor: "#9CA3AF",
            backgroundColor: "#F3F4F6",
        },
        cell: {
            flex: 1,
            fontSize: 9,
            paddingRight: 4,
        },
        cellHeader: {
            fontWeight: "bold",
        },
        footer: {
            marginTop: 16,
            fontSize: 8,
            color: "#6B7280",
        },
    });

interface ReportPdfProps {
    layout: LayoutState;
    columns: ColumnItem[];
    rows: any[];
}

const ReportPdfDocument: React.FC<ReportPdfProps> = ({
    layout,
    columns,
    rows,
}) => {
    const styles = createPdfStyles(layout);

    return (
        <Document>
            <Page size={layout.paperSize} style={styles.page}>
                {/* Header */}
                {layout.details.orgName && (
                    <Text style={styles.headerOrg}>vibe</Text>
                )}
                {layout.details.reportBasis && (
                    <Text style={styles.headerTitle}>Basis: Accrual</Text>
                )}

                {/* Table */}
                <View style={styles.table}>
                    {/* Header row */}
                    <View style={[styles.row, styles.headerRow]}>
                        {columns.map((col) => (
                            <Text
                                key={col.id}
                                style={[styles.cell, styles.cellHeader]}
                            >
                                {col.label}
                            </Text>
                        ))}
                    </View>

                    {/* Data rows */}
                    {rows.map((row, idx) => (
                        <View key={idx} style={styles.row}>
                            {columns.map((col) => (
                                <Text key={col.id} style={styles.cell}>
                                    {row[col.id] ?? ""}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    {layout.details.generatedBy && (
                        <Text>Generated By:  Doe</Text>
                    )}
                    {layout.details.generatedDate && (
                        <Text>Generated Date: 01 Jan 2025</Text>
                    )}
                    {layout.details.generatedTime && (
                        <Text>Generated Time: 10:30 AM</Text>
                    )}
                    {layout.details.pageNumber && <Text>Page 1</Text>}
                </View>
            </Page>
        </Document>
    );
};
