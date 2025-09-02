
import React, { useState } from 'react';
import api from '../service/api';

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
        contact: {
            email: '',
            phone: ''
        },
        address: {
            street: '',
            municipality: '',
            province: '',
            postalCode: '',
            country: ''
        }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent as keyof typeof formData] as any,
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', formData);
            onRegisterSuccess(response.data);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Register</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
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
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="userName">Username:</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact.email">Email:</label>
                        <input
                            type="email"
                            id="contact.email"
                            name="contact.email"
                            value={formData.contact.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact.phone">Phone:</label>
                        <input
                            type="tel"
                            id="contact.phone"
                            name="contact.phone"
                            value={formData.contact.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address.street">Street:</label>
                        <input
                            type="text"
                            id="address.street"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address.municipality">Municipality:</label>
                        <input
                            type="text"
                            id="address.municipality"
                            name="address.municipality"
                            value={formData.address.municipality}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address.province">Province:</label>
                        <input
                            type="text"
                            id="address.province"
                            name="address.province"
                            value={formData.address.province}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address.postalCode">Postal Code:</label>
                        <input
                            type="text"
                            id="address.postalCode"
                            name="address.postalCode"
                            value={formData.address.postalCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address.country">Country:</label>
                        <input
                            type="text"
                            id="address.country"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
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
    );
};

export default Register;
