const { draft } = require("../models/drafts");
const { equipment } = require("../models/equipment");
const { equipment_set } = require("../models/equipment_sets");






const getAllDataHelper = () => {
  return draft.findAll({
    include: [

        {
            model: equipment,
            include: [
              {
                model: equipment_set,
                as: "equipment_set",
                attributes: ["equipment_set_name"],
              },
            ],
          },
    ],
    order: [["draft_name", "DESC"]],
  })
}

// Function to get all drafts
const getAllDrafts = async (req, res) => {
    try {
      const data = await getAllDataHelper();
  
      if (!data) {
        return res.status(404).send({ message: "No drafts found" });
      }
  
      return res.json(data);
    } catch (error) {
      console.error("Error fetching drafts:", error);
      return res.status(500).send({ message: error.message });
    }
  };
  
  // Function to get a draft by ID
  const getDraftById = async (req, res) => {
    try {
      const data = await draft.findOne({
        where: { draft_id: req.params.id },
        include: [
          {
            model: equipment,
            include: [
              {
                model: equipment_set,
                as: "equipment_set",
                attributes: ["equipment_set_name"],
              },
            ],
          },
        ],
      });
  
      if (!data) return res.status(404).send({ message: "Draft not found" });
      return res.json(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
  
  // Function to create a new draft
  const createDraft = async (req, res) => {
    try {
      const { draft_name} = req.body;
  
      const newDraft = await draft.create({
        draft_name,

      });
  
      const data = await getAllDataHelper();
  
      return res.status(201).send(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
  
  // Function to edit a draft by ID
  const editDraftById = async (req, res) => {
    try {
      const id = req.params.id;
      const { draft_name, equipment_id, equipment_set_id } = req.body;
  
      const draftToUpdate = await draft.findByPk(id);
  
      if (!draftToUpdate)
        return res.status(404).send({ message: "Draft not found" });
  
      await draftToUpdate.update({
        draft_name,
        equipment_id,
        equipment_set_id,
      });
  
      const data = await getAllDataHelper();
  
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
  
  // Function to delete a draft by ID
  const deleteDraftById = async (req, res) => {
    try {
      const id = req.params.id;
      const draftToDelete = await draft.findByPk(id);
  
      if (!draftToDelete)
        return res.status(404).send({ message: "Draft not found" });
  
      await draftToDelete.destroy();
  
      const data = await getAllDataHelper();
  
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };
  
  // Exporting the functions
  module.exports = {
    getAllDrafts,
    getDraftById,
    createDraft,
    editDraftById,
    deleteDraftById,
  };