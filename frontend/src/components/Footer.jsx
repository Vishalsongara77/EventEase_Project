const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-2 text-xl font-bold">EventEase</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your premier platform for discovering and booking amazing events. 
              From concerts to workshops, find your next unforgettable experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/events" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Browse Events
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Email: info@eventease.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Event Street, City, State 12345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} EventEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 