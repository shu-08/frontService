const API_BASE_URL = "https://your-backend.onrender.com"; // RenderのFlask URL

export const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/data`);
  return response.json();
};