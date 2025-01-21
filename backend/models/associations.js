const { Auth } = require("./auths");
const { User } = require("./users");
const { UserInfo } = require("./user_info");
const { Workout } = require("./workouts");
const { Exercise } = require("./exercises");
const { ExercisesInWorkout } = require("./exercises_in_workout");


// User and Auth
User.belongsTo(Auth, {
  targetKey: "auth_uid",
  foreignKey: "user_uid",
  as: "auth",
});

// User has one User_info
User.hasOne(UserInfo, {
  sourceKey: "user_uid", // The key in the User model
  foreignKey: "user_uid", // The foreign key in the User_info model
  onDelete: 'CASCADE', // Ensures cascading delete
});

// User_info belongs to User
UserInfo.belongsTo(User, {
  targetKey: "user_uid", // The key in the User model being referenced
  foreignKey: "user_uid", // The foreign key in the User_info model
  onDelete: 'CASCADE',
});

// Workout has many ExercisesInWorkout
Workout.hasMany(ExercisesInWorkout, { foreignKey: 'workout_id', onDelete: 'CASCADE' });
ExercisesInWorkout.belongsTo(Workout, { foreignKey: 'workout_id' });

// Exercise has many ExercisesInWorkout
Exercise.hasMany(ExercisesInWorkout, { foreignKey: 'exercise_id', onDelete: 'CASCADE' });
ExercisesInWorkout.belongsTo(Exercise, { foreignKey: 'exercise_id' });

