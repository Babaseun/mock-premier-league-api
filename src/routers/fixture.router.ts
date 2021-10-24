import { Router } from "express";
import FixtureController from "../controllers/fixture.controller";
import { fixtureRules } from "../rules/fixture.rules";
import Auth from "../middlewares/Auth";

export const fixtureRouter = Router();

fixtureRouter.post("/fixtures", fixtureRules["forAddFixture"], Auth.verifyToken, FixtureController.AddFixture);
fixtureRouter.put("/fixtures/:ID", fixtureRules["forEditFixture"], Auth.verifyToken, FixtureController.EditFixture);
fixtureRouter.delete("/fixtures/:ID", Auth.verifyToken, FixtureController.RemoveFixture);
fixtureRouter.get("/fixtures", Auth.verifyToken, FixtureController.GetAllFixtures);
fixtureRouter.get("/fixture/completed", Auth.verifyToken, FixtureController.GetCompletedFixtures);
fixtureRouter.get("/fixture/pending", Auth.verifyToken, FixtureController.GetPendingFixtures);
fixtureRouter.post("/fixture/search", FixtureController.SearchFixtures);
fixtureRouter.get("/fixture/:ID", Auth.verifyToken, FixtureController.GetFixture);



