import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings, cancelBooking } from '../store/slices/bookingSlice';
import { CalendarIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.bookings);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setCancellingId(bookingId);
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        toast.success('Booking cancelled successfully');
        dispatch(getUserBookings()); // Refresh bookings
      } catch (error) {
        toast.error(error.message || 'Failed to cancel booking');
      } finally {
        setCancellingId(null);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelBooking = (booking, event) => {
    if (booking.status === 'Cancelled') return false;
    if (event.status === 'Completed' || event.status === 'Ongoing') return false;
    return true;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your event bookings</p>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
                          <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.event.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(booking.event.status)}`}>
                        {booking.event.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{booking.event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {moment(booking.event.date).format('DD-MMM-YYYY')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {booking.event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {booking.event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        ${booking.totalAmount} total
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Booked on: {moment(booking.bookingDate).format('DD-MMM-YYYY')}</span>
                      <span>Seats: {booking.numberOfSeats}</span>
                    </div>

                    {booking.cancelledAt && (
                      <div className="mt-2 text-sm text-red-600">
                        Cancelled on: {moment(booking.cancelledAt).format('DD-MMM-YYYY')}
                        {booking.cancellationReason && (
                          <span> - {booking.cancellationReason}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col items-end">
                    <div className="text-right mb-2">
                      <div className="text-lg font-semibold text-gray-900">
                        ${booking.totalAmount}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.numberOfSeats} seat{booking.numberOfSeats !== 1 ? 's' : ''} × ${booking.event.price}
                      </div>
                    </div>

                    {canCancelBooking(booking, booking.event) && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
          <a
            href="/events"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Browse Events
          </a>
        </div>
      )}

      {/* Booking Statistics */}
      {bookings.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'Confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status === 'Cancelled').length}
              </div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 