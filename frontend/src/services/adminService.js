const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://676fd26f-fa41-4a71-bbc4-74d8adabaafb-dev.e1-us-east-azure.choreoapis.dev/paws-and-homes/paws-home-backend/v1.0/api";
  
export const getUsers = async (accessToken) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/users`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getAuditLogs = async (accessToken) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/audit`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};