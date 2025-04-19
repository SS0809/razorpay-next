import { useState, useEffect } from 'react';

// Define the plan type
interface Plan {
  _id?: string;
  title: string;
  price: number;
  duration: number; 
  discountrate: number;
  description: string;
  features: string[];
  unavailableFeatures: string[];
  actionLabel: string;
}

export default function PlansEditor(): JSX.Element {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newPlan, setNewPlan] = useState<Plan>({
    title: "",
    price: 0,
    duration: 1, 
    discountrate: 0,
    description: "",
    features: [],
    unavailableFeatures: [],
    actionLabel: ""
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newFeature, setNewFeature] = useState<string>("");
  const [newUnavailableFeature, setNewUnavailableFeature] = useState<string>("");

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        } else {
          setError('Failed to fetch plans');
        }
      } catch (error) {
        setError('Error fetching plans');
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const handleEdit = (index: number): void => {
    setEditIndex(index);
    setNewPlan({ ...plans[index] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (name === "price" || name === "discountrate" || name === "duration") {
      setNewPlan(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setNewPlan(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      const response = await fetch('/api/plans', {
        method: editIndex !== null ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editIndex !== null ? 'update' : 'add'} plan`);
      }

      const updatedPlan = await response.json();

      if (editIndex !== null) {
        const updatedPlans = plans.map((plan, index) =>
          index === editIndex ? updatedPlan : plan
        );
        setPlans(updatedPlans);
      } else {
        setPlans(prev => [...prev, updatedPlan]);
      }

      setEditIndex(null);
      setNewPlan({
        title: "",
        price: 0,
        duration: 1, // Reset to default number value
        discountrate: 0,
        description: "",
        features: [],
        unavailableFeatures: [],
        actionLabel: ""
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (index: number): Promise<void> => {
    const planId = plans[index]._id;
    try {
      const response = await fetch('/api/plans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: planId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      setPlans(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = (): void => {
    setEditIndex(null);
    setNewPlan({
      title: "",
      price: 0,
      duration: 1, // Reset to default number value
      discountrate: 0,
      description: "",
      features: [],
      unavailableFeatures: [],
      actionLabel: ""
    });
  };

  // Format plans as TypeScript code
  const getFormattedCode = (): string => {
    return `const plans: Plan[] = ${JSON.stringify(plans, null, 2)};`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Plans Editor</h1>

      <div className="p-6 bg-gray-800 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">
          {editIndex !== null ? 'Edit Plan' : 'Add New Plan'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={newPlan.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price (in rupees)</label>
            <input
              type="number"
              name="price"
              value={newPlan.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Duration (in months)</label>
            <input
              type="number"
              name="duration"
              value={newPlan.duration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Discount Rate (%)</label>
            <input
              type="number"
              name="discountrate"
              value={newPlan.discountrate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
            />
          </div>
            <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={newPlan.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Features</label>
            <div className="flex gap-2 mb-2">
              <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
              placeholder="Add a feature"
              />
              <button
              onClick={() => {
                if (newFeature.trim()) {
                setNewPlan((prev) => ({
                  ...prev,
                  features: [...prev.features, newFeature.trim()],
                }));
                setNewFeature("");
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
              Add
              </button>
            </div>
            <ul className="list-disc list-inside text-gray-400">
              {newPlan.features.map((feature, idx) => (
              <li key={idx} className="flex justify-between items-center">
                {feature}
                <button
                onClick={() =>
                  setNewPlan((prev) => ({
                  ...prev,
                  features: prev.features.filter((_, i) => i !== idx),
                  }))
                }
                className="text-red-400 hover:text-red-500"
                >
                Remove
                </button>
              </li>
              ))}
            </ul>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Unavailable Features</label>
            <div className="flex gap-2 mb-2">
              <input
              type="text"
              value={newUnavailableFeature}
              onChange={(e) => setNewUnavailableFeature(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
              placeholder="Add an unavailable feature"
              />
              <button
              onClick={() => {
                if (newUnavailableFeature.trim()) {
                setNewPlan((prev) => ({
                  ...prev,
                  unavailableFeatures: [...prev.unavailableFeatures, newUnavailableFeature.trim()],
                }));
                setNewUnavailableFeature("");
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
              Add
              </button>
            </div>
            <ul className="list-disc list-inside text-gray-400">
              {newPlan.unavailableFeatures.map((feature, idx) => (
              <li key={idx} className="flex justify-between items-center">
                {feature}
                <button
                onClick={() =>
                  setNewPlan((prev) => ({
                  ...prev,
                  unavailableFeatures: prev.unavailableFeatures.filter((_, i) => i !== idx),
                  }))
                }
                className="text-red-400 hover:text-red-500"
                >
                Remove
                </button>
              </li>
              ))}
            </ul>
            </div>
          {/* Features and Unavailable Features sections remain unchanged */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
            {editIndex !== null && (
              <button
                onClick={handleCancel}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Current Plans</h2>
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <div key={plan._id} className="border border-gray-700 p-4 rounded bg-gray-800 shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg text-gray-100">
                  {plan.title} - Rs. {plan.price}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-400">{plan.discountrate} : Discount Rate</p>
              <p className="text-gray-400">{plan.duration} : Duration</p>
              <p className="text-gray-400">{plan.description}</p>
              <div className="mt-2">
                <h4 className="text-gray-300">Features:</h4>
                <ul className="list-disc list-inside text-gray-400">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <h4 className="text-gray-300">Unavailable Features:</h4>
                <ul className="list-disc list-inside text-gray-400">
                  {plan.unavailableFeatures.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code output */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Generated Code</h2>
        <div className="bg-gray-800 text-white p-4 rounded overflow-auto">
          <pre>{getFormattedCode()}</pre>
        </div>
      </div>
    </div>
  );
}
