import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import api from '../../../services/api/apiConfig';
import './customerSelector.css';

interface Customer {
    customerId: number;
    name: string;
}

interface Props {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CustomerSelect = ({ name, value, onChange }: Props) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Transform customers to react-select format
    const options = useMemo(() => [
        ...customers.map(customer => ({
            value: customer.customerId.toString(),
            label: customer.name,
        })),
        { value: '_add_new', label: '+ New Customer' }
    ], [customers]);

    // Find selected option
    const selectedOption = useMemo(() => {
        if (!value) return null;
        return options.find(opt => opt.value === value) || null;
    }, [value, options]);

    const handleSelectChange = (selected: any) => {
        if (!selected) {
            // Clear selection
            onChange({
                target: { name, value: '' }
            } as React.ChangeEvent<HTMLSelectElement>);
            return;
        }

        if (selected.value === '_add_new') {
            sessionStorage.setItem('returnAfterCustomer', window.location.pathname);
            navigate('/sales/add-customer', { state: { fromCustomerSelect: true } });
            return;
        }

        // Emit native select event for parent compatibility
        onChange({
            target: { name, value: selected.value }
        } as React.ChangeEvent<HTMLSelectElement>);
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await api.get<Customer[]>('customers/');
            setCustomers(res.data);
        } finally {
            setLoading(false);
        }
    };

    // Initial load + auto-refresh after redirect
    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const returnPath = sessionStorage.getItem('returnAfterCustomer');
        if (returnPath === window.location.pathname) {
            fetchCustomers();
            sessionStorage.removeItem('returnAfterCustomer');
        }
    }, []);

    return (
        <div className="customer-select-container fw-normal">
            <Select
                name={name}
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                isLoading={loading}
                isSearchable
                isClearable
                placeholder={loading ? "Loading customers..." : "Select Customer"}
                maxMenuHeight={200}
                styles={customStyles}
                classNamePrefix="customer-select"
                menuPlacement="auto"
                menuPortalTarget={document.body} // Prevents z-index issues
                menuPosition="fixed"
            />
        </div>
    );
};

// Custom styles to match your Bootstrap theme
const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        minHeight: '32px !important',
        height: '36px !important',
        fontSize: '12px !important',
        lineHeight: '1.5 !important',
        padding: '0 8px !important',
        borderRadius: '10px !important',
        border: state.isFocused ? '1px solid #80bdff !important' : '1px solid #d9d9d9 !important',
        boxShadow: 'none !important',
    }),

    valueContainer: (provided: any) => ({
        ...provided,
        padding: '2px 8px !important',
        fontSize: '12px !important',
    }),

    input: (provided: any) => ({
        ...provided,
        fontSize: '12px !important',
        margin: '0 !important',
        padding: '0 !important',
        outline: 'none !important',
        boxShadow: 'none !important',
        border: 'none !important',
    }),

    singleValue: (provided: any) => ({
        ...provided,
        fontSize: '12px !important',
        lineHeight: '1.2 !important',
    }),

    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '12px !important',
        color: '#6c757d !important',
    }),

    menu: (provided: any) => ({
        ...provided,
        zIndex: '9999!important',
        marginTop: '2px !important',
        fontSize: '12px !important',
    }),

    option: (provided: any, state: any) => ({
        ...provided,
        fontSize: '12px !important',
        padding: '8px 12px !important',
        backgroundColor: state.isSelected
            ? '#007bff !important'
            : state.isFocused
                ? '#f8f9fa !important'
                : 'white !important',
        color: state.isSelected ? 'white !important' : '#212529 !important',
    }),

    // ... rest unchanged
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: '4px 8px !important',
        color: '#6c757d !important',
    }),
    indicatorSeparator: () => ({ display: 'none !important' }),
    clearIndicator: (provided: any) => ({ ...provided, padding: '4px 8px !important' }),
};



export default CustomerSelect;
