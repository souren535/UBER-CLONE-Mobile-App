import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { usersTable } from "../src/db/schema";

dotenv.config();

const db = drizzle(process.env.EXPO_PUBLIC_DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { name, email, clerkId } = await req.json();
    if (!name || !email || !clerkId) {
      return new Response("Missing required fields", { status: 400 });
    }
    const response = await db
      .insert(usersTable)
      .values({ name, email, clerk_id: clerkId });
    return new Response(JSON.stringify({ data: response }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
