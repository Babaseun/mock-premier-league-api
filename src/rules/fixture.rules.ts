import { check } from "express-validator";
import moment from "moment/moment";

export const fixtureRules = {
	forAddFixture: [
		check("homeTeam").not().isEmpty().withMessage("homeTeam field is required"),
		check("awayTeam").not().isEmpty().withMessage("awayTeam field is required"),
		check("homeTeam_score").optional().isNumeric().withMessage("homeTeam_score must be a number"),
		check("awayTeam_score").optional().isNumeric().withMessage("awayTeam_score must be a number"),
		check("status").optional().not().isEmpty().withMessage("awayTeam_score must be a number"),
		check("kickoff").not().isEmpty().withMessage("kickoff field is required").custom((kickoff) => {
			if (!moment(kickoff).isValid()) throw new Error("kickoff date provided is invalid");
			if (!moment(kickoff).isAfter(new Date())) throw new Error("kickoff time needs to be in the future");
			return true;
		}),
		check("stadium").not().isEmpty().withMessage("stadium field is required"),
	],
	forEditFixture: [
		check("homeTeam").optional().not().isEmpty().withMessage("homeTeam field is required"),
		check("awayTeam").optional().not().isEmpty().withMessage("awayTeam field is required"),
		check("homeTeam_score").optional().isNumeric().withMessage("homeTeam_score must be a number"),
		check("awayTeam_score").optional().isNumeric().withMessage("awayTeam_score must be a number"),
		check("kickoff").optional().not().isEmpty().withMessage("kickoff field is required").custom((kickoff) => {
			if (!moment(kickoff).isValid()) throw new Error("kickoff date provided is invalid");
			if (!moment(kickoff).isAfter(new Date())) throw new Error("kickoff time needs to be in the future");
			return true;
		}),
		check("stadium").optional().not().isEmpty().withMessage("stadium field is required"),
		check("status").optional().not().isEmpty().withMessage("awayTeam_score must be a number"),
	],
	
	forSearchFixture: [
		check("name").optional().not().isEmpty().withMessage("name field is required"),
		check("date").optional().not().isEmpty().withMessage("date field is required").custom((date) => {
			if (!moment(date).isValid()) throw new Error("date provided is invalid");
			return true;
		}),
		
		check("stadium").optional().not().isEmpty().withMessage("stadium field is required"),
		check("status").optional().not().isEmpty().withMessage("status must be a number"),
	],
};