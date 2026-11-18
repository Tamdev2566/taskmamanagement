import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./globalData/store";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Task from "./components/Task";
import Team from "./components/Team";
import TaskStatus from "./components/TaskStatus";
import Login from "./Login";
import Signup from "./Signup";
import DashboardCalendar from "./components/DashboardCalender";
import { useEffect } from "react";
import { setInitialLoading } from "./globalData/authSlice";
import Loader from "./components/widgets/Loader";
import { CreateTask } from "./components/CreateTask";
import TrackingStatus from "./components/TrackingStatus";
import DailyTracker from "./components/DailyTracker";
import TaskCreationAccess from "./components/TaskCreationAccess";
import NotFound from "./components/widgets/NotFound.js";
import { ThemeModeProvider } from "./theme/ThemeContext";

const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isInitialLoading = useSelector((state) => state.auth.isInitialLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && isInitialLoading) {
      const timer = setTimeout(() => {
        dispatch(setInitialLoading(false));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isInitialLoading, dispatch]);

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  if (isInitialLoading) return <Loader />;

  return children;
};

const routes = [
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "task", element: <Task /> },
      { path: "createtask", element: <CreateTask /> },
      { path: "team", element: <Team /> },
      { path: "task-creation-access", element: <TaskCreationAccess /> },
      { path: "status", element: <TaskStatus /> },
      { path: "calender", element: <DashboardCalendar /> },
      { path: "calendar", element: <DashboardCalendar /> },
      { path: "tracking", element: <TrackingStatus /> },
      { path: "daily-tarcker", element: <DailyTracker /> },
      { path: "daily-tracker", element: <DailyTracker /> },
      { path: "*", element: <NotFound /> }, 
    ],
  },
  { path: "*", element: <NotFound /> },
];

const AppRoutes = () => {
  const router = createBrowserRouter(routes);
  return (
    <ThemeModeProvider>
      <RouterProvider router={router} />
    </ThemeModeProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);

export default App;
