import React, { useState } from "react";

type Address = {
    addressId: number;
    propertyNumber: number;
    buildingName: string;
    unitNumber: number;
    poBoxNumber: number;
    street: string;
    municipality: string;
    province: string;
    postalCode: string;
    country: string;
};

type Contact = {
    contactId: number;
    phoneNumber: string;
    email: string;
};

type Customer = {
    userId: number;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    role: string;
    customerDiscount: number;
    address: Address;
    contact: Contact;
};

export default function CustomerApi() {
    const [customer, setCustomer] = useState<Customer>({
        userId: 0,
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        role: "CUSTOMER", // Default role
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in customer.address) {
            setCustomer({
                ...customer,
                address: { ...customer.address, [name]: value },
            });
        } else if (name in customer.contact) {
            setCustomer({
                ...customer,
                contact: { ...customer.contact, [name]: value },
            });
        } else {
            setCustomer({ ...customer, [name]: value });
        }
    };

    const createCustomer = async () => {
        try {
            const response = await fetch("http://localhost:8080/customer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer),
            });
            const data = await response.json();
            console.log("Customer created:", data);
        } catch (err) {
            console.error("Error creating customer:", err);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch("http://localhost:8080/customer");
            const data = await response.json();
            console.log("Customers from DB:", data);
        } catch (err) {
            console.error("Error fetching customers:", err);
        }
    };

    return (
        <div className="p-6 space-y-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Customer Form</h1>

            {/* User Info */}
            <div>
                <label className="block font-medium">First Name</label>
                <input
                    name="firstName"
                    value={customer.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Last Name</label>
                <input
                    name="lastName"
                    value={customer.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Username</label>
                <input
                    name="userName"
                    value={customer.userName}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Password</label>
                <input
                    type="password"
                    name="password"
                    value={customer.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Customer Discount</label>
                <input
                    name="customerDiscount"
                    value={customer.customerDiscount}
                    onChange={handleChange}
                    placeholder="Enter discount"
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Address */}
            <h2 className="text-xl font-semibold mt-6">Address</h2>

            <div>
                <label className="block font-medium">Property Number</label>
                <input
                    name="propertyNumber"
                    value={customer.address.propertyNumber}
                    onChange={handleChange}
                    placeholder="Property number"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Building Name</label>
                <input
                    name="buildingName"
                    value={customer.address.buildingName}
                    onChange={handleChange}
                    placeholder="Building name"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Street</label>
                <input
                    name="street"
                    value={customer.address.street}
                    onChange={handleChange}
                    placeholder="Street"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Municipality</label>
                <input
                    name="municipality"
                    value={customer.address.municipality}
                    onChange={handleChange}
                    placeholder="Municipality"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Province</label>
                <input
                    name="province"
                    value={customer.address.province}
                    onChange={handleChange}
                    placeholder="Province"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Postal Code</label>
                <input
                    name="postalCode"
                    value={customer.address.postalCode}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Country</label>
                <input
                    name="country"
                    value={customer.address.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Contact */}
            <h2 className="text-xl font-semibold mt-6">Contact</h2>

            <div>
                <label className="block font-medium">Phone Number</label>
                <input
                    name="phoneNumber"
                    value={customer.contact.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Email</label>
                <input
                    name="email"
                    value={customer.contact.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={createCustomer}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Create Customer
                </button>
                <button
                    onClick={fetchCustomers}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Fetch Customers
                </button>
            </div>
        </div>
    );
}
