import React, { useState, useEffect } from 'react';
import api from '../service/api';
import { Customer } from '../domain/Customer';
import '../styles.css';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);

    // Load customers on component mount
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/customers');
            setCustomers(response.data);
        } catch (error: any) {
            setError('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const searchCustomers = async () => {
        if (!searchTerm.trim()) {
            loadCustomers();
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/api/admin/customers/search/${searchTerm}`);
            setCustomers(response.data);
        } catch (error: any) {
            setError('Failed to search customers');
        } finally {
            setLoading(false);
        }
    };

    const deleteCustomer = async (customerId: number) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        try {
            await api.delete(`/api/admin/customers/${customerId}`);
            setCustomers(customers.filter(c => c.userId !== customerId));
        } catch (error: any) {
            setError('Failed to delete customer');
        }
    };

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer({ ...customer });
        setShowEditForm(true);
    };

    const updateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomer) return;

        try {
            const response = await api.put('/api/admin/customers', selectedCustomer);
            setCustomers(customers.map(c =>
                c.userId === selectedCustomer.userId ? response.data : c
            ));
            setShowEditForm(false);
            setSelectedCustomer(null);
        } catch (error: any) {
            setError('Failed to update customer');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!selectedCustomer) return;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setSelectedCustomer({
                ...selectedCustomer,
                [parent]: {
                    ...(selectedCustomer as any)[parent],
                    [child]: value
                }
            });
        } else {
            setSelectedCustomer({
                ...selectedCustomer,
                [name]: value
            });
        }
    };

    return (
        <div className="admin-dashboard" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <h1 style={{ color: '#111827', fontSize: '2rem', fontWeight: 'bold' }}>
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="error-message" style={{ marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {/* Search Section */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Customer Management</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Search customers by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                            }}
                        />
                        <button
                            onClick={searchCustomers}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Search
                        </button>
                        <button
                            onClick={loadCustomers}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            All Customers
                        </button>
                    </div>
                </div>

                {/* Customers Table */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            Loading customers...
                        </div>
                    ) : customers.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            No customers found
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f9fafb' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Username</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Phone</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.userId} style={{ borderTop: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '1rem' }}>{customer.userId}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {customer.firstName} {customer.lastName}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{customer.userName}</td>
                                    <td style={{ padding: '1rem' }}>{customer.contact.email}</td>
                                    <td style={{ padding: '1rem' }}>{customer.contact.phoneNumber}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEditCustomer(customer)}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    backgroundColor: '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteCustomer(customer.userId)}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    backgroundColor: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Edit Customer Modal */}
                {showEditForm && selectedCustomer && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '12px',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}>
                            <h3 style={{ marginBottom: '1.5rem', color: '#111827' }}>
                                Edit Customer
                            </h3>
                            <form onSubmit={updateCustomer}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name:</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={selectedCustomer.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name:</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={selectedCustomer.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="userName">Username:</label>
                                        <input
                                            type="text"
                                            id="userName"
                                            name="userName"
                                            value={selectedCustomer.userName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contact.email">Email:</label>
                                        <input
                                            type="email"
                                            id="contact.email"
                                            name="contact.email"
                                            value={selectedCustomer.contact.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contact.phoneNumber">Phone:</label>
                                        <input
                                            type="tel"
                                            id="contact.phoneNumber"
                                            name="contact.phoneNumber"
                                            value={selectedCustomer.contact.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginTop: '2rem',
                                    justifyContent: 'flex-end'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditForm(false);
                                            setSelectedCustomer(null);
                                        }}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Update Customer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;