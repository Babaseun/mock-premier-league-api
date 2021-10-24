import { check } from "express-validator";
import moment from "moment/moment";

export const fixtureRules = {
	forAddFixture: [
		check("homeTeam").not().isEmpty().withMessage("homeTeam field is required"),
		check("awayTeam").not().isEmpty().withMessage("awayTeam field is required"),
		check("matchInformation").not().isEmpty().withMessage("matchInformation field is required"),
		check("kickoff").custom((kickoff) => {
			if (!moment(kickoff).isValid()) throw new Error("kickoff date provided is invalid");
			if (!moment(kickoff).isAfter(new Date())) throw new Error("kickoff time needs to be in the future");
			return true;
		}),
	],
	forEditFixture: [
		check("homeTeam").not().isEmpty().withMessage("homeTeam field is required"),
		check("awayTeam").not().isEmpty().withMessage("awayTeam field is required"),
		check("matchInformation").not().isEmpty().withMessage("matchInformation field is required"),
		check("kickoff").custom((kickoff) => {
			if (!moment(kickoff).isValid()) throw new Error("kickoff date provided is invalid");
			if (!moment(kickoff).isAfter(new Date())) throw new Error("kickoff time needs to be in the future");
			return true;
		}),
	],
};