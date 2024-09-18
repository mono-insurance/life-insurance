import React, { useEffect, useState } from 'react';
import { fetchAgent, updateAgent } from '../../../services/AgentService'; // Add updateAgent service
import { useParams } from 'react-router-dom';

const AgentProfile = () => {
    const [agent, setAgent] = useState({});
    const [editAgent, setEditAgent] = useState({}); // State for editable agent data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const { id: agentId } = useParams(); // Extract agentId from route params

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const response = await fetchAgent(agentId);
                setAgent(response.data);
                setEditAgent(response.data); // Initialize editAgent with fetched data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAgentData();
    }, [agentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditAgent({ ...editAgent, [name]: value });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEditAgent({
            ...editAgent,
            address: { ...editAgent.address, [name]: value }
        });
    };

    const handleCredentialsChange = (e) => {
        const { name, value } = e.target;
        setEditAgent({
            ...editAgent,
            credentials: { ...editAgent.credentials, [name]: value }
        });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing); // Toggle edit mode
    };

    const handleSubmit = async () => {
        try {
            await updateAgent(agentId, editAgent); // Call the update API
            setAgent(editAgent); // Update the main agent state with edited data
            setIsEditing(false); // Exit edit mode
        } catch (err) {
            setError('Failed to update the agent');
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
        agent && (
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Agent Profile</h1>
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handleEditToggle}
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 text-white py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
                        <p>
                            <strong>First Name:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={editAgent.firstName || ''}
                                    onChange={handleInputChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.firstName || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Last Name:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={editAgent.lastName || ''}
                                    onChange={handleInputChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.lastName || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Date of Birth:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={editAgent.dateOfBirth || ''}
                                    onChange={handleInputChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.dateOfBirth
                                    ? new Date(agent.dateOfBirth).toLocaleDateString()
                                    : 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Qualification:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="qualification"
                                    value={editAgent.qualification || ''}
                                    onChange={handleInputChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.qualification || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Status:</strong> {agent.isActive ? 'Active' : 'Inactive'}
                        </p>
                        <p>
                            <strong>Approval:</strong> {agent.isApproved ? 'Approved' : 'Not Approved'}
                        </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Financial Information</h2>
                        <p>
                            <strong>Balance:</strong> Rs.{' '}
                            {agent.balance !== null ? agent.balance.toFixed(2) : '0'}
                        </p>
                        <p>
                            <strong>Withdrawal Amount:</strong> Rs.{' '}
                            {agent.withdrawalAmount !== null
                                ? agent.withdrawalAmount.toFixed(2)
                                : '0'}
                        </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg col-span-full">
                        <h2 className="text-xl font-semibold mb-2">Address</h2>
                        <p>
                            <strong>Street:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="street"
                                    value={editAgent.address?.street || ''}
                                    onChange={handleAddressChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.address?.street || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>City:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="city"
                                    value={editAgent.address?.city || ''}
                                    onChange={handleAddressChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.address?.city || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>State:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="state"
                                    value={editAgent.address?.state || ''}
                                    onChange={handleAddressChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.address?.state || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Zip Code:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={editAgent.address?.zipCode || ''}
                                    onChange={handleAddressChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.address?.zipCode || 'N/A'
                            )}
                        </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg col-span-full">
                        <h2 className="text-xl font-semibold mb-2">Credentials</h2>
                        <p>
                            <strong>Username:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={editAgent.credentials?.username || ''}
                                    onChange={handleCredentialsChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.credentials?.username || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Email:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={editAgent.credentials?.email || ''}
                                    onChange={handleCredentialsChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.credentials?.email || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Mobile Number:</strong>{' '}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    value={editAgent.credentials?.mobileNumber || ''}
                                    onChange={handleCredentialsChange}
                                    className="border rounded p-2 w-full"
                                />
                            ) : (
                                agent.credentials?.mobileNumber || 'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Role:</strong> {agent.credentials?.role || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        )
    );
};

export default AgentProfile;
