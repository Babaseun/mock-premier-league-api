import supertest, { Response } from "supertest";
import app from "../index";
import DoneCallback = jest.DoneCallback;
import { close, connect } from "../database/db";
import { User } from "../models/user";
import { Fixture } from "../models/fixture";
import mongoose from "mongoose";

const fixture = new Fixture({
	_id: new mongoose.Types.ObjectId("569ed8269353e9f4c51617aa"),
	homeTeam: "Wolverhampton Wanderers", homeTeam_score: 0,
	awayTeam: "West Ham United", awayTeam_score: 0,
	kickoff: "2021-12-26T16:24:32.674+00:00", stadium: "Craven Cottage",
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
	await fixture.save();
});
describe("POST /fixtures", () => {
	it("should add a fixture", (done: DoneCallback) => {
		const fixture = {
			homeTeam: "Newcastle United", homeTeam_score: 0,
			awayTeam: "Southampton", awayTeam_score: 0,
			kickoff: "2021-12-26T16:24:32.674+00:00", stadium: "Craven Cottage",
		};
		supertest(app).post("/api/v1/fixtures").send(fixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(201);
			expect(JSON.parse(res.text).fixture).toBeDefined();
			expect(JSON.parse(res.text).fixture.awayTeam).toBe(fixture.awayTeam);
			done();
		});
	}, 3000);
	it("should fail for an invalid team name", (done: DoneCallback) => {
		const fixture = {
			homeTeam: "icecream", homeTeam_score: 0,
			awayTeam: "Southampton", awayTeam_score: 0,
			kickoff: "2021-12-26T16:24:32.674+00:00", stadium: "Craven Cottage",
		};
		supertest(app).post("/api/v1/fixtures").send(fixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(400);
			expect(JSON.parse(res.text).message).toBeDefined();
			done();
		});
	}, 3000);
	it("should fail if a fixture exists with its status as pending", (done: DoneCallback) => {
		const fixture = {
			homeTeam: "Wolverhampton Wanderers", homeTeam_score: 0,
			awayTeam: "West Ham United", awayTeam_score: 0,
			kickoff: "2021-12-26T16:24:32.674+00:00", stadium: "Craven Cottage",
		};
		supertest(app).post("/api/v1/fixtures").send(fixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(400);
			expect(JSON.parse(res.text).message).toBeDefined();
			done();
		});
	}, 3000);
	
	
});
describe("GET /fixtures", () => {
	
	it("should get a fixture by ID", (done: DoneCallback) => {
		supertest(app).get("/api/v1/fixtures/569ed8269353e9f4c51617aa").set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).fixture).toBeDefined();
			done();
		});
	}, 3000);
	it("should get all fixtures", (done: DoneCallback) => {
		supertest(app).get("/api/v1/fixtures").set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).fixture).toBeDefined();
			done();
		});
	}, 3000);
});
describe("PUT /fixtures", () => {
	it("should edit a fixture", (done: DoneCallback) => {
		const updateFixture = {
			status: "completed",
		};
		supertest(app).put("/api/v1/fixtures/569ed8269353e9f4c51617aa").send(updateFixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).fixture).toBeDefined();
			expect(JSON.parse(res.text).fixture.status).toBe("completed");
			
			done();
		});
	}, 3000);
	it("should return not found for a fixture that does not exist", (done: DoneCallback) => {
		const updateFixture = {
			status: "completed",
		};
		supertest(app).put("/api/v1/fixtures/569ed8269353e9f4c51617ba").send(updateFixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(404);
			expect(JSON.parse(res.text).message).toBeDefined();
			done();
		});
	}, 3000);
});
describe("POST /fixtures/search", ()=> {
	  it("should return search results for fixtures", (done: DoneCallback) => {
		const searchCriteria = {
			name: 'Wolverhampton Wanderers'
		}
		supertest(app).post("/api/v1/fixtures/search").send(searchCriteria).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).results.count).toBeGreaterThan(0);
			done();
		});
	}, 3000);
})
afterAll(async () => await close());
