import { useState } from 'react';

// Define the plan type
interface Plan {
  title: string;
  price: number;
  description: string;
  features: string[];
  unavailableFeatures: string[];
  actionLabel: string;
}

export default function PlansEditor(): JSX.Element {
  const initialPlans: Plan[] = [
    {
      title: "Basic",
      price: 999,
      description: "Essential features you need to get started",
      features: ["Gym Access", "Personal Trainer", "Free Diet Plan"],
      unavailableFeatures: ["Stop1"],
      actionLabel: "Get Basic",
    },
    {
      title: "Pro",
      price: 5999,
      description: "Perfect for dedicated fitness enthusiasts",
      features: ["24/7 Gym Access", "Advanced Trainer", "Customized Diet Plan"],
      unavailableFeatures: ["Stop1"],
      actionLabel: "Get Pro",
    }
  ];

  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newPlan, setNewPlan] = useState<Plan>({
    title: "",
    price: 0,
    description: "",
    features: [],
    unavailableFeatures: [],
    actionLabel: ""
  });
  
  // For handling feature lists
  const [newFeature, setNewFeature] = useState<string>("");
  const [newUnavailableFeature, setNewUnavailableFeature] = useState<string>("");

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

  const handleSave = (): void => {
    if (editIndex !== null) {
      // Update existing plan
      const updatedPlans = [...plans];
      updatedPlans[editIndex] = newPlan;
      setPlans(updatedPlans);
    } else {
      // Add new plan
      setPlans(prev => [...prev, newPlan]);
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
  };

  const handleDelete = (index: number): void => {
    const updatedPlans = plans.filter((_, i) => i !== index);
    setPlans(updatedPlans);
    
    if (editIndex === index) {
      setEditIndex(null);
      setNewPlan({
        title: "",
        price: 0,
        description: "",
        features: [],
        unavailableFeatures: [],
        actionLabel: ""
      });
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

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Current Plans</h2>
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <div key={index} className="border border-gray-700 p-4 rounded bg-gray-800 shadow">
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