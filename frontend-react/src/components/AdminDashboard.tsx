import React, { useState, useEffect } from 'react';
import api from '../service/api';
import { Customer } from '../domain/Customer';
import '../styles.css';

interface AdminDashboardProps {
    onLogout?: () => void; // ✅ renamed and made optional
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);

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

    // rest of your code unchanged...

    return (
        <div className="admin-dashboard">
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
                    {onLogout && ( // ✅ only render if provided
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
                    )}
                </div>

                {/* Rest of the dashboard code... */}
            </div>
        </div>
    );
};

export default AdminDashboard;
