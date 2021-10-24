import supertest, { Response } from "supertest";
import app from "../index";
import DoneCallback = jest.DoneCallback;

describe("GET /", () => {
	it("should display a welcome message", (done: DoneCallback) => {
		supertest(app).get("/").end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(200);
			expect(JSON.parse(res.text).message).toBe("Welcome to Express API for mock premier league fixtures!");
			done();
		});
	}, 3000);
	it("should display an API not found message", (done:DoneCallback) => {
		supertest(app).get("/icecream").end((err, res) => {
			if (err) done(err);
			expect(res.status).toBe(404);
			expect(JSON.parse(res.text).message).toBe("API endpoint not found!");
			done();
		});
	}, 3000);
});
