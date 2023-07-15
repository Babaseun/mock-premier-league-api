import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import morgan from "morgan";
import responseTime from "response-time";
import { userRouter } from "./routers/user.router";
import { teamRouter } from "./routers/team.router";
import { fixtureRouter } from "./routers/fixture.router";
import { connect } from "./database/db";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import redis from "redis";
import http from "http";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

// limit IP requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const app = express();
const {NODE_ENV, REDIS_HOST, REDIS_PORT, REDIS_SECRET} = process.env;
if (NODE_ENV !== "test") {
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
  });
  redisClient.on("error", (err) => {
    console.log("Could not establish a connection with redis. " + err);
  });
  redisClient.on("connect", (err) => {
    console.log("Connected to redis successfully");
  });
  app.use(limiter);
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: REDIS_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 10, // session max age in miliseconds
      },
    })
  );
  app.use(responseTime());
}
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Mock Premier League API",
      description:
        "An API that serves the latest scores of fixtures of matches in a Mock Premier League",
      contact: {
        name: "Adeyemi Onibokun",
      },
      servers: ["http://localhost:5000"],
    },
  },

  apis: ["src/index.ts", "src/routers/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// Routes
/**
 * @swagger
 * /:
 *  get:
 *    description: Use to request the root API endpoint
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get("/", (req, res) => {
  return res.status(200).send({
    message: "Welcome to Express API for mock premier league fixtures!",
  });
});

app.use("/api/v1", userRouter);
app.use("/api/v1", fixtureRouter);
app.use("/api/v1", teamRouter);
app.use("*", (req, res) => {
  return res.status(404).send({
    message: "API endpoint not found!",
  });
});

const PORT = 5000 || process.env.PORT;
const server = http.createServer(app);
if (NODE_ENV !== "test") {
  server.listen(PORT, async () => {
    await connect();
    console.log(`Server listening: http://localhost:${PORT}`);
  });
}
export default app;
