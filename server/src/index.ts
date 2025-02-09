import express from "express";
import { db } from "./database.js";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
// import jwt, { Secret } from "jsonwebtoken";
import cors from 'cors';
import { DB } from "kysely-codegen";
import { userService } from "./user_service.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/users", async (req, res) => {
  try {
    const { sport_id, experience, weight, height } = req.query;
    let query = db.selectFrom("users")
      .leftJoin("sports", "users.sport_id", "sports.id");
    if (sport_id) {
      query = query.where("users.sport_id", "=", +sport_id);
    }
    if (experience) {
      query = query.where("users.experience", "=", experience as string);
    }
    if (weight) {
      query = query.where("users.weight", "=", +weight);
    }
    if (height) {
      query = query.where("users.height", "=", +height);
    }
    const users = await query.select(["users.name", "sports.name as sport_name","users.weight", "users.experience", "users.height"]).execute();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching user");
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // const user = await db
    //   .selectFrom("users")
    //   .where("users.id", "=", +id)
    //   .leftJoin("sports", "users.sport_id", "sports.id")
    //   .select(["users.name", "sports.name as sport_name"])
    //   .executeTakeFirstOrThrow();
    const user = await userService.findById(+id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching user");
  }
});
app.post("/users/:id", async (req, res) => {
  const { weight, experience, height, sport_id } = req.body; // Вземаме полетата от тялото на заявката
  const { id } = req.params; // Вземаме ID-то на потребителя от параметрите на URL

  try {
    await db
      .updateTable("users")
      .set({
        weight: weight,
        experience: experience,
        height: height,
        sport_id: sport_id,
      })
      .where("id", "=", +id)
      .execute();

    res.status(200).send("Successfully updated user");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating user");
  }
});


app.get("/users/sport/:sportId", async (req, res) => {
  try {
    const { sportId } = req.params;
    console.log(sportId)
    const users = await db
      .selectFrom("users")
      .where("users.sport_id", "=", +sportId)
      .leftJoin("sports", "users.sport_id", "sports.id")
      .select(["users.name", "sports.name as sport_name"])
      .execute();

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users by sport");
  }
});
app.get("/sports", async (req, res) => {
  try {
    const sports = await db.selectFrom("sports").selectAll().execute();
    res.status(200).json(sports);
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Error getting sports");
  }
})

app.post("/login", async (req, res) => {
  console.log(process.env.DATABASE_URL);
  try {
    const { name, password } = req.body;

    const user = await db
      .selectFrom("users")
      .where("name", "=", name)
      .select("hashed_password")
      .executeTakeFirstOrThrow();

    if (bcrypt.compareSync(password, user.hashed_password)) {
      res.status(200).send("login ok");
    } else {
      throw Error("wrong password");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error logging in");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate required fields
    if (!name || !password) {
      res.status(400).send("Name and password are required");
      return;
    }

    // Check if the user already exists
    const existingUser = await db
      .selectFrom("users")
      .where("name", "=", name)
      .select("id")
      .executeTakeFirst();

    if (existingUser) {
      res.status(409).send("User already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await db
      .insertInto("users")
      .values({
        name: name,
        hashed_password: hashedPassword,
      })
      .returningAll()
      .execute();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});
app.get("/users/filter", async (req, res) => {
  try {
    const { sportId, experienceLevel } = req.query;

    const users = await db
      .selectFrom("users")
      //.where("users.sport_id", "=", +sportId)
      //.where("users.experience_level", "=", experienceLevel)
      .leftJoin("sports", "users.sport_id", "sports.id")
      //.where("users.sport_id", "=", +sportId)
      //.select(["users.name", "sports.name as sport_name", "users.experience_level"])
      .execute();

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching filtered users");
  }
});
