// store/courseStore.js
import { create } from "zustand";

export const useCourseStore = create((set) => ({
  courses: [],
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("access");

    try {
      const response = await fetch("https://lms-backend-xpwc.onrender.com/api/courses/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      set({ courses: data, loading: false });
    } catch (error) {
      set({ error: "Failed to load courses", loading: false });
    }
  },
}));
