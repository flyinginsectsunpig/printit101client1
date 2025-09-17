import React, { useState, useEffect } from "react";
import * as customerService from "../service/customerService";
import { Customer } from "../domain/Customer";

interface AdminDashboardProps {
    onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState<Customer>({
        userId: 0,
        firstName: "",
        lastName: "",
        userName: "",
        password: "defaultpassword123",
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
            country: "South Africa",
        },
        contact: {
            contactId: 0,
            phoneNumber: "+27",
            email: "",
        },
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const data = await customerService.getAllCustomers();
            setCustomers(data);
            setMessage(`Successfully loaded ${data.length} customers`);
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Failed to load customers", error);
            setMessage("Failed to load customers. Please try again.");
        }
        setLoading(false);
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            loadCustomers();
            return;
        }
        const filtered = customers.filter((c) =>
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMessage(`Found ${filtered.length} customers matching "${searchTerm}"`);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;

        setLoading(true);
        try {
            await customerService.deleteCustomer(userId);
            setCustomers(customers.filter((c) => c.userId !== userId));
            setMessage("Customer deleted successfully");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Failed to delete customer", error);
            setMessage("Failed to delete customer. Please try again.");
        }
        setLoading(false);
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
            password: "defaultpassword123",
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
                country: "South Africa",
            },
            contact: {
                contactId: 0,
                phoneNumber: "+27",
                email: "",
            },
        });
        setShowForm(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (selectedCustomer) {
                const updatedCustomer = await customerService.updateCustomer(formData);
                setCustomers(
                    customers.map((c) =>
                        c.userId === updatedCustomer.userId ? updatedCustomer : c
                    )
                );
                setMessage(`Customer ${updatedCustomer.firstName} ${updatedCustomer.lastName} updated successfully`);
            } else {
                const newCustomer = await customerService.createCustomer(formData);
                setCustomers([...customers, newCustomer]);
                setMessage(`Customer ${newCustomer.firstName} ${newCustomer.lastName} created successfully`);
            }
            setShowForm(false);
            setSelectedCustomer(null);
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Failed to save customer", error);
            setMessage(`Failed to ${selectedCustomer ? 'update' : 'create'} customer. Please try again.`);
        }
        setLoading(false);
    };

    const filteredCustomers = customers.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @media (max-width: 768px) {
                        .responsive-grid {
                            grid-template-columns: 1fr !important;
                        }
                        
                        .responsive-flex {
                            flex-direction: column !important;
                            gap: 1rem !important;
                        }
                    }
                `}
            </style>

            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
            }}>
                {/* Header */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                    padding: "1rem 2rem",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
                }}>
                    <div style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "18px"
                            }}>
                                A
                            </div>
                            <div>
                                <h1 style={{
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text"
                                }}>
                                    Admin Dashboard
                                </h1>
                                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                                    Customer Management System
                                </p>
                            </div>
                        </div>
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                style={{
                                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                    color: "#fff",
                                    padding: "0.75rem 1.5rem",
                                    border: "none",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.3)";
                                }}
                            >
                                Sign Out
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
                    {/* Stats Cards */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "1.5rem",
                        marginBottom: "2rem"
                    }}>
                        <div style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "20px"
                                }}>
                                    👥
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
                                        Total Customers
                                    </p>
                                    <p style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1e293b" }}>
                                        {customers.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "20px"
                                }}>
                                    🔍
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
                                        Search Results
                                    </p>
                                    <p style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1e293b" }}>
                                        {filteredCustomers.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {loading && (
                        <div style={{
                            background: "rgba(59, 130, 246, 0.1)",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            borderRadius: "12px",
                            padding: "1rem",
                            marginBottom: "1.5rem",
                            color: "#1d4ed8",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <div style={{
                                width: "16px",
                                height: "16px",
                                border: "2px solid #1d4ed8",
                                borderTopColor: "transparent",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }}></div>
                            Processing...
                        </div>
                    )}

                    {message && (
                        <div style={{
                            background: message.includes("Failed") ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                            border: message.includes("Failed") ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)",
                            borderRadius: "12px",
                            padding: "1rem",
                            marginBottom: "1.5rem",
                            color: message.includes("Failed") ? "#dc2626" : "#059669",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span>{message.includes("Failed") ? "⚠️" : "✅"}</span>
                            {message}
                        </div>
                    )}

                    {/* Controls Panel */}
                    <div style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        marginBottom: "2rem",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "1rem",
                            justifyContent: "space-between"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "300px" }}>
                                <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
                                    <input
                                        type="text"
                                        placeholder="Search customers by name, username, or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem 1rem 0.75rem 2.5rem",
                                            border: "2px solid #e2e8f0",
                                            borderRadius: "12px",
                                            fontSize: "14px",
                                            fontFamily: "inherit",
                                            outline: "none",
                                            transition: "all 0.2s ease"
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = "#3b82f6";
                                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = "#e2e8f0";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    />
                                    <div style={{
                                        position: "absolute",
                                        left: "0.75rem",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#94a3b8",
                                        fontSize: "16px"
                                    }}>
                                        🔍
                                    </div>
                                </div>

                                <button
                                    onClick={handleSearch}
                                    style={{
                                        padding: "0.75rem 1.5rem",
                                        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        transition: "all 0.2s ease",
                                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
                                    }}
                                >
                                    Search
                                </button>

                                <button
                                    onClick={loadCustomers}
                                    style={{
                                        padding: "0.75rem 1.5rem",
                                        background: "rgba(100, 116, 139, 0.1)",
                                        color: "#64748b",
                                        border: "2px solid #e2e8f0",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(100, 116, 139, 0.2)";
                                        e.currentTarget.style.borderColor = "#cbd5e1";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(100, 116, 139, 0.1)";
                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                    }}
                                >
                                    Refresh
                                </button>
                            </div>

                            <button
                                onClick={handleCreate}
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.3)";
                                }}
                            >
                                <span>+</span>
                                Add Customer
                            </button>
                        </div>
                    </div>

                    {/* Customer Table */}
                    <div style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}>
                        <div style={{
                            padding: "1.5rem",
                            borderBottom: "1px solid #e2e8f0",
                            background: "rgba(248, 250, 252, 0.8)"
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1e293b"
                            }}>
                                Customer Directory
                            </h2>
                            <p style={{
                                margin: "0.25rem 0 0 0",
                                color: "#64748b",
                                fontSize: "14px"
                            }}>
                                Manage your customer database with advanced controls
                            </p>
                        </div>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                <tr style={{ background: "rgba(248, 250, 252, 0.8)" }}>
                                    <th style={{
                                        padding: "1rem",
                                        textAlign: "left",
                                        fontWeight: "600",
                                        color: "#374151",
                                        fontSize: "14px",
                                        borderBottom: "1px solid #e2e8f0"
                                    }}>
                                        ID
                                    </th>
                                    <th style={{
                                        padding: "1rem",
                                        textAlign: "left",
                                        fontWeight: "600",
                                        color: "#374151",
                                        fontSize: "14px",
                                        borderBottom: "1px solid #e2e8f0"
                                    }}>
                                        Customer
                                    </th>
                                    <th style={{
                                        padding: "1rem",
                                        textAlign: "left",
                                        fontWeight: "600",
                                        color: "#374151",
                                        fontSize: "14px",
                                        borderBottom: "1px solid #e2e8f0"
                                    }}>
                                        Contact Information
                                    </th>
                                    <th style={{
                                        padding: "1rem",
                                        textAlign: "left",
                                        fontWeight: "600",
                                        color: "#374151",
                                        fontSize: "14px",
                                        borderBottom: "1px solid #e2e8f0"
                                    }}>
                                        Discount
                                    </th>
                                    <th style={{
                                        padding: "1rem",
                                        textAlign: "center",
                                        fontWeight: "600",
                                        color: "#374151",
                                        fontSize: "14px",
                                        borderBottom: "1px solid #e2e8f0"
                                    }}>
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredCustomers.map((c, index) => (
                                    <tr key={c.userId} style={{
                                        borderBottom: "1px solid #f1f5f9",
                                        transition: "background-color 0.2s ease"
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "rgba(248, 250, 252, 0.5)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }}>
                                        <td style={{ padding: "1rem", color: "#64748b", fontSize: "14px" }}>
                                            #{c.userId}
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            <div>
                                                <div style={{
                                                    fontWeight: "600",
                                                    color: "#1e293b",
                                                    marginBottom: "0.25rem"
                                                }}>
                                                    {c.firstName} {c.lastName}
                                                </div>
                                                <div style={{
                                                    fontSize: "13px",
                                                    color: "#64748b",
                                                    background: "rgba(100, 116, 139, 0.1)",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "6px",
                                                    display: "inline-block"
                                                }}>
                                                    @{c.userName}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                                <div style={{
                                                    fontSize: "14px",
                                                    color: "#1e293b",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem"
                                                }}>
                                                    <span>📧</span>
                                                    {c.contact.email}
                                                </div>
                                                <div style={{
                                                    fontSize: "14px",
                                                    color: "#64748b",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem"
                                                }}>
                                                    <span>📱</span>
                                                    {c.contact.phoneNumber}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            <span style={{
                                                background: c.customerDiscount > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(100, 116, 139, 0.1)",
                                                color: c.customerDiscount > 0 ? "#059669" : "#64748b",
                                                padding: "0.5rem 0.75rem",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500"
                                            }}>
                                                {c.customerDiscount}%
                                            </span>
                                        </td>
                                        <td style={{ padding: "1rem", textAlign: "center" }}>
                                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                                                <button
                                                    onClick={() => handleEdit(c)}
                                                    disabled={loading}
                                                    style={{
                                                        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                                        color: "white",
                                                        padding: "0.5rem 0.75rem",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        transition: "all 0.2s ease",
                                                        opacity: loading ? 0.6 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) {
                                                            e.currentTarget.style.transform = "translateY(-1px)";
                                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.userId)}
                                                    disabled={loading}
                                                    style={{
                                                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                                        color: "white",
                                                        padding: "0.5rem 0.75rem",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        transition: "all 0.2s ease",
                                                        opacity: loading ? 0.6 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!loading) {
                                                            e.currentTarget.style.transform = "translateY(-1px)";
                                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                        e.currentTarget.style.boxShadow = "none";
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
                            {filteredCustomers.length === 0 && (
                                <div style={{
                                    padding: "3rem",
                                    textAlign: "center",
                                    color: "#64748b"
                                }}>
                                    <div style={{ fontSize: "48px", marginBottom: "1rem" }}>📋</div>
                                    <h3 style={{
                                        margin: "0 0 0.5rem 0",
                                        color: "#374151",
                                        fontWeight: "600"
                                    }}>
                                        No customers found
                                    </h3>
                                    <p style={{ margin: 0, fontSize: "14px" }}>
                                        {searchTerm ? `No results for "${searchTerm}"` : "Start by adding your first customer"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Modal */}
                    {showForm && (
                        <div style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(4px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000,
                            padding: "1rem"
                        }}>
                            <div style={{
                                background: "rgba(255, 255, 255, 0.98)",
                                backdropFilter: "blur(20px)",
                                borderRadius: "20px",
                                width: "100%",
                                maxWidth: "600px",
                                maxHeight: "90vh",
                                overflowY: "auto",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                border: "1px solid rgba(255, 255, 255, 0.3)"
                            }}>
                                {/* Modal Header */}
                                <div style={{
                                    padding: "2rem 2rem 1rem 2rem",
                                    borderBottom: "1px solid rgba(226, 232, 240, 0.8)"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{
                                            width: "48px",
                                            height: "48px",
                                            background: selectedCustomer ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                            borderRadius: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: "20px"
                                        }}>
                                            {selectedCustomer ? "✏️" : "👤"}
                                        </div>
                                        <div>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: "20px",
                                                fontWeight: "700",
                                                color: "#1e293b"
                                            }}>
                                                {selectedCustomer ? "Edit Customer" : "Create New Customer"}
                                            </h3>
                                            <p style={{
                                                margin: "0.25rem 0 0 0",
                                                color: "#64748b",
                                                fontSize: "14px"
                                            }}>
                                                {selectedCustomer ? "Update customer information" : "Add a new customer to your database"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <form onSubmit={handleFormSubmit} style={{ padding: "2rem" }}>
                                    {/* Basic Information */}
                                    <div style={{ marginBottom: "2rem" }}>
                                        <h4 style={{
                                            margin: "0 0 1rem 0",
                                            color: "#374151",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem"
                                        }}>
                                            👤 Basic Information
                                        </h4>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="John"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    required
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    required
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: "1rem" }}>
                                            <label style={{
                                                display: "block",
                                                marginBottom: "0.5rem",
                                                color: "#374151",
                                                fontSize: "14px",
                                                fontWeight: "500"
                                            }}>
                                                Username *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="johndoe123"
                                                value={formData.userName}
                                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                                required
                                                style={{
                                                    width: "100%",
                                                    padding: "0.75rem",
                                                    border: "2px solid #e2e8f0",
                                                    borderRadius: "10px",
                                                    fontSize: "14px",
                                                    fontFamily: "inherit",
                                                    outline: "none",
                                                    transition: "all 0.2s ease"
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = "#3b82f6";
                                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            />
                                        </div>

                                        {!selectedCustomer && (
                                            <div style={{ marginBottom: "1rem" }}>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Password *
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter secure password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    required
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div style={{ marginBottom: "1rem" }}>
                                            <label style={{
                                                display: "block",
                                                marginBottom: "0.5rem",
                                                color: "#374151",
                                                fontSize: "14px",
                                                fontWeight: "500"
                                            }}>
                                                Customer Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={formData.customerDiscount}
                                                onChange={(e) => setFormData({ ...formData, customerDiscount: Number(e.target.value) })}
                                                min="0"
                                                max="100"
                                                style={{
                                                    width: "100%",
                                                    padding: "0.75rem",
                                                    border: "2px solid #e2e8f0",
                                                    borderRadius: "10px",
                                                    fontSize: "14px",
                                                    fontFamily: "inherit",
                                                    outline: "none",
                                                    transition: "all 0.2s ease"
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = "#3b82f6";
                                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div style={{ marginBottom: "2rem" }}>
                                        <h4 style={{
                                            margin: "0 0 1rem 0",
                                            color: "#374151",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem"
                                        }}>
                                            📞 Contact Information
                                        </h4>

                                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    value={formData.contact.email}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        contact: { ...formData.contact, email: e.target.value }
                                                    })}
                                                    required
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    placeholder="+27821234567"
                                                    value={formData.contact.phoneNumber}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        contact: { ...formData.contact, phoneNumber: e.target.value }
                                                    })}
                                                    required
                                                    pattern="\+27[6-8][0-9]{8}"
                                                    title="Phone number must start with +27 followed by 6, 7, or 8 and then 8 digits (e.g., +27821234567)"
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div style={{ marginBottom: "2rem" }}>
                                        <h4 style={{
                                            margin: "0 0 1rem 0",
                                            color: "#374151",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem"
                                        }}>
                                            🏠 Address Information
                                        </h4>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "1rem", marginBottom: "1rem" }}>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Property #
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="123"
                                                    value={formData.address.propertyNumber || ""}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, propertyNumber: Number(e.target.value) || 0 }
                                                    })}
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Street Address
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Main Street"
                                                    value={formData.address.street}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, street: e.target.value }
                                                    })}
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Municipality
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Cape Town"
                                                    value={formData.address.municipality}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, municipality: e.target.value }
                                                    })}
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Province
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Western Cape"
                                                    value={formData.address.province}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, province: e.target.value }
                                                    })}
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="8000"
                                                    value={formData.address.postalCode}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, postalCode: e.target.value }
                                                    })}
                                                    pattern="[0-9]{4}"
                                                    title="Postal code must be exactly 4 digits"
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor = "#e2e8f0";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{
                                                    display: "block",
                                                    marginBottom: "0.5rem",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}>
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    value="South Africa"
                                                    readOnly
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontFamily: "inherit",
                                                        outline: "none",
                                                        background: "#f1f5f9",
                                                        color: "#64748b"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div style={{
                                        display: "flex",
                                        gap: "1rem",
                                        paddingTop: "1rem",
                                        borderTop: "1px solid rgba(226, 232, 240, 0.8)"
                                    }}>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            disabled={loading}
                                            style={{
                                                flex: 1,
                                                padding: "0.875rem 1.5rem",
                                                background: "rgba(100, 116, 139, 0.1)",
                                                color: "#64748b",
                                                border: "2px solid #e2e8f0",
                                                borderRadius: "12px",
                                                cursor: loading ? "not-allowed" : "pointer",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                transition: "all 0.2s ease",
                                                opacity: loading ? 0.6 : 1
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading) {
                                                    e.currentTarget.style.background = "rgba(100, 116, 139, 0.2)";
                                                    e.currentTarget.style.borderColor = "#cbd5e1";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(100, 116, 139, 0.1)";
                                                e.currentTarget.style.borderColor = "#e2e8f0";
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                flex: 2,
                                                padding: "0.875rem 1.5rem",
                                                background: loading ? "rgba(100, 116, 139, 0.3)" : (selectedCustomer ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)"),
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "12px",
                                                cursor: loading ? "not-allowed" : "pointer",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                transition: "all 0.2s ease",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "0.5rem",
                                                boxShadow: loading ? "none" : `0 4px 15px ${selectedCustomer ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)"}`
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading) {
                                                    e.currentTarget.style.transform = "translateY(-2px)";
                                                    e.currentTarget.style.boxShadow = `0 6px 20px ${selectedCustomer ? "rgba(59, 130, 246, 0.4)" : "rgba(16, 185, 129, 0.4)"}`;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = loading ? "none" : `0 4px 15px ${selectedCustomer ? "rgba(59, 130, 246, 0.3)" : "rgba(16, 185, 129, 0.3)"}`;
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <div style={{
                                                        width: "16px",
                                                        height: "16px",
                                                        border: "2px solid #fff",
                                                        borderTopColor: "transparent",
                                                        borderRadius: "50%",
                                                        animation: "spin 1s linear infinite"
                                                    }}></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <span>{selectedCustomer ? "💾" : "✅"}</span>
                                                    {selectedCustomer ? "Update Customer" : "Create Customer"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;