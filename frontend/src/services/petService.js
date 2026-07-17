const PETS_API_URL = "http://localhost:3002/pets";

export const getPets = async () => {
    const response = await fetch(PETS_API_URL, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(
            'Could not load pets. Status : ${response.status}'
        );
    }

    return response.json();
}