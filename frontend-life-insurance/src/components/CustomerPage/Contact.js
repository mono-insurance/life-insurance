import React, { useState } from "react";
import axios from 'axios'; // Import axios for HTTP requests
import "../../styles/contact.css";
import { SendEmail } from "../../services/PublicService";
const Contact = () => {
    const [formDetails, setFormDetails] = useState({
        title: "",
        emailId: "aman.2024csit1089@kiet.edu",
        body: "",
    });

    const inputChange = (e) => {
        const { name, value } = e.target;
        setFormDetails({
            ...formDetails,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await SendEmail(formDetails);

            if (response.status === 200) {
                // Success! Clear form, display success message
                setFormDetails({ name: "", message: "" });
                alert('Your message has been sent successfully!');
            } else {
                // Handle potential errors
                console.error('Error sending email:', response);
                alert('There was an error sending your message. Please try again later.');
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error sending email:', error);
            alert('There was an error sending your message. Please try again later.');
        }
    };

    return (
        <section className="register-section flex-center" id="contact">
            <div className="contact-container flex-center contact">
                <h2 className="form-heading">Contact Us</h2>
                <form onSubmit={handleSubmit} className="register-form ">
                    <input
                        type="text"
                        name="title"
                        className="form-input"
                        placeholder="Enter title"
                        value={formDetails.title}
                        onChange={inputChange}
                    />

                    <textarea
                        type="text"
                        name="body"
                        className="form-input"
                        placeholder="Enter your message"
                        value={formDetails.body}
                        onChange={inputChange}
                        rows="8"
                        cols="12"
                    />
                    <button type="submit" className="btn form-btn">
                        Send
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;