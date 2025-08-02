import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">EventEase Test Page</h1>
      </div>
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Application is Working!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            If you can see this page, the basic React setup is working correctly.
          </p>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Quick Links:</h3>
            <div className="space-y-2">
              <a href="/" className="block text-blue-600 hover:text-blue-800">Home Page</a>
              <a href="/login" className="block text-blue-600 hover:text-blue-800">Login</a>
              <a href="/register" className="block text-blue-600 hover:text-blue-800">Register</a>
              <a href="/events" className="block text-blue-600 hover:text-blue-800">Events</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage; 