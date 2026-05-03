import express from "express";
import {
  createCalcado,
  deleteCalcado,
  readAllCalcados,
  readCalcadosByMarca,
  readCalcadosByTamanho,
  readTotalParesEmEstoque,
  updateCalcado,
} from "./controllers/CalcadoController";
import { readAllUsers } from "./controllers/UserController";


const routes = express.Router();

routes.get("/users", readAllUsers);

routes.post("/calcados", createCalcado);
routes.get("/calcados", readAllCalcados);
routes.patch("/calcados/:id", updateCalcado);
routes.delete("/calcados/:id", deleteCalcado);

routes.get("/calcados/tamanho/:tamanho", readCalcadosByTamanho);
routes.get("/calcados/marca/:marca", readCalcadosByMarca);
routes.get("/calcados/estoque/total", readTotalParesEmEstoque);


export default routes;
