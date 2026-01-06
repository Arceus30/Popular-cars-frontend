export default function SkeletonCard() {
    return (
        <div
            className="w-80 h-80 border border-gray-200 rounded-xl flex flex-col items-start animate-pulse shadow-sm"
            style={{ flexShrink: 0 }}
        >
            <div className="relative w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-t-xl"></div>

            <div className="mt-4 w-full pl-2 flex-1">
                <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-4/5 mb-4"></div>

                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-3/5 mb-2"></div>
            </div>
        </div>
    );
}
