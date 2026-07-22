const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://676fd26f-fa41-4a71-bbc4-74d8adabaafb-dev.e1-us-east-azure.choreoapis.dev/paws-and-homes/paws-home-backend/v1.0/api";

export const getPets = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/pets`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Could not load pets. Status: ${response.status}`
    );
  }

  return response.json();
};

export const createPet = async (petData, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(petData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message ||
        `Could not create pet. Status: ${response.status}`
    );
  }

  return responseData;
};

export const getMyPets = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/pets/mine`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const deletePet = async (id, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};