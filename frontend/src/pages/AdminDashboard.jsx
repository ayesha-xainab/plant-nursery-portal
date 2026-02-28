import { useEffect, useState } from "react";
import axios from "axios";
import AdminPlantForm from "../components/AdminPlantForm";
import AdminPlantTable from "../components/AdminPlantTable";

const AdminDashboard = () => {
  const [plants, setPlants] = useState([]);

  const fetchPlants = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/plants`);
    setPlants(res.data);
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Admin Dashboard 
      </h1>

      <AdminPlantForm refreshPlants={fetchPlants} />
      <AdminPlantTable plants={plants} refreshPlants={fetchPlants} />
    </div>
  );
};

export default AdminDashboard;
