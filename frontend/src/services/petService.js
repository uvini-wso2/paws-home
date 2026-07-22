const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

export const getPets = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
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
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
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
  const response = await fetch(`${API_BASE_URL}/api/pets/mine`, {
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
  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
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