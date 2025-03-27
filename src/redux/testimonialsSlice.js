import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch testimonials with optimized API payload
export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('https://randomuser.me/api/?results=5&nat=IN');

      // Define arrays for dynamic data
      const jobTitles = ['Software Engineer', 'Frontend Developer', 'Buisness Development Executive', 'Data Analyst', 'UI/UX Designer'];
      const testimonialTexts = [
        'This AI tool gave me invaluable feedback that helped me land my dream job!',
        'The AI-powered interview analysis saved me hours and boosted my confidence!',
        'With this tool, I finally understood what employers are really looking for.',
        'This platform helped me spot the gaps in my resume and fix them quickly!',
        'I felt fully prepared for my interviews after using the personalized insights!',
        'The resume suggestions were spot on and got me more recruiter callbacks!'
      ];

      // Return formatted data, reducing payload size and improving variety
      return res.data.results.map((user, index) => ({
        name: `${user.name.first} ${user.name.last}`,
        image: user.picture.thumbnail,
        jobTitle: jobTitles[index % jobTitles.length],
        text: testimonialTexts[index % testimonialTexts.length],
      }));
    } catch {
      return rejectWithValue('Failed to fetch testimonials. Please try again later.');
    }
  }
);


// Memoized selector to optimize re-renders
export const selectTestimonials = createSelector(
  (state) => state.testimonials.data,
  (data) => data 
);

// Redux slice with state and reducers
const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: {
    data: [],
    loading: false,
    error: null,
    slidesPerView: 3,
  },
  reducers: {
    setSlidesPerView: (state, action) => {
      state.slidesPerView = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching testimonials.';
      });
  },
});

export const { setSlidesPerView } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
