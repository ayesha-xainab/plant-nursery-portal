import axios from "axios";
import { useState } from "react";

const AdminPlantTable = ({ plants, refreshPlants }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const token = localStorage.getItem("token");

  const deletePlant = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/plants/${id}`, { headers: { Authorization: token } });
    refreshPlants();
  };

  const startEdit = (plant) => {
    setEditingId(plant._id);
    setEditValues({
      name: plant.name || "",
      price: plant.price || 0,
      stock: plant.stock || 0,
      isAvailableForRent: !!plant.isAvailableForRent,
      rentPerDay: plant.rentPerDay || 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/plants/${id}`, editValues, { headers: { Authorization: token } });
      refreshPlants();
      cancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-green-700 mb-4">Manage Plants 🌿</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>For Rent</th>
            <th>Rent/day</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {plants.map((plant) => (
            <tr key={plant._id} className="border-b">
              {editingId === plant._id ? (
                <>
                  <td>
                    <input className="border p-1" value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} />
                  </td>
                  <td>
                    <input type="number" className="border p-1 w-28" value={editValues.price} onChange={(e) => setEditValues({ ...editValues, price: Number(e.target.value) })} />
                  </td>
                  <td>
                    <input type="number" className="border p-1 w-20" value={editValues.stock} onChange={(e) => setEditValues({ ...editValues, stock: Number(e.target.value) })} />
                  </td>
                  <td>
                    <input type="checkbox" checked={editValues.isAvailableForRent} onChange={(e) => setEditValues({ ...editValues, isAvailableForRent: e.target.checked })} />
                  </td>
                  <td>
                    <input type="number" className="border p-1 w-28" value={editValues.rentPerDay} onChange={(e) => setEditValues({ ...editValues, rentPerDay: Number(e.target.value) })} />
                  </td>
                  <td>
                    <button onClick={() => saveEdit(plant._id)} className="text-green-600 mr-3">Save</button>
                    <button onClick={cancelEdit} className="text-gray-600">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{plant.name}</td>
                  <td>Rs {plant.price}</td>
                  <td>{plant.stock}</td>
                  <td>{plant.isAvailableForRent ? "Yes" : "No"}</td>
                  <td>Rs {plant.rentPerDay || 0}</td>
                  <td>
                    <button onClick={() => startEdit(plant)} className="text-blue-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => deletePlant(plant._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPlantTable;
