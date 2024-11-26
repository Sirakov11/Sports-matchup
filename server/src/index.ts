import express, { Express, Request, Response } from 'express';
import * as bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import { User } from './Models/User';


//import {config} from './knexfile';
//import { dbConnection } from './databaseConnection';
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const config = require('./knexfile')
const users: User[] = [];
const knex = require('knex')(config);
async function createRecord(tableName:string, data: unknown) {
  try {
    const [id] = await knex(tableName).insert(data);
    return id;
  } catch (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }
}

app.post('/users', async (req, res) => {
  try {
    console.log('body', req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);


    const user:User = {
      username: req.body.name, password: hashedPassword,
      email: ''
    };
    users.push(user); 
    console.log(users);
    res.status(201).send("User created successfully!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating user");
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const { name, password, email }: { name: string; password: string; email: string } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = {
      username: name,
      password: hashedPassword,
      email: email,
    };

    users.push(user);
    console.log(users);

    res.status(201).send("User created successfully!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating user");
  }
});
