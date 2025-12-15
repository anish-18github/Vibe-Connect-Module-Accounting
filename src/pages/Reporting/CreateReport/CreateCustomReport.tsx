import React, { useState } from "react";
import Header from "../../../components/Header/Header";
// import Header from "../../../components/Header/Header";
// import Navbar from "../../../components/Navbar/NavBar";
// import { dashboardTabs } from "../../Dashboard/dashboard";

type StepId = 1 | 2 | 3 | 4;

const steps = [
    { id: 1, label: "General" },
    { id: 2, label: "Show / Hide Columns" },
    { id: 3, label: "Report Layout" },
    { id: 4, label: "Report Preferences" },
];

const CreateCustomReport: React.FC = () => {
    const [activeStep, setActiveStep] = useState<StepId>(1);

    const handleNext = () => {
        setActiveStep((prev) => (prev < 4 ? ((prev + 1) as StepId) : prev));
    };

    const handleCancel = () => {
        // you can navigate(-1) here if needed
        setActiveStep(1);
    };

    return (
        <>
            <Header />

            <div className="sales-orders-page" style={{ padding: "56px 0 0" }}>
                {/* <Navbar tabs={dashboardTabs} /> */}

                {/* Page title */}
                <div className="mx-5 mb-3 my-4">
                    <h4 className="mb-0">Create Custom Report</h4>
                </div>

                {/* Progress navbar */}
                <div className="mx-5 mb-4 border-bottom pb-3">
                    <WizardSteps
                        steps={steps}
                        activeStep={activeStep}
                        onStepClick={setActiveStep}
                    />
                </div>

                {/* Step content */}
                <div className="mx-5">
                    {activeStep === 1 && <GeneralStep />}
                    {activeStep === 2 && (
                        <PlaceholderStep title="Show / Hide Columns" />
                    )}
                    {activeStep === 3 && <PlaceholderStep title="Report Layout" />}
                    {activeStep === 4 && (
                        <PlaceholderStep title="Report Preferences" />
                    )}

                    {/* Buttons */}
                    <div className="d-flex justify-content-center gap-3 mt-5 mb-5">
                        <button
                            type="button"
                            className="btn px-5"
                            style={{ background: "#7991BB", color: "#FFF" }}
                            onClick={handleNext}
                        >
                            Update
                        </button>

                        <button
                            type="button"
                            className="btn px-5"
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

interface WizardStepsProps {
    steps: { id: number; label: string }[];
    activeStep: number;
    onStepClick: (id: StepId) => void;
}

const WizardSteps: React.FC<WizardStepsProps> = ({
    steps,
    activeStep,
    onStepClick,
}) => {
    return (
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
};

const GeneralStep: React.FC = () => {
    return (
        <div className="so-details-card mb-4" style={{ maxWidth: 520 }}>
            {/* Date Range */}
            <div className="so-form-group mb-4">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                    Date Range
                </label>
                <input type="text" className="form-control so-control" />
            </div>

            {/* Compare title */}
            <div className="mb-2 fw-semibold text-muted">Compare</div>

            {/* Compare Based on Period / Year */}
            <div className="so-form-group mb-3">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                    Compare Based on Period/ Year
                </label>
                <input type="text" className="form-control so-control" />
            </div>

            {/* Compare With */}
            <div className="so-form-group mb-0">
                <label className="so-label text-sm text-muted-foreground fw-bold">
                    Compare With
                </label>
                <select className="form-select so-control">
                    <option value="None">None</option>
                    <option value="Previous Period">Previous Period</option>
                    <option value="Previous Year">Previous Year</option>
                </select>
            </div>
        </div>
    );
};

interface PlaceholderProps {
    title: string;
}

const PlaceholderStep: React.FC<PlaceholderProps> = ({ title }) => (
    <div className="so-details-card mb-4 p-4" style={{ maxWidth: 520 }}>
        <p className="text-muted mb-0">{title} configuration will go here.</p>
    </div>
);

export default CreateCustomReport;
