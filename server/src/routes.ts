import express from "express";
import {  readAllUsers } from "./controllers/UserController";


const routes = express.Router();

routes.get("/users", readAllUsers);


export default routes;
