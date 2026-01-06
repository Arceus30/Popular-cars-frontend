"use client";
import Image from "next/image";
import { carBodies } from "@/carBodies";
import { useState, useEffect } from "react";
import { fetchCars } from "@/utils/fetchCar";
import SkeletonCard from "@/components/SkeletonCard";

export default function Home() {
    const [selectedType, setSelectedType] = useState("Hatchback");
    const [vehicles, setVehicles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [maxIndex, setMaxIndex] = useState(0);

    const CARDS_PER_VIEW = 4;

    useEffect(() => {
        fetchVehicles();
    }, [selectedType]);

    const fetchVehicles = async () => {
        setLoading(true);
        setCurrentIndex(0);
        try {
            const res = await fetchCars(selectedType);
            let data = res.cars || [];
            data = data.sort((a, b) => b.interestScore - a.interestScore);
            setVehicles(data);
            setMaxIndex(Math.max(0, data.length - CARDS_PER_VIEW));
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setVehicles([]);
            setMaxIndex(0);
        } finally {
            setLoading(false);
        }
    };

    const goToNext = () => {
        if (currentIndex >= maxIndex) return;
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const goToPrevious = () => {
        if (currentIndex === 0) return;
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const visibleVehicles = vehicles.slice(
        currentIndex,
        currentIndex + CARDS_PER_VIEW
    );

    return (
        <div className="p-6 mx-5">
            <div className="flex border-gray-300 border-b mb-8 pb-4">
                {carBodies.map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 mx-1 font-medium rounded-t-lg transition-all cursor-pointer hover:text-blue-500 ${
                            selectedType === type
                                ? "border-b-3 border-blue-500 shadow-lg"
                                : "text-gray-600 hover:border-b-2 hover:border-blue-500"
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <div className="flex items-center mb-6 px-2 gap-5">
                <button
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    className="min-w-8 rounded-full pt-1 pb-2 pl-1 border border-gray-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.05] font-extrabold text-3xl"
                >
                    ←
                </button>

                <div className="flex gap-6 justify-center items-center">
                    {loading
                        ? Array(4)
                              .fill(0)
                              .map((_, i) => <SkeletonCard key={i} />)
                        : visibleVehicles.map((vehicle, index) => (
                              <div
                                  key={`${vehicle.make}-${vehicle.model}-${
                                      currentIndex + index
                                  }`}
                                  className="w-80 h-80 border border-gray-200 rounded-xl flex flex-col items-start cursor-pointer hover:shadow-md"
                              >
                                  <div className="relative w-full h-48">
                                      <Image
                                          src={vehicle.imageUrl}
                                          alt={`${vehicle.make} ${vehicle.model}`}
                                          fill
                                          className="object-cover rounded-t-lg"
                                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                          priority={index < 2}
                                      />
                                  </div>
                                  <div className="mt-4 pl-2">
                                      <h3 className="text-lg font-bold text-gray-900">
                                          {vehicle.make} {vehicle.model}
                                      </h3>
                                      <p className="text-md font-bold text-blue-600 mb-2">
                                          Starting at $
                                          {vehicle.startingPrice?.toLocaleString()}
                                          *
                                      </p>
                                  </div>
                              </div>
                          ))}
                </div>

                <button
                    onClick={goToNext}
                    disabled={currentIndex === maxIndex}
                    className="min-w-8 rounded-full pt-1 pb-2 pr-1 border border-gray-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.05] font-extrabold text-3xl"
                >
                    →
                </button>
            </div>
        </div>
    );
}
