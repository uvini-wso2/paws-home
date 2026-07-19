import pets from "../data/pets.js";
import { addAuditLog } from "../services/auditService.js";

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

export const createPet = (req, res) => {
  try {
    const { name, species, breed, age } = req.body;

    if (!name || !species || !breed || age === undefined) {
      return res.status(400).json({
        message:
          "Name, species, breed and age are required.",
      });
    }

    const numericAge = Number(age);

    if (
      Number.isNaN(numericAge) ||
      numericAge < 0
    ) {
      return res.status(400).json({
        message: "Age must be a valid positive number.",
      });
    }

    const newPet = {
      id: pets.length
        ? Math.max(...pets.map((pet) => pet.id)) + 1
        : 1,
      name: name.trim(),
      species: species.trim(),
      breed: breed.trim(),
      age: numericAge,
      status: "Available",
      createdBy:
        req.user.username ||
        req.user.email ||
        req.user.sub,
    };

    pets.push(newPet);

    addAuditLog({
      action: `Created pet listing: ${newPet.name}`,
      actor:
        req.user.username ||
        req.user.email ||
        req.user.sub,
      category: "Pet Management",
    });

    return res.status(201).json({
      message: "Pet created successfully.",
      pet: newPet,
    });
  } catch (error) {
    console.error("Create pet error:", error);

    return res.status(500).json({
      message: "Unable to create the pet.",
    });
  }
};

export const getMyPets = (req, res) => {
  const currentUser =
    req.user.username ||
    req.user.email ||
    req.user.sub;

  const myPets = pets.filter(
    (pet) => pet.createdBy === currentUser
  );

  return res.status(200).json(myPets);
};

export const deletePet = (req, res) => {
  const petId = Number(req.params.id);

  const petIndex = pets.findIndex(
    (pet) => pet.id === petId
  );

  if (petIndex === -1) {
    return res.status(404).json({
      message: "Pet not found.",
    });
  }

  const currentUser =
    req.user.username ||
    req.user.email ||
    req.user.sub;

  if (pets[petIndex].createdBy !== currentUser) {
    return res.status(403).json({
      message:
        "Access denied. You can only delete pets you created.",
    });
  }

  const deletedPet = pets.splice(petIndex, 1)[0];

  addAuditLog({
    action: `Deleted pet listing: ${deletedPet.name}`,
    actor:
      req.user.username ||
      req.user.email ||
      req.user.sub,
    category: "Pet Management",
  });

  return res.status(200).json({
    message: "Pet deleted successfully.",
    pet: deletedPet,
  });
};