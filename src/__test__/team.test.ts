import supertest, { Response } from "supertest";
import app from "../index";
import DoneCallback = jest.DoneCallback;
import { close, connect } from "../database/db";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbkF0dHJpYnV0ZXMiOnsiX2lkIjoiNjE3NTk5MjRmOThhMWQxOGIzMjA4NTNlIiwiaXNBZG1pbiI6dHJ1ZSwiZW1haWwiOiJhYmFiYXNldW5AZ21haWwuY29tIn0sImlhdCI6MTYzNTEwNzg4OCwiZXhwIjoxNjM1MTk0Mjg4fQ.lQlt6CCfjrafBcQDuGuwqJs5zfqPx5NKJhpKiRayG-w";

describe("POST /teams", () => {
	beforeAll(async () => await connect());
	afterAll(async () => await close());
	it("should add a team", (done: DoneCallback) => {
		const team = {
			"clubName": "Leicester City",
			"players": [{ "name": "Wesley Moraes", "role": "Central Forward" }, {
				"name": "Mahmoud Hassan",
				"role": "Attacking Midfield",
			}],
		};
		supertest(app).post("/api/v1/teams").send(team).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(201);
			expect(JSON.parse(res.text).team).toBeDefined();
			done();
		});
	}, 3000);
	it("should fail to add a team", (done: DoneCallback) => {
		const team = {
			"clubName": "",
			"players": [{ "name": "Wesley Moraes", "role": "Central Forward" }, {
				"name": "Mahmoud Hassan",
				"role": "Attacking Midfield",
			}],
		};
		supertest(app).post("/api/v1/teams").send(team).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(422);
			done();
		});
	}, 3000);
	
});

describe("PUT /team", () => {
	beforeAll(async () => await connect());
	afterAll(async () => await close());
	it("should update a team", (done: DoneCallback) => {
		const team = {
			"clubName": "Newcastle United",
			"players": [{ "name": "Wesley Moraes", "role": "Central Forward" }, {
				"name": "Mahmoud Hassan",
				"role": "Attacking Midfield",
			}],
		};
		supertest(app).put("/api/v1/team/:ID").send(team).set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).team).toBeDefined();
			done();
		});
	}, 3000);
	
});
describe("DELETE /team", () => {
	beforeAll(async () => await connect());
	afterAll(async () => await close());
	it("should delete a team", (done: DoneCallback) => {
		supertest(app).delete("/api/v1/team/:ID").set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).team).toBeDefined();
			done();
		});
	}, 3000);
	
});
describe("GET /teams", () => {
	beforeAll(async () => await connect());
	afterAll(async () => await close());
	it("should get all teams", (done: DoneCallback) => {
		supertest(app).get("/api/v1/teams").set("authorization", `Bearer ${token}`).end((err, res: Response) => {
			if (err) done(err);
			console.log(res.body);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).team).toBeDefined();
			done();
		});
	}, 3000);
	
});