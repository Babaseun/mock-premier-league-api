import { Request } from "express";

export interface IUserAttributes {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeamAttributes {
  clubName: string;
  players: any;
  description: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFixtureAttributes {
  homeTeam: string;
  awayTeam: string;
  kickoff: Date;
  matchInformation: any;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITokenAttributes {
  _id?: string;
  email?: string;
  isAdmin?: boolean;
}

export interface ITeamsCollection {
  count: number;
  teams: ITeamAttributes[];
}

export interface IFixturesCollection {
  count: number;
  fixtures: IFixtureAttributes[];
}

export interface IFixtureSearchCriteria {
  stadium?: any;
  name?: string;
  date?: Date;
  status?: string;
}

export interface ITeamSearchCriteria {
  name?: string;
  role?: string;
  description?: string;
  memberName?: string;
}

export interface IResponse {
  statusCode: number;
  response?:
    | IFixturesCollection
    | IFixtureAttributes
    | ITeamAttributes
    | ITeamsCollection;
  message?: string;
  token?:string;
}

export interface IPaginationParameters {
  pageNumber?: number;
  perPage?: number;
}

export interface IGetUserAuthInfoRequest extends Request {
  user?: ITokenAttributes;
}
