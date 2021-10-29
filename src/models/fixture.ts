import { model, Schema } from "mongoose";
import { IFixtureAttributes } from "../contracts";

const teams = ["AFC Bournemouth", "Arsenal", "Aston Villa", "Brighton & Hove Albion", "Burnley", "Chelsea",
	"Crystal Palace", "Everton", "Leicester City", "Liverpool", "Manchester City", "Manchester United",
	"Newcastle United", " Norwich City", "Sheffield United", "Southampton", "Tottenham Hotspur", "Watford",
	"West Ham United", "Wolverhampton Wanderers"];
const stadiums = ["Vitality Stadium", "The Amex", "Turf Moor", "Cardiff City Stadium",
	"John Smith's Stadium", "King Power Stadium", "Goodison Park", "Anfield",
	"Emirates Stadium", "Stamford Bridge", "Selhurst Park", "Craven Cottage",
	"Wembley Stadium", "London Stadium", "Etihad Stadium", "Old Trafford",
	"St James Park", "St Mary's Stadium", "Vicarage Road", "Molineux Stadium"];

const fixtureSchema = new Schema<IFixtureAttributes>({
	homeTeam: {
		type: String,
		enum: teams,
	},
	awayTeam: {
		type: String,
		enum: teams,
	},
	status: { type: String, default: "pending" },
	stadium: {
		type: String,
		enum: stadiums,
	},
	kickoff: { type: Date },
	homeTeam_score: { type: Number, default: 0 },
	awayTeam_score: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() },
});

export const Fixture = model<IFixtureAttributes>("Fixture", fixtureSchema);