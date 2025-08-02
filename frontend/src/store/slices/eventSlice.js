import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '../../services/eventService';

const initialState = {
  events: [],
  event: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  pagination: {
    current: 1,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

// Get all events
export const getEvents = createAsyncThunk(
  'events/getAll',
  async (filters, thunkAPI) => {
    try {
      return await eventService.getEvents(filters);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all events (alias for getEvents)
export const getAllEvents = createAsyncThunk(
  'events/getAll',
  async (filters, thunkAPI) => {
    try {
      return await eventService.getEvents(filters);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single event
export const getEvent = createAsyncThunk(
  'events/getOne',
  async (id, thunkAPI) => {
    try {
      return await eventService.getEvent(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single event by ID (alias for getEvent)
export const getEventById = createAsyncThunk(
  'events/getOne',
  async (id, thunkAPI) => {
    try {
      return await eventService.getEvent(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get upcoming events
export const getUpcomingEvents = createAsyncThunk(
  'events/getUpcoming',
  async (_, thunkAPI) => {
    try {
      return await eventService.getUpcomingEvents();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get events by category
export const getEventsByCategory = createAsyncThunk(
  'events/getByCategory',
  async (category, thunkAPI) => {
    try {
      return await eventService.getEventsByCategory(category);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get categories
export const getCategories = createAsyncThunk(
  'events/getCategories',
  async (_, thunkAPI) => {
    try {
      return await eventService.getCategories();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearEvent: (state) => {
      state.event = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.event = action.payload.data;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUpcomingEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUpcomingEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = action.payload.data;
      })
      .addCase(getUpcomingEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getEventsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEventsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = action.payload.data;
      })
      .addCase(getEventsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload.data;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearEvent } = eventSlice.actions;
export default eventSlice.reducer; 