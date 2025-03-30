import { useState } from 'react';

// Define the testimonial type
interface Testimonial {
  name: string;
  feedback: string;
  image: string;
}

export default function TestimonialsEditor(): JSX.Element {
  const initialTestimonials: Testimonial[] = [
    {
      name: "Death LIft",
      feedback: "BLean has completely transformed my fitness journey. Highly recommend!",
      image: "image.png",
    },
    {
      name: "Show OFF",
      feedback: "The trainers and facilities are top-notch. I love the Pro plan!",
      image: "image2.png",
    },
    {
      name: "BI ceps",
      feedback: "Affordable plans and excellent support. BLean is the best!",
      image: "image3.png", 
    },
  ];

  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    name: "",
    feedback: "",
    image: ""
  });

  const handleEdit = (index: number): void => {
    setEditIndex(index);
    setNewTestimonial({ ...testimonials[index] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (): void => {
    if (editIndex !== null) {
      // Update existing testimonial
      const updatedTestimonials = [...testimonials];
      updatedTestimonials[editIndex] = newTestimonial;
      setTestimonials(updatedTestimonials);
    } else {
      // Add new testimonial
      setTestimonials(prev => [...prev, newTestimonial]);
    }
    
    // Reset form
    setEditIndex(null);
    setNewTestimonial({ name: "", feedback: "", image: "" });
  };

  const handleDelete = (index: number): void => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(updatedTestimonials);
    
    if (editIndex === index) {
      setEditIndex(null);
      setNewTestimonial({ name: "", feedback: "", image: "" });
    }
  };

  const handleCancel = (): void => {
    setEditIndex(null);
    setNewTestimonial({ name: "", feedback: "", image: "" });
  };

  // Format testimonials as JavaScript code
  const getFormattedCode = (): string => {
    return `const testimonials: Testimonial[] = ${JSON.stringify(testimonials, null, 2)};`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white bg-black min-h-screen">
    <h1 className="text-2xl font-bold mb-6">Testimonials Editor</h1>
    
    {/* Form for adding/editing testimonials */}
    <div className="bg-gray-900 p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editIndex !== null ? 'Edit Testimonial' : 'Add New Testimonial'}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={newTestimonial.name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Feedback</label>
          <textarea
            name="feedback"
            value={newTestimonial.feedback}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24 bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image Path</label>
          <input
            type="text"
            name="image"
            value={newTestimonial.image}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-800 text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
          {editIndex !== null && (
            <button
              onClick={handleCancel}
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
    
    {/* List of existing testimonials */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Current Testimonials</h2>
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="border p-4 rounded flex justify-between items-start bg-gray-800">
            <div>
              <h3 className="font-medium text-white">{testimonial.name}</h3>
              <p className="text-gray-400 my-1">{testimonial.feedback}</p>
              <p className="text-sm text-gray-500">Image: {testimonial.image}</p>
            </div>
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
        ))}
      </div>
    </div>
    
    {/* Code output */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Generated Code</h2>
      <div className="bg-gray-900 text-white p-4 rounded overflow-auto">
        <pre>{getFormattedCode()}</pre>
      </div>
    </div>
  </div>
  );
}