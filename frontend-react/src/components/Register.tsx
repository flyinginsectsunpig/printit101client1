// src/components/Register.tsx
import React, { useState } from 'react';
import api from '../service/api';
import Header from './Header';

interface RegisterProps {
    onRegisterSuccess: (user: any) => void;
    onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '+27 ',
        propertyNumber: '',
        buildingName: '',
        unitNumber: '',
        poBoxNumber: '',
        street: '',
        municipality: '',
        province: '',
        postalCode: '',
        country: 'South Africa'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format phone number (South African format: +27 XX XXX XXXX)
        if (name === 'phone') {
            // Always ensure +27 prefix
            if (!value.startsWith('+27 ')) {
                return; // Don't allow changes that remove the prefix
            }

            // Remove all non-digits from the part after +27
            const afterPrefix = value.substring(4);
            let cleaned = afterPrefix.replace(/\D/g, '');

            // If user pasted number starting with 0, remove it
            if (cleaned.startsWith('0')) {
                cleaned = cleaned.slice(1);
            }

            // South African numbers should be 9 digits after +27 (XX XXX XXXX)
            if (cleaned.length <= 9) {
                if (cleaned.length > 5) {
                    // Format: +27 XX XXX XXXX
                    formattedValue = `+27 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}`.trim();
                } else if (cleaned.length > 2) {
                    // Format: +27 XX XXX
                    formattedValue = `+27 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}`.trim();
                } else if (cleaned.length > 0) {
                    // Format: +27 XX
                    formattedValue = `+27 ${cleaned}`;
                } else {
                    formattedValue = '+27 ';
                }
            } else {
                return; // Don't allow more than 9 digits
            }
        }

        // Format postal code (4 digits only)
        if (name === 'postalCode') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 4) {
                formattedValue = cleaned;
            } else {
                return; // Don't allow more than 4 digits
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const validateForm = (): boolean => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        // Required fields validation
        const requiredFields = ['firstName', 'lastName', 'userName', 'email', 'phone', 'street', 'municipality', 'province', 'postalCode'];
        for (const field of requiredFields) {
            if (!formData[field as keyof typeof formData].toString().trim()) {
                setError(`Please fill in all required fields`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Transform formData to match backend's expected structure
            const registrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                userName: formData.userName,
                password: formData.password,
                contact: {
                    email: formData.email,
                    phone: formData.phone
                },
                address: {
                    propertyNumber: formData.propertyNumber,
                    buildingName: formData.buildingName,
                    unitNumber: formData.unitNumber,
                    poBoxNumber: formData.poBoxNumber,
                    street: formData.street,
                    municipality: formData.municipality,
                    province: formData.province,
                    postalCode: formData.postalCode,
                    country: formData.country
                }
            };

            const response = await api.post('/auth/register', registrationData);

            // Auto-login after successful registration
            const loginResponse = await api.post('/auth/login', {
                userName: formData.userName,
                password: formData.password
            });

            // Token is included in the response from backend
            onRegisterSuccess(loginResponse.data);
        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper" style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Header page="register" onButtonClick={onSwitchToLogin} />
            <div className="auth-container" style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '2.5rem 1rem',
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'auto'
            }}>
                <div className="auth-form" style={{
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: 'calc(100vh - 72px)',
                    overflowY: 'auto'
                }}>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Personal Information */}
                        <div className="form-section">
                            <h3>Personal Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name *:</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name *:</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="form-section">
                            <h3>Account Information</h3>
                            <div className="form-group">
                                <label htmlFor="userName">Username *:</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password *:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password *:</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="form-section">
                            <h3>Contact Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email *:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone *:</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+27 XX XXX XXXX"
                                        pattern="\+27\s[0-9]{2}\s[0-9]{3}\s[0-9]{4}"
                                        title="Phone number format: +27 XX XXX XXXX"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="form-section">
                            <h3>Address Information</h3>
                            <div className="form-group">
                                <label htmlFor="street">Street *:</label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="municipality">City *:</label>
                                    <input
                                        type="text"
                                        id="municipality"
                                        name="municipality"
                                        value={formData.municipality}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="province">Province *:</label>
                                    <input
                                        type="text"
                                        id="province"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code *:</label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        placeholder="8000"
                                        pattern="[0-9]{4}"
                                        title="Postal code must be exactly 4 digits"
                                        maxLength={4}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country *:</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <p>
                        Already have an account?{' '}
                        <button type="button" className="link-button" onClick={onSwitchToLogin}>
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;