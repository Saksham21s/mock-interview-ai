import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch testimonials from Random User API + dummy quotes
export const fetchTestimonials = createAsyncThunk('testimonials/fetchTestimonials', async () => {
  const res = await axios.get('https://randomuser.me/api/?results=5');
  const users = res.data.results;
  
  // Combine API data with dummy testimonials
  const testimonialsData = users.map((user, index) => ({
    name: `${user.name.first} ${user.name.last}`,
    image: user.picture.medium,
    jobTitle: index % 2 === 0 ? 'Software Engineer' : 'Product Manager',
    text: index % 2 === 0
      ? 'This AI tool gave me invaluable feedback that helped me land my dream job!'
      : 'The AI-powered interview analysis saved me hours and boosted my confidence!',
  }));
  return testimonialsData;
});

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch testimonials';
      });
  },
});

export default testimonialsSlice.reducer;
