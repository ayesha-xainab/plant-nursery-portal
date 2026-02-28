import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlantImage } from "../services/unsplashService";

const PlantCard = ({ plant, onRefresh, displayMode = "default" }) => {
  const token = localStorage.getItem("token");
  const [image, setImage] = useState("");

  // 🔹 Fetch image from Unsplash using plant name
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await getPlantImage(plant.name);
        setImage(url);
      } catch (err) {
        console.error("Image fetch failed");
      }
    };

    fetchImage();
  }, [plant.name]);

  const navigate = useNavigate();

  // Instead of borrowing immediately, navigate to MyRentals to collect days/shipping/payment
  const goToRent = () => {
    navigate(`/rentals?plantId=${plant._id}`);
  };

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-md p-4 hover:-translate-y-1 transition-transform duration-300">
      {/* 🌿 Plant Image */}
      <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={image || "https://via.placeholder.com/300"}
          alt={plant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300";
          }}
        />
      </div>

      {/* 🌱 Plant Info */}
      <h2 className="text-lg font-semibold mt-3 text-green-700">{plant.name}</h2>

      {/* Purchase view: show only price and add-to-cart */}
      {displayMode === "purchase" && (
        <>
          <p className="text-gray-600 text-sm">{plant.description}</p>

          <p className="text-sm text-gray-500">🌿 Care: {plant.careInstructions}</p>

          <p className="mt-2 font-medium">💰 Rs. {plant.price}</p>

          {token ? (
            <button
              onClick={async () => {
                await axios.post(
                  `${import.meta.env.VITE_API_URL}/api/cart/add`,
                  { plantId: plant._id },
                  { headers: { Authorization: token } }
                );
                alert("Added to cart 🛒");
              }}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          ) : (
            <p className="mt-4 text-sm text-gray-500 italic">Login to buy plants 🌱</p>
          )}

          {plant.stock === 0 && (
            <p className="mt-4 text-red-500 font-medium">Out of stock 🚫</p>
          )}
        </>
      )}

      {/* Rental view: show rent/day and borrow button only */}
      {displayMode === "rental" && (
        <>
          <p className="text-gray-600 text-sm">{plant.description}</p>

          <p className="text-sm text-gray-500">🌿 Care: {plant.careInstructions}</p>

          <p className="mt-2 font-medium text-green-700">Rent/day: Rs. {plant.rentPerDay?.toFixed ? plant.rentPerDay.toFixed(2) : plant.rentPerDay}</p>

          {token && plant.stock > 0 ? (
            <button
              onClick={goToRent}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Borrow Plant
            </button>
          ) : (
            <p className="mt-4 text-sm text-gray-500 italic">Login to borrow plants 🌱</p>
          )}

          {plant.stock === 0 && (
            <p className="mt-4 text-red-500 font-medium">Out of stock 🚫</p>
          )}
        </>
      )}

      {/* Default/full view (catalog, admin, etc.) */}
      {displayMode === "default" && (
        <>
          <p className="text-gray-600 text-sm">{plant.description}</p>

          <p className="mt-2 font-medium">💰 Rs. {plant.price}</p>

          {plant.isAvailableForRent && (
            <p className="mt-1 text-sm text-green-600">Rent/day: Rs. {plant.rentPerDay?.toFixed ? plant.rentPerDay.toFixed(2) : plant.rentPerDay}</p>
          )}

          <p className="text-sm text-gray-500">🌿 Care: {plant.careInstructions}</p>

          {/* Borrow Button */}
          {token && plant.isAvailableForRent && plant.stock > 0 && (
            <button
              onClick={goToRent}
              className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Borrow Plant
            </button>
          )}

          {/* Add to Cart Button */}
          {token && (
            <button
              onClick={async () => {
                await axios.post(
                  `${import.meta.env.VITE_API_URL}/api/cart/add`,
                  { plantId: plant._id },
                  { headers: { Authorization: token } }
                );
                alert("Added to cart 🛒");
              }}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          )}

          {/* Login Hint */}
          {!token && (
            <p className="mt-4 text-sm text-gray-500 italic">Login to buy or rent plants 🌱</p>
          )}

          {/* 🚫 Out of Stock */}
          {plant.stock === 0 && (
            <p className="mt-4 text-red-500 font-medium">Out of stock 🚫</p>
          )}
        </>
      )}
    </div>
  );
};

export default PlantCard;
