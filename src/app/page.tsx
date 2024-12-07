/* eslint-disable react/react-in-jsx-scope */
"use client";

import Header from "./components/Header";
import { FaBasketballBall, FaChartLine, FaUsers } from "react-icons/fa";
import { BsBullseye } from "react-icons/bs";

export default function Home() {
  return (
    <main className="h-screen bg-gradient-to-b from-white to-gray-100">
      <Header />
      
      <section className="container mx-auto px-4 pt-12 text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-600 mb-8 leading-relaxed">
            Betting Made Easy
          </h1>
          
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-12 mt-4">
            NBA Stats Predictor is a tool for basketball enthusiasts, analysts, and fantasy sports players 
            to project player and team performances in upcoming games.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 mb-4 flex justify-center">
              <FaChartLine size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
            <p className="text-gray-600">
              Leverage historical data and sophisticated algorithms for accurate predictions
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-orange-600 mb-4 flex justify-center">
              <BsBullseye size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Precise Predictions</h3>
            <p className="text-gray-600">
              Get detailed projections for points, rebounds, assists, and more
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 mb-4 flex justify-center">
              <FaUsers size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-3">For Everyone</h3>
            <p className="text-gray-600">
              Perfect for fans, analysts, and fantasy sports enthusiasts
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-700">
            Search for your favorite players or teams in the search bar above to begin making predictions
          </p>
        </div>

        <div className="mt-8 animate-bounce">
          <FaBasketballBall className="text-orange-600 mx-auto" size={40} />
        </div>
      </section>
    </main>
  );
}
