const express = require("express");
const app = express();
require("dotenv").config();
let cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

const auth_routes = require("./routes/auth");
const users_routes = require("./routes/users");
const equipment_routes = require("./routes/equipment");
const warehouses_routes = require("./routes/warehouses");
const equipment_sets_routes = require("./routes/equipment_sets");
const project_routes = require("./routes/projects");
const project_types_routes = require("./routes/project_types");
const set_types_routes = require("./routes/set_types");
const equipment_in_project_routes = require("./routes/equipment_in_project");
const draft_routes = require("./routes/drafts");
const equipment_in_draft_routes = require("./routes/equipment_in_draft");

const excel_controller_routes = require("./routes/excel_controller");
const neaktor_routes = require("./routes/neaktor");

app.use(
  cors({
    origin: ["http://localhost:8080", "http://192.168.50.21:8080"],
  }),
);

app.use("/api/auth", auth_routes);
app.use("/api/users", users_routes);
app.use("/api/equipment", equipment_routes);
app.use("/api/warehouse", warehouses_routes);
app.use("/api/equipment_set", equipment_sets_routes);
app.use("/api/set_types", set_types_routes);
app.use("/api/projects", project_routes);
app.use("/api/project_types", project_types_routes);
app.use("/api/equipment_in_project", equipment_in_project_routes);
app.use("/api/drafts", draft_routes);
app.use("/api/equipment_in_draft", equipment_in_draft_routes);

app.use("/api/admin/excel", excel_controller_routes);
app.use("/api/neaktor", neaktor_routes);


app.use((error, request, response, next) => {
  if (error instanceof SyntaxError)
    response.status(400).send({ message: "not valid data" });
  else next();
});

const { initializeDatabase } = require("./models/index");

app.listen(port, () => {
  //###############################
  // initializeDatabase();
  //###############################
  console.log(`server started on port ${port}`);
});
