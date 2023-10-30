import "reflect-metadata"
import dotenv from "dotenv";
import {DataSource} from "typeorm"
import {User} from '../models/User.js'
import {Card} from "../models/Card.js";

dotenv.config();

const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "javauser",
    password: POSTGRES_PASSWORD,
    database: "coffee_house",
    synchronize: true,
    logging: false,
    entities: [User, Card],
    migrations: [],
    subscribers: [],
})
