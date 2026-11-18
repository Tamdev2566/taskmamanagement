import axios from "axios";

// Using backend direct URL or Vite proxy
const API_BASE = "http://localhost:5000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token if stored
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to automatically handle expired / invalid JWT (401)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized (invalid or expired token)
    if (error?.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/api/auth/login");
      // Don't auto-redirect on wrong credentials during login
      if (!isLoginRequest) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        localStorage.removeItem("employee");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

class ApiService {
  // Auth & Users
  getUsers = async () => {
    try {
      const response = await client.get("/api/users/list");
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  postUsers = async (data) => {
    try {
      const response = await client.post("/api/users/save", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  register = async (data) => {
    try {
      const response = await client.post("/api/auth/register", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  login = async (data) => {
    try {
      const response = await client.post("/api/auth/login", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  getMe = async () => {
    try {
      const response = await client.get("/api/auth/me");
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  verifyAdmin = async (data) => {
    try {
      const response = await client.post("/api/auth/verify-admin", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  updateProfile = async (data) => {
    try {
      const response = await client.post("/api/user/update-profile", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  deleteUser = async (id) => {
    try {
      const response = await client.delete(`/api/users/delete/${id}`);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  // Admin Access Management
  getEmployeesAccess = async (adminEmpId) => {
    try {
      const response = await client.get(
        `/api/admin/employees-access?adminEmpId=${adminEmpId}`,
      );
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  toggleTaskCreation = async (payload) => {
    try {
      const response = await client.post(
        "/api/admin/toggle-task-creation",
        payload,
      );
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  getEligibleAssignees = async (adminEmpId, roleCategory) => {
    try {
      const url = `/api/admin/eligible-assignees?adminEmpId=${adminEmpId || ""}&roleCategory=${roleCategory || ""}`;
      const response = await client.get(url);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  // Tasks
  getTask = async () => {
    try {
      const response = await client.get("/api/tasks/list");
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  postTask = async (data) => {
    try {
      const response = await client.post("/api/tasks/save", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  bulkSaveTasks = async (tasks, userEmpId) => {
    try {
      const response = await client.post("/api/tasks/bulk-save", {
        tasks,
        userEmpId,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  deletTask = async (data) => {
    try {
      const targetId = data?.id !== undefined ? data.id : data;
      const response = await client.delete(`/api/tasks/delete/${targetId}`);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  assignTask = async (data) => {
    try {
      const response = await client.post("/api/tasks/assign", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  // Workflow steps
  startWork = async (taskId, employeeId) => {
    try {
      const response = await client.post("/api/tasks/start-work", {
        taskId,
        employeeId,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  workCompleted = async (taskId, employeeId, remarks, employeeEmail) => {
    try {
      const response = await client.post("/api/tasks/work-completed", {
        taskId,
        employeeId,
        remarks,
        employeeEmail,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  testAssign = async (taskId, testerId, adminEmpId, assignedBy, adminEmail) => {
    try {
      const response = await client.post("/api/tasks/test-assign", {
        taskId,
        testerId,
        adminEmpId,
        assignedBy,
        adminEmail,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  startTesting = async (taskId, testerId) => {
    try {
      const response = await client.post("/api/tasks/start-testing", {
        taskId,
        testerId,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  testingCompleted = async (taskId, testerId, remarks, testerEmail) => {
    try {
      const response = await client.post("/api/tasks/testing-completed", {
        taskId,
        testerId,
        remarks,
        testerEmail,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  markLive = async (taskId, adminEmpId, remarks, deployedBy) => {
    try {
      const response = await client.post("/api/tasks/mark-live", {
        taskId,
        adminEmpId,
        remarks,
        deployedBy,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  // Teams
  getTeam = async (adminEmpId) => {
    try {
      const url = adminEmpId
        ? `/api/teams/list?adminEmpId=${adminEmpId}`
        : "/api/teams/list";
      const response = await client.get(url);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  postTeam = async (data) => {
    try {
      const response = await client.post("/api/teams/save", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  deleteTeam = async (id) => {
    try {
      const response = await client.delete(`/api/teams/delete/${id}`);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  // Status & Tracking
  getStatusList = async (employeeId, userType) => {
    try {
      let url = "/api/status/list";
      const params = new URLSearchParams();
      if (employeeId) params.append("employeeId", employeeId);
      if (userType) params.append("userType", userType);
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      const response = await client.get(url);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  getTrackingList = async (employeeId, userType) => {
    try {
      let url = "/api/status/tracking";
      const params = new URLSearchParams();
      if (employeeId) params.append("employeeId", employeeId);
      if (userType) params.append("userType", userType);
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      const response = await client.get(url);
      return response.data;
    } catch (err) {
      return this.getStatusList(employeeId, userType);
    }
  };

  postStatus = async (data) => {
    try {
      const response = await client.post("/api/status/save", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  startTask = async (taskId, employeeId) => {
    return this.startWork(taskId, employeeId);
  };

  setTaskTime = async (taskId, employeeId, duration) => {
    try {
      const response = await client.post("/api/status/set-time", {
        taskId,
        employeeId,
        duration,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  completeTask = async (taskId, employeeId) => {
    return this.workCompleted(taskId, employeeId);
  };

  logDailyHours = async (taskId, employeeId, todayHours) => {
    try {
      const response = await client.post("/api/status/log-hours", {
        taskId,
        employeeId,
        todayHours,
      });
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  deleteStatus = async (id) => {
    try {
      const response = await client.delete(`/api/status/delete/${id}`);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  // Dashboard Analytics
  getDashboardStats = async () => {
    try {
      const response = await client.get("/api/dashboard/stats");
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  // Calendar
  getEvents = async () => {
    try {
      const response = await client.get("/api/events/list");
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  // Notifications
  getNotifications = async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await client.get(`/api/notifications?${query}`);
      return response.data;
    } catch (err) {
      return [];
    }
  };

  // Password Management
  verifyPassword = async (data) => {
    try {
      const response = await client.post("/api/auth/verify-password", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };

  changePassword = async (data) => {
    try {
      const response = await client.post("/api/auth/change-password", data);
      return response.data;
    } catch (err) {
      throw err?.response?.data || { message: err.message };
    }
  };
}

const apiService = new ApiService();
export default apiService;
