import { model, Schema } from "mongoose";
import { ITeamAttributes } from "../contracts";

const teamSchema = new Schema<ITeamAttributes>({
	clubName: {
		type: String,
		unique: true,
		enum: ["AFC Bournemouth", "Arsenal", "Aston Villa", "Brighton & Hove Albion", "Burnley", "Chelsea",
			"Crystal Palace", "Everton", "Leicester City", "Liverpool", "Manchester City", "Manchester United",
			"Newcastle United", " Norwich City", "Sheffield United", "Southampton", "Tottenham Hotspur", "Watford",
			"West Ham United", "Wolverhampton Wanderers"],
	},
	players: {
		type: [Schema.Types.Mixed],
	},
	role: {
		type: String,
		enum: ["GK", "CB", "CM", "CF", "LW", "AM", "CF", "LM", "SS", "ST", "RM", "COACH"],
		default: "COACH",
	},
	description: { type: String },
	
	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() },
});

export const Team = model<ITeamAttributes>("Team", teamSchema);