const { project } = require("../models/projects");
const { equipment } = require("../models/equipment");
const { equipment_set } = require("../models/equipment_sets");

const { project_type } = require("../models/project_types");
const { user } = require("../models/users");
const { auth } = require("../models/auths");

function convertToISODate(russianDateTime) {
    // Step 1: Split the Russian date string into day, month, year
    const [datePart] = russianDateTime.split(' ');
    const [day, month, year] = datePart.split('-');
    
    // Step 2: Create the ISO date format
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    // Step 3: Return the ISO formatted date
    return isoDate;
}

const neaktorCreateProject = async (req, res) => {
  try {
    const {
      project_id,
      project_name,
      project_type_name,
      chief_engineer_email,
      shooting_start_date,
      shooting_end_date,
    } = req.body;

    const foundProjectType = await project_type.findOne({
      where: { project_type_name: project_type_name },
    });
    
    const foundAuth = await auth.findOne({
      where: { email: chief_engineer_email },
    });

    const foundUser = await user.findOne({
        where: { user_uid: foundAuth.auth_uid },
        });

    if (foundProjectType && foundAuth && project_id) {
      const newProject = await project.create({
        neaktor_id: project_id,
        project_name,
        archived: false,
        project_type_id: foundProjectType.project_type_id, // Associate with the project type ID
        shooting_start_date: convertToISODate(shooting_start_date),
        shooting_end_date: convertToISODate(shooting_end_date),
        chief_engineer_id: foundUser.id,
      });

      return res.status(201).send({message: "Съёмка создана успешно!", newProject});
    } else {
      return res
        .status(500)
        .send({ message: "Ошибка. Такой площадки (project_type) или пользователя не существует" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const neaktorDeleteProject = async (req, res) => {
  try {
    const { project_id } = req.body;

    const foundProject = await project.findOne({
      where: { neaktor_id: project_id },
    });

    if (foundProject) {
      await project.destroy({
        where: { neaktor_id: project_id },
      });

      return res.status(200).send({ message: "Съёмка удалена успешно!" });
    } else {
      return res.status(404).send({ message: "Съёмка не найдена" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


const neaktorEditProject = async (req, res) => {
  try {
    const {
      project_id,
      project_name,
      project_type_name,
      chief_engineer_email,
      shooting_start_date,
      shooting_end_date,
    } = req.body;

    const foundProject = await project.findOne({
      where: { neaktor_id: project_id },
    });

    if (foundProject) {
      const foundProjectType = await project_type.findOne({
        where: { project_type_name: project_type_name },
      });

      const foundAuth = await auth.findOne({
        where: { email: chief_engineer_email },
      });

      const foundUser = await user.findOne({
        where: { user_uid: foundAuth.auth_uid },
      });

      if (foundProjectType && foundAuth) {
        await project.update(
          {
            project_name,
            project_type_id: foundProjectType.project_type_id,
            shooting_start_date: convertToISODate(shooting_start_date),
            shooting_end_date: convertToISODate(shooting_end_date),
            chief_engineer_id: foundUser.id,
          },
          {
            where: { neaktor_id: project_id },
          },
        );

        return res.status(200).send({ message: "Съёмка изменена успешно!" });
      } else {
        return res
          .status(500)
          .send({ message: "Ошибка. Такой площадки (project_type) или пользователя не существует" });
      }
    } else {
      return res.status(404).send({ message: "Съёмка не найдена" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

const neaktorArchiveProject = async (req, res) => {
  try {
    const { project_id } = req.body;

    const foundProject = await project.findOne({
      where: { neaktor_id: project_id },
    });

    if (foundProject) {
      await project.update(
        {
          archived: true,
        },
        {
          where: { neaktor_id: project_id },
        },
      );

      return res.status(200).send({ message: "Съёмка архивирована успешно!" });
    } else {
      return res.status(404).send({ message: "Съёмка не найдена" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};




module.exports = {
    neaktorCreateProject,
    neaktorDeleteProject,
    neaktorEditProject,
    neaktorArchiveProject
  };