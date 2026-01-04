"use client";
import axios from "axios";
import VehicleTabs from "@/components/VehicleTabs";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function VehicleSelector() {
    const [selectedType, setSelectedType] = useState("SUV");
    const [vehicles, setVehicles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const CARDS_PER_VIEW = 4;
    let MAX_INDEX = 0;

    useEffect(() => {
        fetchVehicles();
    }, [selectedType]);

    const fetchVehicles = async () => {
        setLoading(true);
        setCurrentIndex(0);
        try {
            const response = await axios.get(
                `https://popular-cars.onrender.com/popular-cars/api?q=${selectedType}`
            );
            let data = await response.data.cars;
            data = data.sort((a, b) => b.interestScore - a.interestScore);
            MAX_INDEX = Math.max(0, vehicles.length - CARDS_PER_VIEW);
            setVehicles(data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setVehicles(mockData);
        } finally {
            setLoading(false);
        }
    };

    const goToNext = useCallback(() => {
        if (currentIndex >= MAX_INDEX) return;
        setCurrentIndex((prev) => Math.min(MAX_INDEX, prev + 1));
    }, [currentIndex, MAX_INDEX]);

    const goToPrevious = useCallback(() => {
        if (currentIndex === 0) return;
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, [currentIndex]);

    const cardVariants = {
        initial: { x: "100%", opacity: 0, scale: 0.95 },
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
        exit: {
            x: "-100%",
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const visibleVehicles = vehicles.slice(
        currentIndex,
        currentIndex + CARDS_PER_VIEW
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <VehicleTabs
                setSelectedType={setSelectedType}
                selectedType={selectedType}
            />
            {/* Carousel Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg
                            className="w-5 h-5 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goToNext}
                        disabled={currentIndex === MAX_INDEX}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg
                            className="w-5 h-5 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </motion.button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array(4)
                        .fill(0)
                        .map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        {visibleVehicles.map((vehicle, index) => (
                            <motion.div
                                key={`${vehicle.make}-${vehicle.model}-${
                                    currentIndex + index
                                }`}
                                className="group cursor-pointer hover:shadow-xl border rounded-xl overflow-hidden"
                                variants={cardVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                layout
                            >
                                <div className="relative w-full h-48">
                                    <Image
                                        src={vehicle.imageUrl}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        priority={index < 2}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {vehicle.make} {vehicle.model}
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600 mb-2">
                                        Starting at $
                                        {vehicle.startingPrice?.toLocaleString()}
                                        *
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
