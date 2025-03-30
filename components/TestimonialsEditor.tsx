import { useState, useEffect } from 'react';
import axios from 'axios';

interface Testimonial {
    _id?: string;
    name: string;
    feedback: string;
    image: string;
}  

const API_BASE_URL = "api/testimonials";

export default function TestimonialsEditor(): JSX.Element {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    name: "",
    feedback: "",
    image: ""
  });

  // Fetch testimonials from API
  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(response => setTestimonials(response.data))
      .catch(error => console.error("Error fetching testimonials:", error));
  }, []);

  const handleEdit = (index: number): void => {
    console.log("Editing index:", index);
    console.log("Testimonial data:", testimonials[index]); // Debugging
  
    if (!testimonials[index]?._id) {
      console.error("Error: Testimonial ID is undefined!");
      return;
    }
  
    setEditIndex(index);
    setNewTestimonial({ ...testimonials[index] });
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
  
    setNewTestimonial((prev) => ({
      ...prev,
      [name]: value,
      _id: prev._id,
    }));
  };
  
  const handleSave = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update testimonial: ${response.statusText}`);
      }
  
      const updatedTestimonial = await response.json();
      console.log("Successfully updated testimonial:", updatedTestimonial);
          // Reset form
    setEditIndex(null);
    setNewTestimonial({ name: "", feedback: "", image: "" });
    } catch (error) {
      console.error("PUT request error:", error);
    }
  };
  
  const handleDelete = async (index: number): Promise<void> => {
    try {
      const id = testimonials[index]._id;
  
      const response = await fetch(`/api/testimonials`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }
  
      setTestimonials(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
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
          <input type="text" name="name" value={newTestimonial.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded bg-gray-800 text-white" />
          <textarea name="feedback" value={newTestimonial.feedback} onChange={handleChange} placeholder="Feedback" className="w-full p-2 border rounded h-24 bg-gray-800 text-white" />
          <input type="text" name="image" value={newTestimonial.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded bg-gray-800 text-white" />
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{editIndex !== null ? 'Update' : 'Add'}</button>
            {editIndex !== null && <button onClick={() => setEditIndex(null)} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Cancel</button>}
          </div>
        </div>
      </div>
      
      {/* List of testimonials */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Testimonials</h2>
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial._id} className="border p-4 rounded flex justify-between items-start bg-gray-800">
              <div>
                <h3 className="font-medium text-white">{testimonial.name}</h3>
                <p className="text-gray-400 my-1">{testimonial.feedback}</p>
                <p className="text-sm text-gray-500">Image: {testimonial.image}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(index)} className="text-blue-400 hover:text-blue-500">Edit</button>
                <button onClick={() => handleDelete(index)} className="text-red-400 hover:text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
