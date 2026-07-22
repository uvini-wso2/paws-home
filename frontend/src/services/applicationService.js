const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

export const createApplication = async (petId, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ petId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit application.");
  }

  return data;
};

export const getMyApplications = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/api/applications/mine`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load applications.");
  }

  return data;
};