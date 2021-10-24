import supertest, { Response } from "supertest";
import app from "../index";
import DoneCallback = jest.DoneCallback;
import { close, connect } from "../database/db";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbkF0dHJpYnV0ZXMiOnsiX2lkIjoiNjE3NTk5MjRmOThhMWQxOGIzMjA4NTNlIiwiaXNBZG1pbiI6dHJ1ZSwiZW1haWwiOiJhYmFiYXNldW5AZ21haWwuY29tIn0sImlhdCI6MTYzNTEwNzg4OCwiZXhwIjoxNjM1MTk0Mjg4fQ.lQlt6CCfjrafBcQDuGuwqJs5zfqPx5NKJhpKiRayG-w";
beforeAll(async () => await connect());
afterAll(async () => await close());
describe("POST /fixtures", () => {
	
	it("should add a fixture", (done: DoneCallback) => {
		const fixture = {
			homeTeam: [{ name: 'Newcastle United', score: 0 }],
			awayTeam: [{ name: 'Southampton', score: 0 }],
			matchInfo: [{ date: '2021-11-26T16:24:32.674+00:00' }, { stadium: 'Craven Cottage' }]
		}
		supertest(app).post("/api/v1/fixtures").send(fixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(201);
			expect(JSON.parse(res.text).fixture).toBeDefined();
			done();
		});
	}, 3000);
	it("should fail to add a fixture", (done: DoneCallback) => {
		const fixture = {
			homeTeam: [{ name: 'Barcelona FC', score: 0 }],
			awayTeam: [{ name: 'Southampton', score: 0 }],
			matchInfo: [{ date: '2021-11-26T16:24:32.674+00:00' }, { stadium: 'Craven Cottage' }]
		}
		supertest(app).post("/api/v1/fixtures").send(fixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(422);
			done();
		});
	}, 3000);
	
});

describe("PUT /fixture", () => {
	beforeAll(async () => await connect());
	
	const fixture = {
		homeTeam: [{ name: 'Barcelona FC', score: 0 }],
		awayTeam: [{ name: 'Southampton', score: 0 }],
		matchInfo: [{ date: '2021-11-26T16:24:32.674+00:00' }, { stadium: 'Craven Cottage' }]
	}
	it("should update a fixture", (done: DoneCallback) => {
		const fixture = {
			homeTeam: [{ name: 'Barcelona FC', score: 0 }],
			awayTeam: [{ name: 'Southampton', score: 0 }],
			matchInfo: [{ date: '2021-11-26T16:24:32.674+00:00' }, { stadium: 'Craven Cottage' }]
		}
		supertest(app).put("/api/v1/fixture/:ID").send(fixture).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).fixture).toBeDefined();
			done();
		});
	}, 3000);
	
});
describe("DELETE /fixture", () => {
	
	it("should delete a fixture", (done: DoneCallback) => {
		supertest(app).delete("/api/v1/fixture/:ID").set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).fixture).toBeDefined();
			done();
		});
	}, 3000);
	
});
describe("GET /fixtures", () => {
	beforeAll(async () => await connect());
	afterAll(async () => await close());
	it("should get all fixtures", (done: DoneCallback) => {
		supertest(app).get("/api/v1/fixtures").set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).fixture).toBeDefined();
			done();
		});
	}, 3000);
	
});