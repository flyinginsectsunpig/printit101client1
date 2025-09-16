import React, { useState, useEffect } from "react";
import api from "../service/api";
import { Customer } from "../domain/Customer";

interface AdminDashboardProps {
    onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState<Customer>({
        userId: 0,
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        role: "CUSTOMER",
        customerDiscount: 0,
        address: {
            addressId: 0,
            propertyNumber: 0,
            buildingName: "",
            unitNumber: 0,
            poBoxNumber: 0,
            street: "",
            municipality: "",
            province: "",
            postalCode: "",
            country: "",
        },
        contact: {
            contactId: 0,
            phoneNumber: "",
            email: "",
        },
    });

    // Load all customers on mount
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await api.get<Customer[]>("/api/admin/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error("Failed to load customers", error);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            loadCustomers();
            return;
        }
        try {
            const response = await api.get<Customer[]>(
                `/api/admin/customers/search/${searchTerm}`
            );
            setCustomers(response.data);
        } catch (error) {
            console.error("Failed to search customers", error);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;
        try {
            await api.delete(`/api/admin/customers/${userId}`);
            setCustomers(customers.filter((c) => c.userId !== userId));
        } catch (error) {
            console.error("Failed to delete customer", error);
        }
    };

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setFormData(customer);
        setShowForm(true);
    };

    const handleCreate = () => {
        setSelectedCustomer(null);
        setFormData({
            userId: 0,
            firstName: "",
            lastName: "",
            userName: "",
            password: "",
            role: "CUSTOMER",
            customerDiscount: 0,
            address: {
                addressId: 0,
                propertyNumber: 0,
                buildingName: "",
                unitNumber: 0,
                poBoxNumber: 0,
                street: "",
                municipality: "",
                province: "",
                postalCode: "",
                country: "",
            },
            contact: {
                contactId: 0,
                phoneNumber: "",
                email: "",
            },
        });
        setShowForm(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedCustomer) {
                // Update
                const response = await api.put<Customer>("/api/admin/customers", formData);
                setCustomers(
                    customers.map((c) =>
                        c.userId === response.data.userId ? response.data : c
                    )
                );
            } else {
                // Create
                const response = await api.post<Customer>("/api/admin/customers", formData);
                setCustomers([...customers, response.data]);
            }
            setShowForm(false);
            setSelectedCustomer(null);
        } catch (error) {
            console.error("Failed to save customer", error);
        }
    };

    const filteredCustomers = customers.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: "2rem", minHeight: "100vh", background: "#f5f5f5" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                    }}
                >
                    <h1>Admin Dashboard</h1>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            style={{ background: "#ef4444", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "6px", cursor: "pointer" }}
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Search */}
                <div style={{ marginBottom: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "0.5rem", width: "250px", marginRight: "0.5rem" }}
                    />
                    <button onClick={handleSearch} style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>
                        Search
                    </button>
                    <button onClick={loadCustomers} style={{ padding: "0.5rem 1rem" }}>
                        All
                    </button>
                    <button onClick={handleCreate} style={{ padding: "0.5rem 1rem", marginLeft: "1rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px" }}>
                        Create Customer
                    </button>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                    <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
                        <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
                        <th style={{ border: "1px solid #ddd", padding: "10px" }}>Username</th>
                        <th style={{ border: "1px solid #ddd", padding: "10px" }}>Email</th>
                        <th style={{ border: "1px solid #ddd", padding: "10px" }}>Phone</th>
                        <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCustomers.map((c) => (
                        <tr key={c.userId}>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>{c.userId}</td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>{c.firstName} {c.lastName}</td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>{c.userName}</td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>{c.contact.email}</td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>{c.contact.phoneNumber}</td>
                            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                <button onClick={() => handleEdit(c)} style={{ marginRight: "0.5rem", background: "#10b981", color: "#fff", padding: "0.3rem 0.6rem", border: "none", borderRadius: "4px" }}>Edit</button>
                                <button onClick={() => handleDelete(c.userId)} style={{ background: "#ef4444", color: "#fff", padding: "0.3rem 0.6rem", border: "none", borderRadius: "4px" }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Form Modal */}
                {showForm && (
                    <div style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
                        alignItems: "center", justifyContent: "center", zIndex: 1000
                    }}>
                        <form onSubmit={handleFormSubmit} style={{ background: "#fff", padding: "2rem", borderRadius: "12px", width: "400px" }}>
                            <h3>{selectedCustomer ? "Edit Customer" : "Create Customer"}</h3>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                required
                                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.contact.email}
                                onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                                required
                                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.contact.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phoneNumber: e.target.value } })}
                                required
                                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                            />
                            <input
                                type="number"
                                placeholder="Customer Discount"
                                value={formData.customerDiscount}
                                onChange={(e) => setFormData({ ...formData, customerDiscount: Number(e.target.value) })}
                                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <button type="submit" style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px" }}>Save</button>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: "0.5rem 1rem", background: "#6b7280", color: "#fff", border: "none", borderRadius: "6px" }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
