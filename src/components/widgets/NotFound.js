import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-600 opacity-20 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-700 opacity-20 rounded-full animate-pulse-slow delay-200"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500 opacity-15 rounded-full animate-pulse-slow delay-400"></div>

      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random(),
            animation: `twinkle ${Math.random() * 5 + 2}s infinite ${Math.random() * 5}s alternate`,
          }}
        ></div>
      ))}

      <h1 className="text-white text-3xl md:text-4xl font-semibold mb-8 z-10">
        Look like you're lost in space
      </h1>

      <div className="flex items-center justify-center space-x-4 md:space-x-8 z-10">
        <span className="text-white text-8xl md:text-9xl font-bold">4</span>
        <div className="relative">
          <img
            src="https://e7.pngegg.com/pngimages/517/560/png-clipart-astronaut-illustration-astronaut-floating-in-space-astronaut-space-cartoon-astronaut.png"
            alt="Astronaut floating"
            className="w-32 md:w-48 h-auto animate-float"
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-8xl md:text-9xl font-bold">
            0
          </span>
        </div>
        <span className="text-white text-8xl md:text-9xl font-bold">4</span>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-12 px-8 py-3 bg-white text-indigo-900 font-semibold rounded-full shadow-lg hover:bg-gray-200 transition duration-300 z-10"
      >
        GO BACK
      </button>

      <div className="absolute bottom-4 text-white text-sm opacity-75 z-10">
        designed by <span className="font-bold">freepik</span>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes pulse-slow {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
