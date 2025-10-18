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
        phone: '',
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
        setFormData(prev => ({
            ...prev,
            [name]: value
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
            console.log('Registration successful:', response.data);

            // Auto-login after successful registration
            const loginResponse = await api.post('/auth/login', {
                userName: formData.userName,
                password: formData.password
            });

            console.log('Auto-login response:', loginResponse.data);
            // Ensure token is included in the user object if returned by backend
            onRegisterSuccess(loginResponse.data);
        } catch (error: any) {
            console.error('Registration error:', error);
            if (error.response?.status === 409) {
                setError('Username or email already exists. Please try logging in or use a different username.');
            } else if (error.response?.status === 401) {
                setError('Invalid credentials. Please check your username and password.');
            } else {
                setError(error.response?.data?.message || 'Registration failed. Please try again.');
            }
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
                                    <label htmlFor="municipality">Municipality *:</label>
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