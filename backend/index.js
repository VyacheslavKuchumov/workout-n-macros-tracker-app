const express = require("express");
const app = express();
require("dotenv").config();
let cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

const auth_routes = require("./routes/auth");
const users_routes = require("./routes/users");


app.use(
  cors({
    origin: ["http://localhost:8080", "http://45.43.88.192"],
  }),
);

app.use("/api/auth", auth_routes);
app.use("/api/users", users_routes);



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
