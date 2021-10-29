import { Router } from "express";
import TeamController from "../controllers/team.controller";
import { teamRules } from "../rules/team.rules";
import Auth from "../middlewares/Auth";

export const teamRouter = Router();

teamRouter.post("/teams", teamRules["forAddTeam"], Auth.verifyToken, TeamController.AddTeam);
teamRouter.put("/teams/:ID", teamRules["forEditTeam"], Auth.verifyToken, TeamController.EditTeam);
teamRouter.delete("/teams/:ID", Auth.verifyToken, TeamController.RemoveTeam);
teamRouter.get("/teams", Auth.verifyToken, TeamController.GetAllTeams);
teamRouter.get("/teams/:ID", Auth.verifyToken, TeamController.GetTeam);
teamRouter.post("/teams/search", teamRules["forSearchTeam"], TeamController.SearchForTeam);




