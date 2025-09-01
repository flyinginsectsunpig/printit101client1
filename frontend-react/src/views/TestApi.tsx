import React from "react";
import { Customer } from "../domain/Customer";
import { Employee } from "../domain/Employee";
import { Address } from "../domain/Address";
import { Contact } from "../domain/Contact";

import * as customerService from "../service/customerService";
import * as employeeService from "../service/employeeService";
import * as addressService from "../service/addressService";
import * as contactService from "../service/contactService";

const TestApi: React.FC = () => {

    // ---------------------- GET HANDLERS ----------------------
    const handleGetCustomers = async () => {
        try {
            const customers: Customer[] = await customerService.getAllCustomers();
            console.log("Customers:", customers);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGetEmployees = async () => {
        try {
            const employees: Employee[] = await employeeService.getAllEmployees();
            console.log("Employees:", employees);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGetAddresses = async () => {
        try {
            const addresses: Address[] = await addressService.getAllAddresses();
            console.log("Addresses:", addresses);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGetContacts = async () => {
        try {
            const contacts: Contact[] = await contactService.getAllContacts();
            console.log("Contacts:", contacts);
        } catch (err) {
            console.error(err);
        }
    };

    // ---------------------- POST HANDLERS ----------------------
    const handleCreateAddress = async () => {
        try {
            const newAddress: Address = {
                addressId: 0,
                propertyNumber: 101,
                buildingName: "Sunset Towers",
                unitNumber: 1,
                poBoxNumber: 1234,
                street: "Main Street",
                municipality: "Cape Town",
                province: "Western Cape",
                postalCode: "8001",
                country: "South Africa"
            };
            const created = await addressService.createAddress(newAddress);
            console.log("Created Address:", created);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateContact = async () => {
        try {
            const newContact: Contact = {
                contactId: 0,
                phoneNumber: "0123456789",
                email: "test@example.com"
            };
            const created = await contactService.createContact(newContact);
            console.log("Created Contact:", created);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateCustomer = async () => {
        try {
            const newCustomer: Customer = {
                userId: 0,
                firstName: "John",
                lastName: "Doe",
                userName: "john.doe",
                password: "password123",
                role: "CUSTOMER",
                customerDiscount: 0, // required
                address: {
                    addressId: 0,
                    propertyNumber: 101,
                    buildingName: "Sunset Towers",
                    unitNumber: 1,
                    poBoxNumber: 1234,
                    street: "Main Street",
                    municipality: "Cape Town",
                    province: "Western Cape",
                    postalCode: "8001",
                    country: "South Africa"
                },
                contact: {
                    contactId: 0,
                    phoneNumber: "0123456789",
                    email: "john@example.com"
                }
            };

            const created = await customerService.createCustomer(newCustomer);
            console.log("Created Customer:", created);
        } catch (err) {
            console.error(err);
        }
    };


    const handleCreateEmployee = async () => {
        try {
            const newEmployee: Employee = {
                userId: 0,
                firstName: "Jane",
                lastName: "Smith",
                userName: "jane.smith",
                password: "password123",
                role: "EMPLOYEE",
                position: "Manager",
                staffDiscount: 0.15,
                address: {
                    addressId: 0,
                    propertyNumber: 200,
                    buildingName: "Ocean View",
                    unitNumber: 2,
                    poBoxNumber: 5678,
                    street: "Beach Road",
                    municipality: "Cape Town",
                    province: "Western Cape",
                    postalCode: "8002",
                    country: "South Africa"
                },
                contact: {
                    contactId: 0,
                    phoneNumber: "0987654321",
                    email: "jane@example.com"
                }
            };
            const created = await employeeService.createEmployee(newEmployee);
            console.log("Created Employee:", created);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Test API Calls</h1>

            {/* GET Buttons */}
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleGetCustomers}>Get All Customers</button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleGetEmployees}>Get All Employees</button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleGetAddresses}>Get All Addresses</button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleGetContacts}>Get All Contacts</button>
            </div>

            <hr />

            {/* POST Buttons */}
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleCreateCustomer}>Create Customer</button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleCreateEmployee}>Create Employee</button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleCreateAddress}>Create Address</button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleCreateContact}>Create Contact</button>
            </div>
        </div>
    );
};

export default TestApi;
