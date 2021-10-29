import { Response, Request } from "express";
import { matchedData } from "express-validator";
import { validationResult } from "express-validator";
import { IFixtureSearchCriteria, IGetUserAuthInfoRequest, ITeamAttributes } from "../contracts";
import { TeamService } from "../services/team.service";
import { StatusCodes } from "http-status-codes";

const teamService = new TeamService();

const TeamController = {
	async AddTeam(req: IGetUserAuthInfoRequest, res: Response) {
		
		if (req.user?.isAdmin === false)
			return res.status(400).send({ message: "User not authorized to add team" });
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) return res.status(422).json(errors.array());
		
		const payload = matchedData(req) as ITeamAttributes;
		
		const response = await teamService.addTeam(payload);
		
		switch (response.statusCode) {
			case StatusCodes.CREATED:
				return res.status(response.statusCode).send({ team: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
	},
	async EditTeam(req: IGetUserAuthInfoRequest, res: Response) {
		
		if (req.user?.isAdmin === false)
			return res.status(400).send({ message: "User is not authorized to edit a team" });
		
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) return res.status(422).json(errors.array());
		
		const payload = matchedData(req) as ITeamAttributes;
		
		const response = await teamService.editTeam(req.params.ID, payload);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ team: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
			
		}
	},
	async RemoveTeam(req: IGetUserAuthInfoRequest, res: Response) {
		
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User is not authorized to remove a team" });
		
		const response = await teamService.removeTeam(req.params.ID);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ fixture: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
			
		}
		
	},
	async GetAllTeams(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user!.isAdmin === false)
			return res.status(400).send({ message: "User is not authorized to view teams" });
		
		const response = await teamService.getAllTeams(req.query);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ results: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
			
		}
	},
	async GetTeam(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User not authorized to view team" });
		const response = await teamService.getTeam(req.params.ID);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ team: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
			
		}
	},
	async SearchForTeam(req: IGetUserAuthInfoRequest, res: Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json(errors.array());
		const payload = matchedData(req) as IFixtureSearchCriteria;
		
		const response = await teamService.searchTeam(payload);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ results: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
		
	},
};

export default TeamController;