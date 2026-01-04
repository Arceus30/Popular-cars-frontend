import { carBodies } from "@/carBodies";

export default function VehicleTabs({ setSelectedType, selectedType }) {
    return (
        <div className="flex overflow-x-auto pb-4 mb-8 border-b border-gray-200">
            {carBodies.map((type) => (
                <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 mx-1 whitespace-nowrap font-medium rounded-t-lg transition-all ${
                        selectedType === type
                            ? "bg-blue-500 text-white shadow-lg"
                            : "text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-blue-500"
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
    );
}
