import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

// Export a function to get the db instance on-demand
export const getDb = () => {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error("DATABASE_URL not found");

	const sql = neon(url);
	return drizzle({ client: sql });
};
