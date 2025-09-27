import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col h-screen p-6">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6">Hi User</h1>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Your Recents</h2>
          <p className="text-gray-600">
            This is the first card.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Due Projects</h2>
          <p className="text-gray-600">
            This is the second card.
          </p>
        </div>
        
      </div>
    </div>
  );
}
