import {
	IFixtureAttributes,
	IFixtureSearchCriteria,
	IPaginationParameters,
	IResponse,
} from "../contracts";
import { StatusCodes } from "http-status-codes";
import { Fixture } from "../models/fixture";

export class FixtureService {
	async addFixture(fixture: IFixtureAttributes): Promise<IResponse> {
		try {
			if (fixture.homeTeam === fixture.awayTeam)
				return {
					statusCode: StatusCodes.BAD_REQUEST,
					message: "Both teams with the same name is not allowed",
				};
			
			const fixtureModel = new Fixture(fixture);
			const results = await Fixture.find({
				homeTeam: fixture.homeTeam,
				awayTeam: fixture.awayTeam,
				kickoff: fixture.kickoff,
			});
			const fixtureExists = results.some(p => p.status === "pending");
			if (fixtureExists)
				return {
					statusCode: StatusCodes.BAD_REQUEST,
					message: "Fixture already exists",
				};
			
			const data = await fixtureModel.save();
			return {
				statusCode: StatusCodes.CREATED,
				response: data,
			};
		} catch (e) {
			console.log(`Error occurred while saving fixture ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while saving fixture, ${e}`,
			};
		}
		
	}
	
	async editFixture(_id: string, fixture: IFixtureAttributes): Promise<IResponse> {
		try {
			
			const query = await Fixture.findByIdAndUpdate(
				{ _id },
				{
					$set: {
						homeTeam: fixture.homeTeam,
						awayTeam: fixture.awayTeam,
						kickoff: fixture.kickoff,
						updatedAt: Date.now(),
					},
					useFindAndModify: false,
				},
			).exec();
			
			if (query)
				return {
					statusCode: StatusCodes.OK,
					response: fixture,
				};
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `Fixture with ID ${_id} could not be updated`,
			};
		} catch (e) {
			console.log(`Error occurred while updating fixture ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while updating fixture, ${e}`,
				
			};
		}
	}
	
	async removeFixture(_id: string): Promise<IResponse> {
		try {
			const fixture = await Fixture.findByIdAndDelete({ _id }).exec();
			if (fixture) {
				return {
					statusCode: StatusCodes.OK,
					message: `Fixture with ID ${fixture?._id} has been deleted successfully.`,
				};
			}
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `Fixture with ID ${_id} does not exist.`,
			};
			
		} catch (e) {
			console.log(`Error occurred while deleting fixture ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while deleting fixture ,${e}`,
			};
			
		}
		
	}
	
	async getAllFixtures(pagination: IPaginationParameters): Promise<IResponse> {
		try {
			let { perPage, pageNumber } = pagination;
			
			perPage = perPage && Number.isInteger(perPage) ? perPage : 5;
			pageNumber = pageNumber && Number.isInteger(pageNumber) ? pageNumber : 1;
			const fixtures = await Fixture.find().select("_id homeTeam awayTeam kickoff createdAt updatedAt").skip((
				pageNumber - 1) * perPage).limit(perPage).sort({ createdAt: -1 }).exec();
			return {
				statusCode: StatusCodes.OK,
				response: {
					count: fixtures.length,
					fixtures,
				},
			};
			
		} catch (e) {
			console.log(`Error occurred while fetching fixtures. ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while fetching fixtures.`,
			};
		}
	}
	
	async getCompletedFixtures(pagination: IPaginationParameters): Promise<IResponse> {
		try {
			let { perPage, pageNumber } = pagination;
			perPage = perPage && Number.isInteger(perPage) ? perPage : 5;
			pageNumber = pageNumber && Number.isInteger(pageNumber) ? pageNumber : 1;
			const fixtures = await Fixture.find({ status: "completed" }).skip((
				pageNumber - 1) * perPage).limit(perPage).sort({ createdAt: -1 }).exec();
			return {
				statusCode: StatusCodes.OK,
				response: {
					count: fixtures.length,
					fixtures,
				},
			};
			
		} catch (e) {
			console.log(`Error occurred while fetching completed fixtures ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while fetching completed fixtures ,${e}`,
			};
		}
	}
	
	async getPendingFixtures(pagination: IPaginationParameters): Promise<IResponse> {
		try {
			let { perPage, pageNumber } = pagination;
			perPage = perPage && Number.isInteger(perPage) ? perPage : 5;
			pageNumber = pageNumber && Number.isInteger(pageNumber) ? pageNumber : 1;
			const fixtures = await Fixture.find({ status: "pending" }).skip((
				pageNumber - 1) * perPage).limit(perPage).sort({ createdAt: -1 }).exec();
			
			return {
				statusCode: StatusCodes.OK,
				response: {
					count: fixtures.length,
					fixtures,
				},
			};
			
			
		} catch (e) {
			console.log(`Error occurred while fetching pending fixtures ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while fetching pending fixtures ,${e}`,
			};
		}
	}
	
	async searchFixture(pagination: IPaginationParameters, criteria: IFixtureSearchCriteria): Promise<IResponse> {
		try {
			let { perPage, pageNumber } = pagination;
			let { name, date, stadium, status } = criteria;
			perPage = perPage && Number.isInteger(perPage) ? perPage : 5;
			pageNumber = pageNumber && Number.isInteger(pageNumber) ? pageNumber : 1;
			if (name || date || stadium || status) {
				stadium = new RegExp(`^${stadium}$`, "i");
				const fixtures = await Fixture.find({
					$or: [
						{ status },
						{ "homeTeam.0.name": new RegExp(`^${name}$`, "i") },
						{ "awayTeam.0.name": new RegExp(`^${name}$`, "i") },
						{ matchInfo: { $elemMatch: { date, stadium } } },
					],
				}).skip((
					pageNumber - 1) * perPage).limit(perPage).sort({ createdAt: -1 }).exec();
				return {
					statusCode: StatusCodes.OK,
					response: {
						count: fixtures.length,
						fixtures,
					},
				};
			}
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `No match found for selected criteria ${criteria}`,
			};
			
		} catch (e) {
			console.log(`Error occurred while searching for fixtures  ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while fetching searching for fixtures ,${e}`,
			};
			
		}
	}
	
	async getFixture(_id: string): Promise<IResponse> {
		try {
			const fixture = await Fixture.findById({ _id }).exec();
			if (!fixture) {
				return {
					statusCode: StatusCodes.NOT_FOUND,
					message: `Fixture with id ${_id} not found`,
				};
			}
			return {
				statusCode: StatusCodes.OK,
				response: fixture,
			};
		} catch (e) {
			console.log(`Error occurred while fetching for fixtures with id ${_id} ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while fetching for fixtures with id ${_id} ,${e}`,
			};
		}
	}
	
}