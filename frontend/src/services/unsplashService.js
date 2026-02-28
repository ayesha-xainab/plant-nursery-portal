import axios from "axios";

const unsplash = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}`,
  },
});

export const getPlantImage = async (query) => {
  const res = await unsplash.get("/search/photos", {
    params: {
      query,
      per_page: 1,
    },
  });

  return res.data.results[0]?.urls?.regular;
};
