import { check } from 'express-validator';

export const teamRules = {
	forAddTeam: [
		check('clubName')
			.not()
			.isEmpty()
			.withMessage('clubName field is required'),
		check('players').isArray().withMessage('players array is required')
	
	],
	forEditTeam: [
		check('teamName')
		.optional()
		.not()
		.isEmpty()
		.withMessage('teamName field is required'),
		check('teamMembers').optional().isArray().withMessage('teamMembers array is required')
	],
};