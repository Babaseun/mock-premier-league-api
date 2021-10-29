import { Response, Request } from "express";
import { matchedData } from "express-validator";
import { validationResult } from "express-validator";
import {
	IFixtureAttributes,
	IFixtureSearchCriteria,
	IGetUserAuthInfoRequest,
} from "../contracts";
import { FixtureService } from "../services/fixture.service";
import { StatusCodes } from "http-status-codes";

const fixtureService = new FixtureService();

const FixtureController = {
	async AddFixture(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User not authorized to add fixture" });
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) return res.status(422).json(errors.array());
		const payload = matchedData(req) as IFixtureAttributes;
		
		const response = await fixtureService.addFixture(payload);
		switch (response.statusCode) {
			case StatusCodes.CREATED:
				return res.status(response.statusCode).send({ fixture: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
			
		}
	},
	async EditFixture(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User not authorized to edit fixture" });
		
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(422).json(errors.array());
		
		const payload = matchedData(req) as IFixtureAttributes;
		const response = await fixtureService.editFixture(req.params.ID, payload);
		
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ fixture: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
	},
	async RemoveFixture(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User not authorized to remove fixture" });
		
		const response = await fixtureService.removeFixture(req.params.ID);
		
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ fixture: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
		
	},
	async GetAllFixtures(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User not authorized to view fixtures" });
		const response = await fixtureService.getAllFixtures(req.query);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ fixture: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
		
	},
	async GetFixture(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User not authorized to view fixture" });
		
		const response = await fixtureService.getFixture(req.params.ID);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ fixture: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
	},
	async GetCompletedFixtures(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User not authorized to view fixture" });
		
		const response = await fixtureService.getCompletedFixtures(req.query);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ fixture: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
	},
	async GetPendingFixtures(req: IGetUserAuthInfoRequest, res: Response) {
		if (req.user?.isAdmin === false)
			return res.status(401).send({ message: "User not authorized to view fixture" });
		
		const response = await fixtureService.getPendingFixtures(req.query);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ fixture: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
	},
	async SearchFixtures(req: IGetUserAuthInfoRequest, res: Response) {
		const errors = validationResult(req);
		
		if (!errors.isEmpty()) return res.status(422).json(errors.array());
		const payload = matchedData(req) as IFixtureSearchCriteria;
		const response = await fixtureService.searchFixture(req.query, payload);
		switch (response.statusCode) {
			case StatusCodes.OK:
				return res.status(response.statusCode).send({ results: response.response });
			default:
				return res.status(response.statusCode).send({ message: response.message });
		}
	},
};

export default FixtureController;