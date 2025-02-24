import express from "express";
import type { RequestHandler, Request } from "express";
import { db } from "./database.js";
import * as bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt, { type JwtPayload } from "jsonwebtoken";
import cors from 'cors';
// import { userService } from "./user_service.js";
const app = express();
const port = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const generateToken = (userId: number) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
};

interface AuthRequest extends Request {
  userId: string;
}

const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    if (!req.cookies.jwt) res.sendStatus(401);
    const { userId } = jwt.verify(req.cookies.jwt, JWT_SECRET) as JwtPayload;
    (req as AuthRequest).userId = userId;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/matchup", authMiddleware, async (req, res) => {
  try {
    const user = await db
      .selectFrom("users")
      .where("users.id", "=", +(req as AuthRequest).userId)
      .selectAll()
      .executeTakeFirstOrThrow();

    if (!user.sport_id || !user.weight || !user.height || !user.experience) {
      res.sendStatus(400)
      return
    }

    // Define weight and height intervals (+- 10% of user's values)
    const weightInterval = {
      min: Math.round(user.weight * 0.9),
      max: Math.round(user.weight * 1.1)
    };
    const heightInterval = {
      min: Math.round(user.height * 0.9),
      max: Math.round(user.height * 1.1)
    };

    // Build query for matching users
    let query = db
      .selectFrom("users")
      .leftJoin("sports", "users.sport_id", "sports.id")
      // Exclude current user
      .where("users.id", "!=", user.id)
      // Match sport
      .where("users.sport_id", "=", user.sport_id)
      // Match experience level
      .where("users.experience", "=", user.experience)
      // Weight within interval
      .where("users.weight", ">=", weightInterval.min)
      .where("users.weight", "<=", weightInterval.max)
      // Height within interval
      .where("users.height", ">=", heightInterval.min)
      .where("users.height", "<=", heightInterval.max);

    const matchingUsers = await query
      .select([
        "users.id",
        "users.name",
        "sports.name as sport_name",
        "users.weight",
        "users.height",
        "users.experience"
      ])
      .execute();

    res.status(200).json(matchingUsers);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error finding matches" });
  }
});

app.get("/mutuallyliked", authMiddleware, async (req, res) => {
  try {
    const userId = +(req as AuthRequest).userId;

    const mutualLikes = await db
      .selectFrom("matchups as m1")
      .innerJoin("matchups as m2", (join) => 
        join.onRef("m1.liker", "=", "m2.liked")
          .onRef("m1.liked", "=", "m2.liker")
      )
      .innerJoin("users", "users.id", "m1.liked")
      .leftJoin("sports", "users.sport_id", "sports.id")
      .where("m1.liker", "=", userId)
      .select([
        "users.id",
        "users.name",
        "sports.name as sport_name",
        "users.weight",
        "users.height",
        "users.experience"
      ])
      .execute();

    res.status(200).json(mutualLikes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving mutual likes" });
  }
});
app.post("/like", authMiddleware, async (req, res) => {
  try {
    const likerId = +(req as AuthRequest).userId;
    const { likedId } = req.body;

    await db
      .insertInto("matchups")
      .values({
        liker: likerId,
        liked: likedId
      })
      .execute();

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving like" });
  }
});
// app.get("/users", async (req, res) => {
//   try {
//     const { sport_id, experience, weight, height } = req.query;
//     let query = db.selectFrom("users")
//       .leftJoin("sports", "users.sport_id", "sports.id");
//     if (sport_id) {
//       query = query.where("users.sport_id", "=", +sport_id);
//     }
//     if (experience) {
//       query = query.where("users.experience", "=", experience as string);
//     }
//     if (weight) {
//       query = query.where("users.weight", "=", +weight);
//     }
//     if (height) {
//       query = query.where("users.height", "=", +height);
//     }
//     const users = await query.select(["users.name", "sports.name as sport_name", "users.weight", "users.experience", "users.height"]).execute();
//     res.status(200).json(users);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error fetching user" });
//   }
// });

// app.get("/users/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     // const user = await db
//     //   .selectFrom("users")
//     //   .where("users.id", "=", +id)
//     //   .leftJoin("sports", "users.sport_id", "sports.id")
//     //   .select(["users.name", "sports.name as sport_name"])
//     //   .executeTakeFirstOrThrow();
//     const user = await userService.findById(+id);
//     res.status(200).json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error fetching user" });
//   }
// });

app.get("/users/profile-settings", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).userId;
  
  try {
    const userSettings = await db
      .selectFrom("users")
      .select(["sport_id", "weight", "height", "experience"])
      .where("id", "=", +userId)
      .executeTakeFirst();
      
    if (!userSettings) {
      res.status(404).json({ error: "User settings not found" });
      return;
    }
    
    res.json(userSettings);
  } catch (err) {
    console.error("Error fetching profile settings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/users/profile-settings", authMiddleware, async (req, res) => {
  const userId = (req as AuthRequest).userId
  const { weight, experience, height, sport_id } = req.body; // Вземаме полетата от тялото на заявката 

  try {
    await db
      .updateTable("users")
      .set({
        weight: weight,
        experience: experience,
        height: height,
        sport_id: sport_id,
      })
      .where("id", "=", +userId)
      .execute();

    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating user" });
  }
});


app.get("/sports", async (req, res) => {
  try {
    const sports = await db.selectFrom("sports").selectAll().execute();
    console.log("Fetched sports from DB:", sports); // Лог за проверка
    res.status(200).json(sports);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting sports" });
  }
});


app.get("/login", (req, res) => {
  try {
    jwt.verify(req.cookies.jwt, JWT_SECRET) as JwtPayload;
    res.status(200).send();
  } finally {
    // fallback if no cookie or wrong cookie or expired cookie
    res.status(401).send()
  }
})

app.post("/logout", (req, res) => {
  res.clearCookie("jwt").status(200).send()
})

app.post("/login", async (req, res) => {

  try {
    const { name, password } = req.body;

    const user = await db
      .selectFrom("users")
      .where("name", "=", name)
      .selectAll()
      .executeTakeFirstOrThrow();

    if (bcrypt.compareSync(password, user.hashed_password)) {
      const { hashed_password, ...viewUser } = user;
      // sending a session jwt cookie to the frontend. Adding user.id as content so we know which user is sending in requests
      const token = generateToken(user.id);
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
      res.status(200).json(viewUser);
    } else {
      throw Error("wrong password");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error logging in" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate required fields
    if (!name || !password) {
      res.status(400).json({ error: "Name and password are required" });
      return;
    }

    // Check if the user already exists
    const existingUser = await db
      .selectFrom("users")
      .where("name", "=", name)
      .select("id")
      .executeTakeFirst();

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
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
      .executeTakeFirstOrThrow();

    const { hashed_password, ...viewUser } = newUser;
    res.status(201).json({ message: "User registered successfully", user: viewUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error registering user" });
  }
});
app.get("/users/filter", async (req, res) => {
  try {
    const { sportId, experienceLevel } = req.query;

    const users = await db
      .selectFrom("users")
      .leftJoin("sports", "users.sport_id", "sports.id")
      .execute();

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching filtered users" });
  }
});


