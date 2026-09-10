import Axios from "@/utils/axiosConfig";

/**
 * Fetch dashboard stats with optional filters
 * @param {Object} filters - { hrId, projectId }
 * @returns {Promise}
 */
export const getDashboardStats = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.hrId && filters.hrId !== "all") {
      params.append("hrId", filters.hrId);
    } else {
      params.append("hrId", "all");
    }
    if (filters.projectId && filters.projectId !== "null") {
      params.append("projectId", filters.projectId);
    } else {
      params.append("projectId", "null");
    }
    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    const queryString = params.toString();
    const baseUrl = "/dashboard/stats";
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const response = await Axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch disposition breakdown data with optional filters
 * @param {Object} filters - { hrId, startDate, endDate }
 * @returns {Promise}
 */
export const getDispositionBreakdown = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.hrId && filters.hrId !== "all") {
      params.append("hrId", filters.hrId);
    }

    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }

    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    // ✅ Add pagination
    params.append("page", filters.page || 1);
    params.append("limit", filters.limit || 5);

    const response = await Axios.get(
      `/dashboard/disposition-breakdown?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch Company-Designation Status Report with optional filters
 * @param {Object} filters - { hrId, projectId, startDate, endDate }
 * @returns {Promise}
 */
export const getCompanyDesignationStatusReport = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.hrId && filters.hrId !== "all") {
      params.append("hrId", filters.hrId);
    } else {
      params.append("hrId", "all");
    }

    if (filters.projectId && filters.projectId !== "null") {
      params.append("projectId", filters.projectId);
    } else {
      params.append("projectId", "null");
    }

    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }

    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    if (filters.designation) {
      params.append("designation", filters.designation);
    }
    if (filters.language) {
      params.append("language", filters.language);
    }

    // ✅ Add pagination
    if (filters.page) {
      params.append("page", filters.page);
    }

    if (filters.limit) {
      params.append("limit", filters.limit);
    }

    const response = await Axios.get(
      `/dashboard/company-designation-report?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch Candidate-Detailed Report with optional filters
 * @param {Object} filters - { hrId, projectId, startDate, endDate }
 * @returns {Promise}
 */
export const getCandidateDetailsReport = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.hrId && filters.hrId !== "all") {
      params.append("hrId", filters.hrId);
    } else {
      params.append("hrId", "all");
    }

    if (filters.projectId && filters.projectId !== "null") {
      params.append("projectId", filters.projectId);
    } else {
      params.append("projectId", "null");
    }

    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }

    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    if (filters.designation) {
      params.append("designation", filters.designation);
    }
    if (filters.language) {
      params.append("language", filters.language);
    }

    // ✅ Add these
    if (filters.page) {
      params.append("page", filters.page);
    }

    if (filters.limit) {
      params.append("limit", filters.limit);
    }

    const response = await Axios.get(
      `/dashboard/candidate-details-report?${params.toString()}`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch Candidate-Detailed Report with optional filters
 * @param {Object} filters - { hrId, projectId, startDate, endDate }
 * @returns {Promise}
 */
export const getHrCompanyStatusReport = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.hrId && filters.hrId !== "all") {
      params.append("hrId", filters.hrId);
    } else {
      params.append("hrId", "all");
    }

    if (filters.projectId && filters.projectId !== "null") {
      params.append("projectId", filters.projectId);
    } else {
      params.append("projectId", "null");
    }

    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }

    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    if (filters.designation) {
      params.append("designation", filters.designation);
    }
    if (filters.language) {
      params.append("language", filters.language);
    }

    // Pagination
    if (filters.page) {
      params.append("page", filters.page);
    }

    if (filters.limit) {
      params.append("limit", filters.limit);
    }

    const response = await Axios.get(
      `/dashboard/hr-company-status-report?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Extract unique chart keys from trend data
 * @param {Array} trendData
 * @param {Array} excludeKeys - ['month', 'week']
 * @returns {Array}
 */
export const extractChartKeys = (
  trendData,
  excludeKeys = ["month", "week"],
) => {
  if (!Array.isArray(trendData) || trendData.length === 0) return [];
  return Object.keys(trendData[0]).filter((key) => !excludeKeys.includes(key));
};

/**
 * Professional color palette for chart lines
 */
export const chartColors = [
  "#059669", // emerald-600
  "#0891b2", // cyan-600
  "#7c3aed", // violet-600
  "#dc2626", // red-600
  "#2563eb", // blue-600
  "#9333ea", // purple-600
  "#ea580c", // orange-600
];

export const getChartColor = (index) => {
  return chartColors[index % chartColors.length];
};
