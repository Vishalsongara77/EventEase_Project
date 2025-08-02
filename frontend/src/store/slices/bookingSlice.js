import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from '../../services/bookingService';

const initialState = {
  bookings: [],
  booking: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isCreating: false,
  message: '',
  pagination: {
    current: 1,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

// Create booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, thunkAPI) => {
    try {
      return await bookingService.createBooking(bookingData);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user bookings
export const getUserBookings = createAsyncThunk(
  'bookings/getUserBookings',
  async (filters, thunkAPI) => {
    try {
      return await bookingService.getUserBookings(filters);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single booking
export const getBooking = createAsyncThunk(
  'bookings/getOne',
  async (id, thunkAPI) => {
    try {
      return await bookingService.getBooking(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id, thunkAPI) => {
    try {
      return await bookingService.cancelBooking(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearBooking: (state) => {
      state.booking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.isCreating = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreating = false;
        state.isSuccess = true;
        state.booking = action.payload.data;
        state.message = action.payload.message;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isCreating = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.booking = action.payload.data;
      })
      .addCase(getBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.booking = action.payload.data;
        state.message = action.payload.message;
        // Update the booking in the bookings array
        const index = state.bookings.findIndex(booking => booking.id === action.payload.data.id);
        if (index !== -1) {
          state.bookings[index] = action.payload.data;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer; 