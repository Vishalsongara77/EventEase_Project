import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUpcomingEvents } from '../store/slices/eventSlice';
import { CalendarIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const Home = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getUpcomingEvents());
  }, [dispatch]);

  const eventCategories = [
    { name: 'Music', icon: '🎵', color: 'bg-purple-100 text-purple-800' },
    { name: 'Tech', icon: '💻', color: 'bg-blue-100 text-blue-800' },
    { name: 'Business', icon: '💼', color: 'bg-green-100 text-green-800' },
    { name: 'Education', icon: '📚', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Sports', icon: '⚽', color: 'bg-red-100 text-red-800' },
    { name: 'Arts', icon: '🎨', color: 'bg-pink-100 text-pink-800' },
  ];

  const getCategoryBadgeColor = (category) => {
    const colorMap = {
      'Music': 'bg-purple-100 text-purple-800',
      'Tech': 'bg-blue-100 text-blue-800',
      'Business': 'bg-green-100 text-green-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Sports': 'bg-red-100 text-red-800',
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  const renderEventCard = (event) => (
    <div key={event.id || event._id} className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={event.image || 'https://via.placeholder.com/400x225?text=Event'}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(event.category)}`}>
            {event.category}
          </span>
          <span className="text-sm text-gray-500">{event.eventId}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {moment(event.date).format('DD-MMM-YYYY')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            ${event.price}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {event.availableSeats} seats available
          </span>
          <Link
            to={`/events/${event.id || event._id}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p className="mt-2 text-gray-600">Loading events...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <p className="text-gray-600">No upcoming events at the moment.</p>
    </div>
  );

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Book tickets for concerts, workshops, conferences, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Browse Events
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find events that match your interests
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {eventCategories.map((category) => (
              <Link
                key={category.name}
                to={`/events?category=${category.name}`}
                className="group"
              >
                <div className="text-center p-6 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600">
              Don't miss out on these exciting events
            </p>
          </div>

          {isLoading ? renderLoadingState() : 
           events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.slice(0, 6).map(renderEventCard)}
            </div>
          ) : renderEmptyState()}

          {events.length > 6 && (
            <div className="text-center mt-12">
              <Link
                to="/events"
                className="btn-primary text-lg px-8 py-3"
              >
                View All Events
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EventEase?
            </h2>
            <p className="text-lg text-gray-600">
              The easiest way to discover and book events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Book up to 2 seats per event with just a few clicks
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Filtering
              </h3>
              <p className="text-gray-600">
                Filter events by category, location, and date range
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mobile Friendly
              </h3>
              <p className="text-gray-600">
                Access and book events from any device
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 