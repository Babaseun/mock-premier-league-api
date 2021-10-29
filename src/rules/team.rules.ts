import { check } from 'express-validator';
import moment from "moment/moment";

export const teamRules = {
	forAddTeam: [
		check('clubName')
			.not()
			.isEmpty()
			.withMessage('clubName field is required'),
		check('players').isArray().withMessage('players array is required')
	
	],
	forEditTeam: [
		check('clubName')
		.optional()
		.not()
		.isEmpty()
		.withMessage('clubName is required'),
		check('players').optional().isArray().withMessage('players array is required')
	],
	forSearchTeam: [
		check("name").optional().not().isEmpty().withMessage("name field is required"),
		check("description").optional().not().isEmpty().withMessage("description field is required"),
		check("role").optional().not().isEmpty().withMessage("role field is required"),
		check("memberName.*.name").optional().not().isEmpty().withMessage("member name is required"),
	],
};