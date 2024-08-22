import express from "express";
import { RbacController } from "../../controllers/rbac.controller";
import { grantAccess } from "../../middlewares/rbac.middleware";
import { authen } from "../../middlewares/auth.middleware";

const rbacRouter = express.Router();

rbacRouter.get("/get-role-user", RbacController.getRoleUser);

rbacRouter.use(authen);
rbacRouter.post("/create-role", RbacController.createRole);
rbacRouter.post("/create-resource", RbacController.createResource);

rbacRouter.get("/list-role", RbacController.roleList);
rbacRouter.get("/list-resource", RbacController.resourceList);

export default rbacRouter;