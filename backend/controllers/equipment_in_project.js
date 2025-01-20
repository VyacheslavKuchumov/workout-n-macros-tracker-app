const { project } = require("../models/projects");
const { equipment } = require("../models/equipment");
const { warehouse } = require("../models/warehouses");
const { equipment_set } = require("../models/equipment_sets");
const { set_type } = require("../models/set_types");
const { draft } = require("../models/drafts");
const { Op } = require("sequelize");


const getAllDataHelper = async (id) => {
    const proj = await project.findOne({
        where: {project_id: id},
        include:[
            {
                model: equipment,
                include: [
                {
                    model: equipment_set,
                    as: "equipment_set",
                    attributes: ["equipment_set_name", "description"],
                },
                ],
            }
        ]
        
      });
    const equipmentIdsInProject = proj.equipment.map((e) => e.equipment_id);
    const equipment_in_project = await equipment.findAll({
        where: {equipment_id: {
              [Op.in]: equipmentIdsInProject, // Sequelize operator for exclusion
          },
        },
        include: [
      {
        model: equipment_set,
        as: "equipment_set",
        attributes: ["equipment_set_name", "description"],

        include: [
          {
            model: set_type,
            as: "type",
          },
        ],
      },
      {
        model: warehouse,
        as: "storage",
        attributes: ["warehouse_name"],
      },

    ],
    });
    
    
    
    

    // Retrieve all available equipment excluding those in the project
    const available_equipment = await equipment.findAll({
      where: {
          equipment_id: {
              [Op.notIn]: equipmentIdsInProject, // Sequelize operator for exclusion
          },
      },
      include: [
      {
        model: equipment_set,
        as: "equipment_set",
        attributes: ["equipment_set_name"],

        include: [
          {
            model: set_type,
            as: "type",
          },
        ],
      },
      {
        model: warehouse,
        as: "storage",
        attributes: ["warehouse_name"],
      },

    ],
    });

    const uniqueSetNames = [...new Set(available_equipment.map(eq => eq.equipment_set.equipment_set_name))];

    const setsInProject = await equipment_set.findAll({
      where: {
        equipment_set_name: {
          [Op.in]: uniqueSetNames
        }
      },
      include: [
        {
          model: set_type,
          as: "type",
        },
      ],
    });
    return {project:proj, equipment_in_project, available_equipment, sets_in_project: setsInProject}
  }


const resetEquipmentInProject = async (req, res) => {
  try {
    const project_id  = req.params.id;
    const foundProject = await project.findByPk(project_id);
    foundProject.setEquipment([]);
    return res.status(200).send({message: "Equipment in project reset"});
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

const addDraftToProject = async (req, res) => {
  try {
    const { project_id, draft_id } = req.body;

    const foundProject = await project.findByPk(project_id);
    const foundDraft = await draft.findByPk(draft_id);
    if (!foundProject) {
      return res.status(404).json({ message: "Project not found." });
    }
    if (!foundDraft) {
      return res.status(404).json({ message: "Draft not found." });
    }

    // Retrieve equipment associated with the draft
    const draftEquipment = await foundDraft.getEquipment();
    for (const equip of draftEquipment) {
      await foundProject.addEquipment(equip);
    }
    // Associate each equipment with the project
    

    return res.status(200).json({ 
      message: "Draft equipment successfully added to the project.",
      equipmentAdded: draftEquipment
    });
  } catch (error) {
    console.error("Error adding draft to project:", error);
    return res.status(500).json({ message: "Internal server error.", error });
  }
};


const getEquipmentInProject = async (req, res) => {
    try {
      
  
      const foundProject = await getAllDataHelper(req.params.id)


      return res.status(200).send(foundProject);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

const addEquipmentToProject = async (req, res) => {
    try {
      const { project_id, equipment_id, equipment_set_id } = req.body;
  
      const foundProject = await project.findByPk(project_id);
      const foundEquipment = await equipment.findByPk(equipment_id);
  
      await foundProject.addEquipment(foundEquipment);
      const proj = await getAllDataHelper(project_id)

      const bruhProj = await project.findOne({
        where: {project_id: project_id},
        include:[
            {
                model: equipment,
                include: [
                {
                    model: equipment_set,
                    as: "equipment_set",
                    attributes: ["equipment_set_name"],
                },
                ],
            }
        ]
        
      });
    const equipmentIdsInProject = bruhProj.equipment.map((e) => e.equipment_id);

      const equip = async () => {
        const foundSet = await equipment_set.findByPk(equipment_set_id);
        const foundEquipment = await equipment.findAll({where: {equipment_set_id: foundSet.equipment_set_id,
        equipment_id: {
            [Op.notIn]: equipmentIdsInProject,} // Sequelize operator for inclusion
        },});

        return foundEquipment;
      }
      setTimeout(async () => {
        data = {project: proj, equipment: await equip()}
        return res.status(200).send(data);
      }
      , 500);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};
  
  const removeEquipmentFromProject = async (req, res) => {
    try {
      const { project_id, equipment_id } = req.body;
      const foundProject = await project.findByPk(project_id);
      const foundEquipment = await equipment.findByPk(equipment_id);
  
      await foundProject.removeEquipment(foundEquipment);
      const data = await getAllDataHelper(project_id)
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

const addSetToProject = async (req, res) => {
  try {
    const { project_id, equipment_set_id } = req.body;

    const foundProject = await project.findByPk(project_id);
    const foundEquipment = await equipment.findAll({where: {equipment_set_id: equipment_set_id}});
    foundEquipment.forEach(async (element) => {
      await foundProject.addEquipment(element);
    });
    setTimeout(async () => {
      console.log("done");
      const data = await getAllDataHelper(project_id)
      return res.status(200).send(data);
    }, 500);
    
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const removeSetFromProject = async (req, res) => {
  try {
    const { project_id, equipment_set_name} = req.body;
    const foundProject = await project.findByPk(project_id);
    const foundSet = await equipment_set.findOne({ where: {equipment_set_name: equipment_set_name}});
    const foundEquipment = await equipment.findAll({where: {equipment_set_id: foundSet.equipment_set_id}});
    foundEquipment.forEach(async (element) => {
      await foundProject.removeEquipment(element);
    });
    setTimeout(async () => {
      console.log("done");
      const data = await getAllDataHelper(project_id)
    
      return res.status(200).send(data);
    }, 500);
    
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAvailableEquipmentInSet = async (req, res) => {
  try {
    const {project_id, equipment_set_id}  = req.body;
    console.error(req.body);
    const foundSet = await equipment_set.findByPk(equipment_set_id);
    const bruhProj = await project.findOne({
      where: {project_id: project_id},
      include:[
          {
              model: equipment,
              include: [
              {
                  model: equipment_set,
                  as: "equipment_set",
                  attributes: ["equipment_set_name"],
              },
              ],
          }
      ]
      
    });
    const equipmentIdsInProject = bruhProj.equipment.map((e) => e.equipment_id);
    const foundEquipment = await equipment.findAll({where: {equipment_set_id: foundSet.equipment_set_id,
      equipment_id: {
            [Op.notIn]: equipmentIdsInProject,}
          }
        });
    return res.status(200).send(foundEquipment);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}



const getConflictingEquipment = async (req, res) => {
  try {
    const { project_id } = req.body;
    console.log(project_id)
    // Retrieve the requested project's details, including equipment
    const proj = await project.findOne({
      where: { project_id: project_id },
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

    if (!proj) {
      return res.status(404).send({ message: "Project not found" });
    }

    const start_date = proj.shooting_start_date;
    const end_date = proj.shooting_end_date;

    // Extract equipment IDs for the current project
    const equipmentIdsInProject = proj.equipment.map((e) => e.equipment_id);

    // Find conflicting projects with overlapping shooting dates
    const conflictingProjects = await project.findAll({
      where: {
        project_id: { [Op.ne]: project_id }, // Exclude the current project
        [Op.or]: [
          {
            shooting_start_date: {
              [Op.between]: [start_date, end_date], // Start date overlaps
            },
          },
          {
            shooting_end_date: {
              [Op.between]: [start_date, end_date], // End date overlaps
            },
          },
          {
            [Op.and]: [
              { shooting_start_date: { [Op.lte]: start_date } }, // Enclosing range
              { shooting_end_date: { [Op.gte]: end_date } },
            ],
          },
        ],
      },
      include: [
        {
          model: equipment,
          include: [
            {
              model: equipment_set,
              as: "equipment_set",
              attributes: ["equipment_set_name"],
              include: [
                {
                  model: set_type,
                  as: "type",
                },
              ],
            },
            {
              model: warehouse,
              as: "storage",
              attributes: ["warehouse_name"],
            },
          ],
        },
      ],
    });

    // Extract conflicting equipment details
    const conflictingEquipment = [];
    conflictingProjects.forEach((conflictingProj) => {
      conflictingProj.equipment.forEach((equip) => {
        
          conflictingEquipment.push({
            project_id: conflictingProj.project_id,
            project_name: conflictingProj.project_name,
            equipment_id: equip.equipment_id,
            equipment_name: equip.equipment_name,
            equipment_set_name: equip.equipment_set.equipment_set_name,
            warehouse_name: equip.storage.warehouse_name,
          });
        
      });
    });

    // Send response
    return res.status(200).send(conflictingEquipment);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
};


module.exports = {
    getEquipmentInProject,
    addEquipmentToProject,
    removeEquipmentFromProject,
    removeSetFromProject,
    addSetToProject,
    getAvailableEquipmentInSet,
    getConflictingEquipment,
    resetEquipmentInProject,
    addDraftToProject
};
  