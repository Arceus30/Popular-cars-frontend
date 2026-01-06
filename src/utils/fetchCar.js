import axios from "axios";

export async function fetchCars(selectedType) {
    try {
        const response = await axios.get(
            `https://popular-cars.onrender.com/popular-cars/api?q=${selectedType}`
        );
        return await response.data;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}
