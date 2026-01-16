import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import api from '../../services/api/apiConfig';

interface SalesPerson {
    id: number;
    name: string;
    email: string;
}

interface Props {
    name: string;                // IMPORTANT
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => void;
}

export default function SalesPersonSelect({
    name,
    value,
    onChange,
}: Props) {
    const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [newPerson, setNewPerson] = useState({
        name: '',
        email: '',
    });

    const handleSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedValue = e.target.value;

        if (selectedValue === '_add_new') {
            setShowModal(true);

            // reset dropdown so render is stable
            onChange({
                target: {
                    name,
                    value: '',
                },
            } as React.ChangeEvent<HTMLSelectElement>);

            return;
        }

        onChange(e);
    };


    // ---------------- fetch list ----------------
    const fetchSalesPersons = async () => {
        try {
            setLoading(true);
            const res = await api.get('sales-persons/');
            setSalesPersons(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesPersons();
    }, []);

    // ---------------- save ----------------
    const handleSave = async () => {
        if (!newPerson.name || !newPerson.email) return;

        try {
            setSaving(true);
            const res = await api.post('sales-persons/', newPerson);
            const created = res.data;

            setSalesPersons((prev) => [...prev, created]);

            // 🔥 Select newly created sales person
            onChange({
                target: {
                    name,
                    value: String(created.id),
                },
            } as React.ChangeEvent<HTMLSelectElement>);

            setShowModal(false);
            setNewPerson({ name: '', email: '' });
        } finally {
            setSaving(false);
        }
    };


    return (
        <>
            {/* -------- SELECT -------- */}
            <select
                name={name}
                className="form-select so-control"
                value={value}
                onChange={handleSelectChange}
                disabled={loading}
            >
                <option value="" disabled>
                    {loading ? 'Loading sales persons...' : 'Select Sales Person'}
                </option>

                {salesPersons.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}

                <option value="_add_new">+ Add New</option>
            </select>


            {/* intercept add new */}
            {value === '_add_new' && setShowModal(true)}

            {/* -------- MODAL -------- */}
            {showModal && (
                <div className="settings-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="settings-modal opening"
                        style={{ maxWidth: 420 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header custom-header">
                            <h4 className="mb-0" style={{ fontSize: 17 }}>Add Sales Person</h4>
                            <X
                                size={20}
                                style={{ cursor: 'pointer', marginRight: 15, color: '#f00e0eff' }}
                                onClick={() => setShowModal(false)}
                            />
                        </div>

                        <div className="modal-body px-4 pb-4">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Name</label>
                                <input
                                    className="form-control"
                                    value={newPerson.name}
                                    onChange={(e) =>
                                        setNewPerson((p) => ({ ...p, name: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={newPerson.email}
                                    onChange={(e) =>
                                        setNewPerson((p) => ({ ...p, email: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-primary px-4"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save & Select'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
