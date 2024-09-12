import React, { useEffect, useState } from 'react';
import { fetchAgent } from '../../../services/AgentService';
import { useParams } from 'react-router-dom';

const AgentProfile = () => {
    const [agent, setAgent] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id: agentId } = useParams(); // Extract agentId from route params

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const response = await fetchAgent(agentId);
                setAgent(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAgentData();
    }, [agentId]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        agent && (
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Agent Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
                        <p><strong>First Name:</strong> {agent.firstName || 'N/A'}</p>
                        <p><strong>Last Name:</strong> {agent.lastName || 'N/A'}</p>
                        <p><strong>Date of Birth:</strong> {agent.dateOfBirth ? new Date(agent.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Qualification:</strong> {agent.qualification || 'N/A'}</p>
                        <p><strong>Status:</strong> {agent.isActive ? 'Active' : 'Inactive'}</p>
                        <p><strong>Approval:</strong> {agent.isApproved ? 'Approved' : 'Not Approved'}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Financial Information</h2>
                        <p><strong>Balance:</strong> Rs. {agent.balance !== null ? agent.balance.toFixed(2) : '0'}</p>
                        <p><strong>Withdrawal Amount:</strong> Rs. {agent.withdrawalAmount !== null ? agent.withdrawalAmount.toFixed(2) : '0'}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg col-span-full">
                        <h2 className="text-xl font-semibold mb-2">Address</h2>
                        <p><strong>Street:</strong> {agent.address?.street || 'N/A'}</p>
                        <p><strong>City:</strong> {agent.address?.city || 'N/A'}</p>
                        <p><strong>State:</strong> {agent.address?.state || 'N/A'}</p>
                        <p><strong>Zip Code:</strong> {agent.address?.zipCode || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg col-span-full">
                        <h2 className="text-xl font-semibold mb-2">Credentials</h2>
                        <p><strong>Username:</strong> {agent.credentials?.username || 'N/A'}</p>
                        <p><strong>Email:</strong> {agent.credentials?.email || 'N/A'}</p>
                        <p><strong>Mobile Number:</strong> {agent.credentials?.mobileNumber || 'N/A'}</p>
                        <p><strong>Role:</strong> {agent.credentials?.role || 'N/A'}</p>
                    </div>
                </div>
            </div>
        )
    );
};

export default AgentProfile;
