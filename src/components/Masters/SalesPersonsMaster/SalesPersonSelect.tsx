import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { X } from 'react-feather';
import api from '../../../services/api/apiConfig';
import './salesPersonsSelector.css';

interface SalesPerson {
    id: number;
    name: string;
    email: string;
}

interface Props {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SalesPersonSelect = ({ name, value, onChange }: Props) => {
    const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newPerson, setNewPerson] = useState({ name: '', email: '' });
    // const navigate = useNavigate();

    // Transform to react-select format
    const options = useMemo(() => [
        ...salesPersons.map(person => ({
            value: person.id.toString(),
            label: person.name,
        })),
        { value: '_add_new', label: '+ Add New Sales Person' }
    ], [salesPersons]);

    // Find selected option
    const selectedOption = useMemo(() => {
        if (!value) return null;
        return options.find(opt => opt.value === value) || null;
    }, [value, options]);

    const handleSelectChange = (selected: any) => {
        if (!selected) {
            onChange({
                target: { name, value: '' }
            } as React.ChangeEvent<HTMLSelectElement>);
            return;
        }

        if (selected.value === '_add_new') {
            setShowModal(true);
            onChange({
                target: { name, value: '' }
            } as React.ChangeEvent<HTMLSelectElement>);
            return;
        }

        onChange({
            target: { name, value: selected.value }
        } as React.ChangeEvent<HTMLSelectElement>);
    };

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

    const handleSave = async () => {
        if (!newPerson.name || !newPerson.email) return;

        try {
            setSaving(true);
            const res = await api.post('sales-persons/', newPerson);
            const created = res.data;

            setSalesPersons((prev) => [...prev, created]);

            onChange({
                target: { name, value: String(created.id) }
            } as React.ChangeEvent<HTMLSelectElement>);

            setShowModal(false);
            setNewPerson({ name: '', email: '' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="salesperson-select-container">
                <Select
                    name={name}
                    value={selectedOption}
                    onChange={handleSelectChange}
                    options={options}
                    isLoading={loading}
                    isSearchable
                    isClearable
                    placeholder={loading ? "Loading sales persons..." : "Select Sales Person"}
                    maxMenuHeight={200}
                    styles={customStyles}
                    classNamePrefix="salesperson-select"
                    menuPlacement="auto"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                />
            </div>

            {/* MODAL - Unchanged */}
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
                                    onChange={(e) => setNewPerson((p) => ({ ...p, name: e.target.value }))}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={newPerson.email}
                                    onChange={(e) => setNewPerson((p) => ({ ...p, email: e.target.value }))}
                                />
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
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
};

// EXACT SAME STYLES as CustomerSelect (copy-paste)
const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        minHeight: '32px',
        height: '36px',
        fontSize: '12px',
        lineHeight: '1.5',
        padding: '0 8px',
        borderRadius: '10px',
        border: state.isFocused ? '1px solid #80bdff' : '1px solid #d9d9d9',
        boxShadow: 'none !important',
        '&:hover': { borderColor: '#80bdff' },
        'input:focus': { outline: 'none !important', boxShadow: 'none !important' },
        'input:focus-within': { outline: 'none !important', boxShadow: 'none !important' },
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: '2px 8px',
        fontSize: '12px',
    }),
    input: (provided: any) => ({
        ...provided,
        fontSize: '12px',
        margin: '0',
        padding: '0',
        outline: 'none !important',
        boxShadow: 'none !important',
        border: 'none !important',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        fontSize: '12px',
        lineHeight: '1.2',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '12px',
        color: '#6c757d',
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 9999,
        marginTop: '2px',
        fontSize: '12px',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        fontSize: '12px',
        padding: '8px 12px',
        backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f8f9fa' : 'white',
        color: state.isSelected ? 'white' : '#212529',
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: '4px 8px',
        color: '#6c757d',
        '&:hover': { color: '#0056b3' },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    clearIndicator: (provided: any) => ({ ...provided, padding: '4px 8px' }),
};

export default SalesPersonSelect;
