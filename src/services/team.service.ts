import {
	ITeamSearchCriteria,
	IPaginationParameters,
	IResponse,
	ITeamAttributes,
} from "../contracts";
import { Team } from "../models/team";
import { StatusCodes } from "http-status-codes";

export class TeamService {
	async addTeam(team: ITeamAttributes): Promise<IResponse> {
		try {
			
			const teamModel = new Team(team);
			const data = await teamModel.save();
			return {
				statusCode: 201,
				response: data,
			};
		} catch (e) {
			console.log(`Error occurred while saving team ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while saving team, ${e}`,
			};
		}
	}
	
	async editTeam(_id: string, team: ITeamAttributes): Promise<IResponse> {
		try {
			
			const query = await Team.findByIdAndUpdate(
				{ _id },
				{
					$set: {
						clubName: team.clubName,
						players: team.players,
						role: team.role,
						description: team.description,
						updatedAt: Date.now(),
					},
					useFindAndModify: false,
				},
			).exec();
			if (query)
				return {
					statusCode: StatusCodes.OK,
					response: team,
				};
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `Team with ID ${_id} could not be updated`,
			};
		} catch (e) {
			console.log(`Error occurred while updating team ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while updating team, ${e}`,
				
			};
		}
		
	}
	
	async removeTeam(_id: string): Promise<IResponse> {
		try {
			const team = await Team.findByIdAndDelete({ _id }).exec();
			if (team) {
				return {
					statusCode: StatusCodes.OK,
					message: `Team with ID ${team?._id} has been deleted successfully.`,
				};
			}
			return {
				statusCode: StatusCodes.NOT_FOUND,
				message: `Team with ID ${_id} does not exist.`,
			};
		} catch (e) {
			console.log(`Error occurred while deleting team ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while deleting fixture ,${e}`,
			};
		}
		
	}
	
	async getAllTeams(pagination: IPaginationParameters): Promise<IResponse> {
		try {
			let { perPage, pageNumber } = pagination;
			perPage = perPage && Number.isInteger(perPage) ? perPage : 5;
			pageNumber = pageNumber && Number.isInteger(pageNumber) ? pageNumber : 1;
			const teams = await Team.find().select("_id teamName teamMembers description createdAt updatedAt").skip((
				pageNumber - 1) * perPage).limit(perPage).sort({ createdAt: -1 }).exec();
			return {
				statusCode: StatusCodes.OK,
				response: {
					count: teams.length,
					teams,
				},
			};
		} catch (e) {
			console.log(`Error occurred while fetching teams ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while fetching teams`,
			};
			
			
		}
	}
	
	async getTeam(_id: string): Promise<IResponse> {
		try {
			const team = await Team.findById({ _id }).exec();
			if (!team) {
				return {
					statusCode: StatusCodes.NOT_FOUND,
					message: `Team with id ${_id} not found`,
				};
			}
			return {
				statusCode: StatusCodes.OK,
				response: team,
			};
		} catch (e) {
			console.log(`Error occurred while fetching for team with id ${_id} ,${e}`);
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `Error occurred while fetching for team with id ${_id} ,${e}`,
			};
		}
	}
	
	async searchTeam(criteria: ITeamSearchCriteria): Promise<IResponse> {
		try {
			let { name, description, memberName, role } = criteria;
			
			if (name || role || description || memberName) {
				const teams = await Team.find({
					$or: [
						{ "clubName": name },
						{ "description": description },
						{ "players.0.name": new RegExp(`^${memberName}$`, "i") },
					],
				}).exec();
				return {
					statusCode: StatusCodes.OK,
					response: {
						count: teams.length,
						teams,
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
	
}