import express from "express";
import apiRouter from "./api";

const mainRouter = express.Router();


// mainRouter.get("/", (req, res) => {
//     res.send("Hello World");
// });

mainRouter.use(`/api/v1`, apiRouter);

export default mainRouter;