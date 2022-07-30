import exercises from "./exercises";

if (!process.env.exercise)
  throw new Error("please specify which exercise you want to execute");

const exerciseToDo = process.env.exercise;

const functionToExecute = exercises.find((e) => e.name === exerciseToDo);

if (!functionToExecute) throw new Error("exercise not found");

functionToExecute();
