export const updateApplicationStatus = async (id, status, token) => {
  const response = await fetch(
    `http://localhost:3002/api/applications/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update status");
  }

  return response.json();
};