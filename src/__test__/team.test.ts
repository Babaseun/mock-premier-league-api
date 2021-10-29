import supertest, { Response } from "supertest";
import app from "../index";
import DoneCallback = jest.DoneCallback;
import { close, connect } from "../database/db";
import { User } from "../models/user";
import mongoose from "mongoose";
import { Team } from "../models/team";

const team = new Team({
	_id: new mongoose.Types.ObjectId("569ed8269353e9f4c51617aa"),
	clubName: "Liverpool",
	players: [{name:"salah", jerseyNumber:11}],
	role: "ST",
});
const admin = new User({
	email: "ababaseun@gmail.com",
	firstName: "Ade",
	isAdmin: true,
	lastName: "Ade",
	password: "$2b$08$LpwyJxPm6iWs3t17y4n2tOtbe0BFQtym4LZuLY4AGPIr/5xQsgn7q",
});
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbkF0dHJpYnV0ZXMiOnsiX2lkIjoiNjE3NTk5MjRmOThhMWQxOGIzMjA4NTNlIiwiaXNBZG1pbiI6dHJ1ZSwiZW1haWwiOiJhYmFiYXNldW5AZ21haWwuY29tIn0sImlhdCI6MTYzNTQwNzM2MiwiZXhwIjoxNjM1NDkzNzYyfQ.T9etO3blzmI2M_cv1EtDFIAs_MosILZSZQEjPhxLJ9g";
beforeAll(async () => {
	await connect();
	await admin.save();
	await team.save();
});
describe("POST /teams", () => {
	it("should add a team", (done: DoneCallback) => {
		const team = {
			clubName: "Chelsea",
			players: [{name:"Kante", jerseyNumber:7}],
			role: "ST",
		};
		supertest(app).post("/api/v1/teams").send(team).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(201);
			expect(JSON.parse(res.text).team).toBeDefined();
			expect(JSON.parse(res.text).team.clubName).toBe(team.clubName);
			done();
		});
	}, 3000);
	it("should fail for an invalid team name", (done: DoneCallback) => {
		const team = {
			clubName: "Barcelona FC",
			players: [{name:"Kante", jerseyNumber:7}],
			role: "ST",
		};
		supertest(app).post("/api/v1/teams").send(team).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(400);
			expect(JSON.parse(res.text).message).toBeDefined();
			done();
		});
	}, 3000);
	
});
describe("GET /teams", () => {
	
	it("should get a team by ID", (done: DoneCallback) => {
		supertest(app).get("/api/v1/teams/569ed8269353e9f4c51617aa").set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).team).toBeDefined();
			done();
		});
	}, 3000);
	it("should get all teams", (done: DoneCallback) => {
		supertest(app).get("/api/v1/teams").set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).results).toBeDefined();
			done();
		});
	}, 3000);
});
describe("PUT /teams", () => {
	it("should edit a team", (done: DoneCallback) => {
		const updateFixture = {
			clubName: "Manchester United",
		};
		supertest(app).put("/api/v1/teams/569ed8269353e9f4c51617aa").send(updateFixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).team).toBeDefined();
			expect(JSON.parse(res.text).team.clubName).toBe("Manchester United");
			done();
		});
	}, 3000);
	it("should return not found for a team that does not exist", (done: DoneCallback) => {
		const updateFixture = {
			clubName: "Barcelona FC",
		};
		supertest(app).put("/api/v1/teams/569ed8269353e9f4c51617ba").send(updateFixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(404);
			expect(JSON.parse(res.text).message).toBeDefined();
			done();
		});
	}, 3000);
});
describe("POST /teams/search", ()=> {
	it("should return search results for teams", (done: DoneCallback) => {
		const searchCriteria = {
			name: 'Wolverhampton Wanderers'
		}
		supertest(app).post("/api/v1/teams/search").send(searchCriteria).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).results.count).toBeGreaterThan(0);
			done();
		});
	}, 3000);
})
afterAll(async () => await close());
