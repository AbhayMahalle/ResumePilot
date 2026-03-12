const API_URL = "http://localhost:5000/api";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {};

    // Do not set Content-Type if it's FormData, the browser handles the boundary
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "An API error occurred");
    }

    return data;
  }

  // Authentication endpoints
  auth = {
    login: (credentials: any) =>
      this.fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (userData: any) =>
      this.fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    getProfile: () => this.fetchAPI("/auth/profile", { method: "GET" }),
  };

  // Resume endpoints
  resumes = {
    getAll: () => this.fetchAPI("/resumes", { method: "GET" }),
    getById: (id: string) => this.fetchAPI(`/resumes/${id}`, { method: "GET" }),
    delete: (id: string) => this.fetchAPI(`/resumes/${id}`, { method: "DELETE" }),
    download: async (id: string) => {
      const response = await fetch(`${API_URL}/resumes/${id}/download`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (!response.ok) throw new Error("Failed to download PDF");
      return await response.blob();
    },
    uploadAndAnalyze: (formData: FormData) =>
      this.fetchAPI("/resumes/analyze", {
        method: "POST",
        body: formData, // the browser will automatically pick the right multipart/form-data boundary
      }),
  };
}

export const api = new ApiClient();
