import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getInitialUser = () => {
  try {
    const user = sessionStorage.getItem('user');
    return user && user !== 'undefined' ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

// LOGIN THUNK
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true,
      });

      // Extract user object safely regardless of backend structure
      const userObj = response.data.user || response.data.data || response.data;

      if (userObj) {
        sessionStorage.setItem('user', JSON.stringify(userObj));
      }

      return {
        ...response.data,
        user: userObj
      };
    } catch (err) {
      console.error('Login Thunk Error:', err);
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.error || 'Login failed'
      );
    }
  }
);

// LOGOUT THUNK
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      sessionStorage.clear();
      localStorage.clear();
      return true;
    } catch (err) {
      sessionStorage.clear();
      localStorage.clear();
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload; // Lives purely in Redux memory
    },
    logout: (state) => {
      sessionStorage.clear();
      localStorage.clear();
      state.user = null;
      state.error = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token; // Stored in memory on login
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;