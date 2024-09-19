import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AgentEmails.css'
import { getAllPolicies, sendEmail } from '../../../services/AgentService';
import { useParams } from 'react-router-dom';
const AgentEmails = () => {
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [policy, setPolicy] = useState('');
    const [policies, setPolicies] = useState([]);
    const routeParams = useParams();

    // Fetch policies from the backend API
    useEffect(async () => {
        const response = await getAllPolicies();
        setPolicies(response.content)

    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const agentId = routeParams.aid

        const emailData = {
            emailId: email,
            title,
            body,
            policyId: policy,
            agentId
        };
        await sendEmail(emailData)
        setEmail('')
        setTitle('')
        setBody('')
        setPolicy('')
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Email to Customer</h2>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Customer Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter customer email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Email title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Body</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Email body"
                            rows="5"
                            required
                        ></textarea>
                    </div>



                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Policy</label>
                        <select
                            value={policy}
                            onChange={(e) => setPolicy(e.target.value)} // Set policy ID when selected
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="" disabled>Select a policy</option>
                            {policies.map((policyItem) => (
                                <option key={policyItem.policyId} value={policyItem.policyId}>

                                    {policyItem.policyName} {/* Show policy title in dropdown */}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AgentEmails;
