import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllEvents } from '../store/slices/eventSlice';
import { CalendarIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const Events = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocationType, setSelectedLocationType] = useState(searchParams.get('locationType') || '');
  const [dateRange, setDateRange] = useState({
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Music', 'Tech', 'Business', 'Education', 'Sports', 'Arts', 'Food', 'Other'];
  const locationTypes = ['Online', 'In-Person', 'Hybrid'];

  useEffect(() => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedLocationType) filters.locationType = selectedLocationType;
    if (dateRange.startDate) filters.startDate = dateRange.startDate;
    if (dateRange.endDate) filters.endDate = dateRange.endDate;
    
    dispatch(getAllEvents(filters));
  }, [dispatch, searchTerm, selectedCategory, selectedLocationType, dateRange]);

  const handleFilterChange = (filterType, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        if (value) newSearchParams.set('search', value);
        else newSearchParams.delete('search');
        break;
      case 'category':
        setSelectedCategory(value);
        if (value) newSearchParams.set('category', value);
        else newSearchParams.delete('category');
        break;
      case 'locationType':
        setSelectedLocationType(value);
        if (value) newSearchParams.set('locationType', value);
        else newSearchParams.delete('locationType');
        break;
      case 'startDate':
        setDateRange(prev => ({ ...prev, startDate: value }));
        if (value) newSearchParams.set('startDate', value);
        else newSearchParams.delete('startDate');
        break;
      case 'endDate':
        setDateRange(prev => ({ ...prev, endDate: value }));
        if (value) newSearchParams.set('endDate', value);
        else newSearchParams.delete('endDate');
        break;
      default:
        break;
    }
    
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocationType('');
    setDateRange({ startDate: '', endDate: '' });
    setSearchParams({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-green-100 text-green-800';
      case 'Ongoing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
        <p className="text-gray-600">Discover and book amazing events</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
              <select
                value={selectedLocationType}
                onChange={(e) => handleFilterChange('locationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {locationTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {(searchTerm || selectedCategory || selectedLocationType || dateRange.startDate || dateRange.endDate) && (
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id || event._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={event.image || 'https://via.placeholder.com/400x225?text=Event'}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.category === 'Music' ? 'bg-purple-100 text-purple-800' :
                    event.category === 'Tech' ? 'bg-blue-100 text-blue-800' :
                    event.category === 'Business' ? 'bg-green-100 text-green-800' :
                    event.category === 'Education' ? 'bg-yellow-100 text-yellow-800' :
                    event.category === 'Sports' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
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
                    {event.location} ({event.locationType})
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
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later for new events.</p>
        </div>
      )}
    </div>
  );
};

export default Events; 