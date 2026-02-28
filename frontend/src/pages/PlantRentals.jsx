import { useEffect, useState } from "react";
import { getAllPlants } from "../services/plantService";
import PlantCard from "../components/PlantCard";

const PlantRentals = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getAllPlants();
        // Filter to only plants available for rent
        const rentablePlants = data.filter(plant => plant.isAvailableForRent);
        setPlants(rentablePlants);
        setFilteredPlants(rentablePlants);
      } catch (error) {
        console.error("Error fetching plants", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  useEffect(() => {
    let result = plants;

    if (search) {
      result = result.filter((plant) =>
        plant.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter(
        (plant) => plant.categories && plant.categories.includes(category)
      );
    }

    setFilteredPlants(result);
  }, [search, category, plants]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-green-600">
        Loading plants 🌱...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        Plant Rentals 🪴
      </h1>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All Plants</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Flowering">Flowering</option>
          <option value="Succulent">Succulent</option>
          <option value="Herbal">Herbal</option>
          <option value="Medicinal">Medicinal</option>
        </select>
      </div>

      {/* 🌱 Plant Grid */}
      {filteredPlants.length === 0 ? (
        <p className="text-center text-gray-500">
          No plants available for rent 😔
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant._id} plant={plant} displayMode={"rental"} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantRentals;
