import { useState, useEffect } from 'react';

// Define the plan type
interface Plan {
  _id?: string;
  title: string;
  price: number;
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
    description: "",
    features: [],
    unavailableFeatures: [],
    actionLabel: ""
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For handling feature lists
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

    // Handle price as a number
    if (name === "price") {
      setNewPlan(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setNewPlan(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addFeature = (): void => {
    if (newFeature.trim() !== "") {
      setNewPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number): void => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addUnavailableFeature = (): void => {
    if (newUnavailableFeature.trim() !== "") {
      setNewPlan(prev => ({
        ...prev,
        unavailableFeatures: [...prev.unavailableFeatures, newUnavailableFeature.trim()]
      }));
      setNewUnavailableFeature("");
    }
  };

  const removeUnavailableFeature = (index: number): void => {
    setNewPlan(prev => ({
      ...prev,
      unavailableFeatures: prev.unavailableFeatures.filter((_, i) => i !== index)
    }));
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
        // Update existing plan
        const updatedPlans = plans.map((plan, index) =>
          index === editIndex ? updatedPlan : plan
        );
        setPlans(updatedPlans);
      } else {
        // Add new plan
        setPlans(prev => [...prev, updatedPlan]);
      }

      // Reset form
      setEditIndex(null);
      setNewPlan({
        title: "",
        price: 0,
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Price (in cents)</label>
            <input
              type="number"
              name="price"
              value={newPlan.price}
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
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-grow p-2 border rounded bg-gray-700 text-white border-gray-600"
                placeholder="Add a feature"
              />
              <button
                onClick={addFeature}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {newPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span>{feature}</span>
                  <button
                    onClick={() => removeFeature(index)}
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
            <div className="flex space-x-2">
              <input
                type="text"
                value={newUnavailableFeature}
                onChange={(e) => setNewUnavailableFeature(e.target.value)}
                className="flex-grow p-2 border rounded bg-gray-700 text-white border-gray-600"
                placeholder="Add an unavailable feature"
              />
              <button
                onClick={addUnavailableFeature}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {newPlan.unavailableFeatures.map((feature, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span>{feature}</span>
                  <button
                    onClick={() => removeUnavailableFeature(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Action Label</label>
            <input
              type="text"
              name="actionLabel"
              value={newPlan.actionLabel}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
            />
          </div>
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
                  {plan.title} - ${(plan.price / 100).toFixed(2)}
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
