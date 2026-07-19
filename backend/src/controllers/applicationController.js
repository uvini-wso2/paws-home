import { applications } from "../data/applications.js";
import pets  from "../data/pets.js";
import { addAuditLog } from "../services/auditService.js";

export const createApplication = (req, res) => {
  const { petId } = req.body;

  const pet = pets.find(
    (item) => item.id === Number(petId)
  );

  if (!pet) {
    return res.status(404).json({
      message: "Pet not found.",
    });
  }

  const existing = applications.find(
    (application) =>
      application.petId === Number(petId) &&
      application.userId === req.user.sub
  );

  if (existing) {
    return res.status(400).json({
      message:
        "You have already applied for this pet.",
    });
  }

  const application = {
    id: applications.length + 1,
    petId: pet.id,
    petName: pet.name,
    breed: pet.breed,
    species: pet.species,
    status: "Pending",
    appliedDate: new Date().toLocaleDateString(),
    userId: req.user.sub,
  };

  applications.push(application);

  addAuditLog({
    action: `Applied to adopt ${pet.name}`,
    actor: req.user.username || req.user.sub,
    category: "Adoption",
  });

  res.status(201).json({
    message: "Application submitted successfully.",
    application,
  });
};

export const getMyApplications = (req, res) => {
  const myApplications = applications.filter(
    (application) =>
      application.userId === req.user.sub
  );

  res.json(myApplications);
};