const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://676fd26f-fa41-4a71-bbc4-74d8adabaafb-dev.e1-us-east-azure.choreoapis.dev/paws-and-homes/paws-home-backend/v1.0/api";

export const createApplication = async (petId, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/applications`, {
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
  const response = await fetch(`${API_BASE_URL}/applications/mine`, {
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