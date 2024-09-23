import React, { useEffect, useState } from 'react';
import { fetchAgent, updateAgent } from '../../../services/AgentService';
import { useParams } from 'react-router-dom';
import { getAllStates } from '../../../services/AuthServices';
import { errorToast } from '../../../utils/helper/toast';
import { Loader } from '../../../sharedComponents/Loader/Loader';

const AgentProfile = () => {
    const [agent, setAgent] = useState({});
    const [editAgent, setEditAgent] = useState({});
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { aid: agentId } = useParams(); // Extract agentId from route params
    const [loading, setLoading] = useState(true)

    const initialFormState = {
        stateId: '',
        cityId: ''
    };
    const [formState, setFormState] = useState(initialFormState);

    // Fetch agent data and states
    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const response = await fetchAgent(agentId);
                setAgent(response);
                setEditAgent(response); // Initialize editAgent with fetched data
                if (response?.address?.state) {
                    const selectedState = states.find(
                        (state) => state.stateName === response.address.state
                    );
                    if (selectedState) {
                        setCities(selectedState.cities || []);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchStates = async () => {
            try {
                const response = await getAllStates();
                setStates(response.data.content);
            } catch (error) {
                errorToast('Error fetching states.');
            }
        };

        fetchAgentData();
        fetchStates();
    }, []);

    // Handle state change and dynamically load cities
    const handleStateChange = (e) => {
        const { value } = e.target;
        const selectedState = states.find((state) => state.stateId.toString() === value);

        setFormState((prevState) => ({
            ...prevState,
            stateId: value,
        }));

        setCities(selectedState ? selectedState.cities : []);
        setEditAgent({
            ...editAgent,
            address: { ...editAgent.address, state: selectedState?.stateName || '' }
        });
    };

    // Handle city change
    const handleCityChange = (e) => {
        const { value } = e.target;
        const selectedCity = cities.find((city) => city.cityId.toString() === value);

        setFormState((prevState) => ({
            ...prevState,
            cityId: value,
        }));

        setEditAgent({
            ...editAgent,
            address: { ...editAgent.address, city: selectedCity?.cityName || '' }
        });
    };

    // Handle generic input change for personal info
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditAgent({ ...editAgent, [name]: value });
    };

    // Handle address field changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEditAgent({
            ...editAgent,
            address: { ...editAgent.address, [name]: value }
        });
    };

    // Handle credentials change
    const handleCredentialsChange = (e) => {
        const { name, value } = e.target;
        setEditAgent({
            ...editAgent,
            credentials: { ...editAgent.credentials, [name]: value }
        });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
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

    if (error) return <div className="text-center text-red-500">Error: {error}</div>;

    return (
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
                        {typeof agent.balance == 'number' ? agent.balance.toFixed(2) : 'not found'}
                    </p>
                    <p>
                        <strong>Withdrawal Amount:</strong> Rs.{' '}
                        {typeof agent.withdrawalAmount === 'number'
                            ? agent.withdrawalAmount.toFixed(2)
                            : 'not found'}
                    </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg col-span-full">
                    <h2 className="text-xl font-semibold mb-2">Address</h2>
                    <p>
                        <strong>first Street:</strong>{' '}
                        {isEditing ? (
                            <input
                                type="text"
                                name="firstStreet"
                                value={editAgent.address?.firstStreet || ''}
                                onChange={handleAddressChange}
                                className="border rounded p-2 w-full"
                            />
                        ) : (
                            agent.address?.firstStreet || 'N/A'
                        )}
                    </p>
                    <p>
                        <strong>last Street:</strong>{' '}
                        {isEditing ? (
                            <input
                                type="text"
                                name="lastStreet"
                                value={editAgent.address?.lastStreet || ''}
                                onChange={handleAddressChange}
                                className="border rounded p-2 w-full"
                            />
                        ) : (
                            agent.address?.lastStreet || 'N/A'
                        )}
                    </p>
                    <p>
                        <strong>State:</strong>{' '}
                        {isEditing ? (
                            <select
                                className="w-full p-2 border border-gray-300 rounded"
                                name="stateId"
                                value={formState.stateId}
                                onChange={handleStateChange}
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.stateId} value={state.stateId}>
                                        {state.stateName}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            agent.address?.state || 'N/A'
                        )}
                    </p>
                    <p>
                        <strong>City:</strong>{' '}
                        {isEditing ? (
                            <select
                                className="w-full p-2 border border-gray-300 rounded"
                                name="cityId"
                                value={formState.cityId}
                                onChange={handleCityChange}
                                disabled={!formState.stateId}
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.cityId} value={city.cityId}>
                                        {city.cityName}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            agent.address?.city || 'N/A'
                        )}
                    </p>
                    <p>
                        <strong>Zip Code:</strong>{' '}
                        {isEditing ? (
                            <input
                                type="text"
                                name="pincode"
                                value={editAgent.address?.pincode || ''}
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
                        <strong>Login Username:</strong>{' '}
                        {isEditing ? (
                            <input
                                type="text"
                                name="username"
                                disabled
                                value={editAgent.credentials?.username || ''}
                                onChange={handleCredentialsChange}
                                className="border rounded p-2 w-full"
                            />
                        ) : (
                            agent.credentials?.username || 'N/A'
                        )}
                    </p>
                    <p>
                        <strong>Password:</strong>{' '}
                        {isEditing ? (
                            <input
                                type="password"
                                name="password"
                                disabled
                                value={editAgent.credentials?.password || ''}
                                onChange={handleCredentialsChange}
                                className="border rounded p-2 w-full"
                            />
                        ) : (
                            '********'
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AgentProfile;
