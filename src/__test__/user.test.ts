import supertest, { Response } from "supertest";
import app from "../index";
import DoneCallback = jest.DoneCallback;
import { connect, close } from "../database/db";
import { IUserAttributes } from "../contracts";

describe("POST /signup ", () => {
	beforeAll(async () => await connect());
	afterAll(async () => await close());
	
	const adminUserMock: IUserAttributes = {
		firstName: "Adeyemi",
		lastName: "Onibokun",
		email: "ade@gmail.com",
		password: "12345678",
		confirmPassword: "12345678",
		isAdmin: true,
	};
	it("should signup admin successfully", (done: DoneCallback) => {
		supertest(app).post("/api/v1/signup").send(adminUserMock).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(201);
			expect(res.body.token).not.toBeNull();
			expect(res.body.token).not.toBeUndefined();
			expect(res.body.token).toContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
			done();
		});
	});
	const userMock: IUserAttributes = {
		firstName: "Tim",
		lastName: "Cook",
		email: "tim@gmail.com",
		password: "123456780",
		confirmPassword: "123456780",
		
	};
	it("should signup user successfully", (done: DoneCallback) => {
		
		supertest(app).post("/api/v1/signup").send(userMock).end((err, res: Response) => {
			console.log(res.body);
			if (err) done(err);
			expect(res.status).toBe(201);
			expect(res.body.token).toContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
			done();
		});
	});
	const userMock2: IUserAttributes = {
		firstName: "Tim",
		lastName: "Cook",
		email: "timgmail.com",
		password: "123456780",
		confirmPassword: "123456780",
		
	};
	it("should fail email validation for signup", (done: DoneCallback) => {
		supertest(app).post("/api/v1/signup").send(userMock2).end((err, res: Response) => {
			if (err) done(err);
			expect(res.status).toBe(422);
			done();
		});
	});
	
});
