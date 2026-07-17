import pets from "../data/pets.js";

export const getAllPets = (req, res) => {
    try {
        res.status(200).json(pets);
    }catch (error) {
        console.error("Failed to retrieve pets:", error);

        res.status(500).json({
            message: "Unable to retriev pets.",
        });
    }
};