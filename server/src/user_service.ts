import { db } from "./database.js";

export class UserService {
    async findById(id: number) {
        const user = await db
        .selectFrom("users")
        .where("users.id", "=", +id)
        .leftJoin("sports", "users.sport_id", "sports.id")
        .select(["users.name", "sports.name as sport_name"])
        .executeTakeFirstOrThrow();
        return user;
    }}
    export const userService = new UserService();