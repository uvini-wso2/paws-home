const PROFILE_URL =
  "https://api.asgardeo.io/t/uvinidev/scim2/Me";

export const getProfile = async (accessToken) => {
  const response = await fetch(PROFILE_URL, {
    method: "GET",
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Could not load profile. Status: ${response.status}`
    );
  }

  return response.json();
};

export const updateProfile = async (
  accessToken,
  formData
) => {
  const patchBody = {
    schemas: [
      "urn:ietf:params:scim:api:messages:2.0:PatchOp",
    ],
    Operations: [
      {
        op: "replace",
        path: "name",
        value: {
          givenName: formData.givenName,
          familyName: formData.familyName,
        },
      },
      {
        op: "replace",
        path: "emails",
        value: [
          {
            value: formData.email,
            type: "work",
            primary: true,
          },
        ],
      },
      {
        op: "replace",
        path: "phoneNumbers",
        value: [
          {
            value: formData.phone,
            type: "mobile",
            primary: true,
          },
        ],
      },
      {
        op: "replace",
        path: "addresses",
        value: [
          {
            formatted: formData.address,
            type: "home",
            primary: true,
          },
        ],
      },
    ],
  };

  const response = await fetch(PROFILE_URL, {
    method: "PATCH",
    headers: {
      Accept: "application/scim+json",
      "Content-Type": "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(patchBody),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Could not update profile. Status: ${response.status}. ${errorText}`
    );
  }

  return response.json().catch(() => null);
};