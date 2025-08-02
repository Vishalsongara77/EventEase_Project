import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventById, clearEvent } from '../store/slices/eventSlice';
import { createBooking } from '../store/slices/bookingSlice';
import { CalendarIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, UserIcon, TicketIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { event, isLoading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const { isCreating } = useSelector((state) => state.bookings);
  
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    dispatch(getEventById(id));
    return () => dispatch(clearEvent());
  }, [dispatch, id]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book this event');
      navigate('/login');
      return;
    }

    if (numberOfSeats < 1 || numberOfSeats > 2) {
      toast.error('You can book 1-2 seats per event');
      return;
    }

    if (numberOfSeats > event.availableSeats) {
      toast.error('Not enough seats available');
      return;
    }

    try {
      await dispatch(createBooking({
        eventId: event.id || event._id,
        numberOfSeats,
        totalAmount: event.price * numberOfSeats
      })).unwrap();
      
      toast.success('Booking successful!');
      setShowBookingForm(false);
      setNumberOfSeats(1);
      // Refresh event data to update available seats
      dispatch(getEventById(id));
    } catch (error) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-green-100 text-green-800';
      case 'Ongoing': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Music': return 'bg-purple-100 text-purple-800';
      case 'Tech': return 'bg-blue-100 text-blue-800';
      case 'Business': return 'bg-green-100 text-green-800';
      case 'Education': return 'bg-yellow-100 text-yellow-800';
      case 'Sports': return 'bg-red-100 text-red-800';
      case 'Arts': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Event Image */}
          <div className="mb-8">
            <img
              src={event.image || 'https://via.placeholder.com/800x400?text=Event'}
              alt={event.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{event.description}</p>

            {/* Event Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{moment(event.date).format('DD-MMM-YYYY')}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{event.time} ({event.duration} minutes)</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{event.location} ({event.locationType})</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CurrencyDollarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>${event.price} per seat</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <TicketIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{event.availableSeats} seats available</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{event.bookedSeats} seats booked</span>
                </div>
                <div className="text-sm text-gray-500">
                  Event ID: {event.eventId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Event</h3>
            
            {event.status === 'Completed' ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">This event has already ended.</p>
              </div>
            ) : event.availableSeats === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">This event is fully booked.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Seats (Max 2)
                  </label>
                  <select
                    value={numberOfSeats}
                    onChange={(e) => setNumberOfSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {[...Array(Math.min(2, event.availableSeats))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} seat{i + 1 !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Price per seat:</span>
                    <span>${event.price}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Number of seats:</span>
                    <span>{numberOfSeats}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${event.price * numberOfSeats}</span>
                    </div>
                  </div>
                </div>

                {!user ? (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Login to Book
                  </button>
                ) : (
                  <button
                    onClick={handleBooking}
                    disabled={isCreating}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isCreating ? 'Booking...' : 'Book Now'}
                  </button>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  <p>• You can book up to 2 seats per event</p>
                  <p>• Booking is final and cannot be modified</p>
                  <p>• Cancellation is allowed before event starts</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 