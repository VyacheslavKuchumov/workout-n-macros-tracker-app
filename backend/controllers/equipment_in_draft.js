const { draft } = require("../models/drafts");
const { equipment } = require("../models/equipment");
const { warehouse } = require("../models/warehouses");
const { equipment_set } = require("../models/equipment_sets");
const { set_type } = require("../models/set_types");
const { Op } = require("sequelize");

const getAllDataHelper = async (id) => {
    const drft = await draft.findOne({
        where: { draft_id: id },
        include: [
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

    const equipmentIdsInDraft = drft.equipment.map((e) => e.equipment_id);
    const equipment_in_draft = await equipment.findAll({
        where: {
            equipment_id: {
                [Op.in]: equipmentIdsInDraft,
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

    const available_equipment = await equipment.findAll({
        where: {
            equipment_id: {
                [Op.notIn]: equipmentIdsInDraft,
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

    const setsInDraft = await equipment_set.findAll({
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

    return { draft: drft, equipment_in_draft, available_equipment, sets_in_draft: setsInDraft };
};

const getEquipmentInDraft = async (req, res) => {
    try {
        const foundDraft = await getAllDataHelper(req.params.id);
        return res.status(200).send(foundDraft);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const addEquipmentToDraft = async (req, res) => {
    try {
        const { draft_id, equipment_id, equipment_set_id } = req.body;
        const foundDraft = await draft.findByPk(draft_id);
        const foundEquipment = await equipment.findByPk(equipment_id);

        await foundDraft.addEquipment(foundEquipment);
        const drft = await getAllDataHelper(draft_id);

        const bruhDraft = await draft.findOne({
            where: { draft_id: draft_id },
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
                }
            ]
        });

        const equipmentIdsInDraft = bruhDraft.equipment.map((e) => e.equipment_id);

        const equip = async () => {
            const foundSet = await equipment_set.findByPk(equipment_set_id);
            const foundEquipment = await equipment.findAll({
                where: {
                    equipment_set_id: foundSet.equipment_set_id,
                    equipment_id: {
                        [Op.notIn]: equipmentIdsInDraft,
                    }
                },
            });

            return foundEquipment;
        };

        setTimeout(async () => {
            const data = { draft: drft, equipment: await equip() };
            return res.status(200).send(data);
        }, 500);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const removeEquipmentFromDraft = async (req, res) => {
    try {
        const { draft_id, equipment_id } = req.body;
        const foundDraft = await draft.findByPk(draft_id);
        const foundEquipment = await equipment.findByPk(equipment_id);

        await foundDraft.removeEquipment(foundEquipment);
        const data = await getAllDataHelper(draft_id);
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const addSetToDraft = async (req, res) => {
    try {
        const { draft_id, equipment_set_id } = req.body;

        const foundDraft = await draft.findByPk(draft_id);
        const foundEquipment = await equipment.findAll({ where: { equipment_set_id: equipment_set_id } });
        foundEquipment.forEach(async (element) => {
            await foundDraft.addEquipment(element);
        });
        setTimeout(async () => {
            const data = await getAllDataHelper(draft_id);
            return res.status(200).send(data);
        }, 500);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const removeSetFromDraft = async (req, res) => {
    try {
        const { draft_id, equipment_set_name } = req.body;
        const foundDraft = await draft.findByPk(draft_id);
        const foundSet = await equipment_set.findOne({ where: { equipment_set_name: equipment_set_name } });
        const foundEquipment = await equipment.findAll({ where: { equipment_set_id: foundSet.equipment_set_id } });
        foundEquipment.forEach(async (element) => {
            await foundDraft.removeEquipment(element);
        });
        setTimeout(async () => {
            const data = await getAllDataHelper(draft_id);
            return res.status(200).send(data);
        }, 500);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const getAvailableEquipmentInSet = async (req, res) => {
    try {
        const { draft_id, equipment_set_id } = req.body;
        const foundSet = await equipment_set.findByPk(equipment_set_id);
        const bruhDraft = await draft.findOne({
            where: { draft_id: draft_id },
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
                }
            ]
        });

        const equipmentIdsInDraft = bruhDraft.equipment.map((e) => e.equipment_id);
        const foundEquipment = await equipment.findAll({
            where: {
                equipment_set_id: foundSet.equipment_set_id,
                equipment_id: {
                    [Op.notIn]: equipmentIdsInDraft,
                }
            }
        });

        return res.status(200).send(foundEquipment);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};



module.exports = {
    getEquipmentInDraft,
    addEquipmentToDraft,
    removeEquipmentFromDraft,
    removeSetFromDraft,
    addSetToDraft,
    getAvailableEquipmentInSet,
};
