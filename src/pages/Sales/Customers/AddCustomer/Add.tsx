import React, { useState } from "react";
import Header from "../../../../components/Header/Header";

function AddCustomer() {
    // Example form state (add more fields as needed)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Form submitted:", formData);
        // TODO: API call or redux action

        alert("Data saved successfully!");
    };

    // Handle cancel button
    const handleCancel = () => {
        // Navigate back, clear form, or custom logic  
        console.log("Cancelled");
    };

    return (

        <>

            <Header />

            <div className="container mt-4" style={{ maxWidth: "600px" }}>
                <h2 className="mb-3">Add Customer</h2>

                <form onSubmit={handleSubmit}>

                    {/* Name Field */}
                    <div className="mb-3">
                        <label className="form-label">Customer Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                        <label className="form-label">Customer Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter customer email"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </div>

        </>


    );
}

export default AddCustomer;
