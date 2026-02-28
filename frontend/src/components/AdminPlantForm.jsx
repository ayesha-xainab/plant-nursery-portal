import { useState } from "react";
import axios from "axios";

const AdminPlantForm = ({ refreshPlants }) => {
  const [formData, setFormData] = useState({
    name: "",
    categories: [],
    price: "",
    stock: "",
    description: "",
    careInstructions: "",
    isAvailableForRent: false,
    rentPerDay: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "categories") {
      setFormData((prev) => ({
        ...prev,
        categories: checked
          ? [...prev.categories, value]
          : prev.categories.filter((cat) => cat !== value),
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/api/plants`, formData, { headers: { Authorization: localStorage.getItem("token") } });
    refreshPlants();
    setFormData({
      name: "",
      categories: [],
      price: "",
      stock: "",
      description: "",
      careInstructions: "",
      isAvailableForRent: false,
      rentPerDay: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md mb-8"
    >
      <h2 className="text-xl font-bold text-green-700 mb-4">
        Add New Plant 🌱
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input name="name" placeholder="Name" onChange={handleChange} value={formData.name} className="border p-2 rounded" required />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} value={formData.price} className="border p-2 rounded" required />
        <input name="stock" type="number" placeholder="Stock" onChange={handleChange} value={formData.stock} className="border p-2 rounded" required />
        <input name="rentPerDay" type="number" placeholder="Rent per day" onChange={handleChange} value={formData.rentPerDay} className="border p-2 rounded" />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        <div className="grid grid-cols-2 gap-2">
          {["Indoor", "Outdoor", "Flowering", "Succulent", "Herbal", "Medicinal"].map((cat) => (
            <label key={cat} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="categories"
                value={cat}
                checked={formData.categories.includes(cat)}
                onChange={handleChange}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        value={formData.description}
        className="border p-2 rounded w-full mt-4"
      />

      <textarea
        name="careInstructions"
        placeholder="Care Instructions"
        onChange={handleChange}
        value={formData.careInstructions}
        className="border p-2 rounded w-full mt-2"
      />

      <label className="flex items-center gap-2 mt-3">
        <input
          type="checkbox"
          name="isAvailableForRent"
          checked={formData.isAvailableForRent}
          onChange={handleChange}
        />
        Available for Rent
      </label>

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add Plant
      </button>
    </form>
  );
};

export default AdminPlantForm;
