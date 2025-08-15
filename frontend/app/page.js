import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-28 pb-12 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300">
          Welcome to ShopBase
        </h1>
        <p className="mt-8 text-xl text-gray-700 max-w-2xl mx-auto">
          Your favorite place for online shopping!
        </p>
        {/* Later, add hero section, featured products, CTA, etc. */}
      </main>
    </div>
  );
}
