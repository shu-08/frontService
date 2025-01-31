const API_BASE_URL = "https://your-backend.onrender.com"; // RenderのFlask URL

export const fetchData = async () => {
  const response = await fetch("https://backservice-oqui.onrender.com");
  return response.json();
};
