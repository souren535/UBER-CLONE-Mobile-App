import { drizzle } from "drizzle-orm/neon-http";
const db = drizzle(process.env.EXPO_PUBLIC_DATABASE_URL!);
export default db;
