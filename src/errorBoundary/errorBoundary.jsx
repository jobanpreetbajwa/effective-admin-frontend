import React from 'react'

export default function ErrorBoundary() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black/80">
          <div className="p-8  shadow-md rounded-md max-w-lg w-full bg-gray-100">
            <h1 className="text-3xl font-semibold text-red-600 mb-4 animate-pulse">Something went wrong !</h1>
            <p className="text-lg text-gray-800 mb-6 animate-pulse">
              We apologize for the inconvenience. Please try again later Or refresh it.
            </p>
           
          </div>
        </div>
      );
}
