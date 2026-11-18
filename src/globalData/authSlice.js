import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, 
  isAuthenticated: !!localStorage.getItem("user"),
  isInitialLoading: false,
  employeeData:{}
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload)); 
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user"); 
    },
    setEmployee:(state,action)=>{
       state.employeeData = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("employee", JSON.stringify(action.payload));  
    },
    setInitialLoading: (state, action) => {
      state.isInitialLoading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
      state.employeeData = { ...(state.employeeData || {}), ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("employee", JSON.stringify(state.employeeData));
    },
  },
});

export const { login, logout, setInitialLoading, setEmployee, updateUser } = authSlice.actions;


export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitialLoading = (state) => state.auth.isInitialLoading;
export const selectEmployee = (state) => state.auth.employeeData;

export default authSlice.reducer;
