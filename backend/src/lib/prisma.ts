import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

// Format: mysql://user:pass@host:port/db or mysql://user@host:port/db or with options
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL is not set");

let connectionUrl: URL;
try {
  connectionUrl = new URL(dbUrl);
} catch {
  throw new Error("DATABASE_URL must be a valid MySQL connection URL");
}

if (connectionUrl.protocol !== "mysql:") {
  throw new Error("DATABASE_URL must use the mysql:// protocol");
}

const host = connectionUrl.hostname;
const port = Number(connectionUrl.port || 3306);
const database = decodeURIComponent(connectionUrl.pathname.slice(1));
const user = decodeURIComponent(connectionUrl.username);
const password = decodeURIComponent(connectionUrl.password);

if (!host || !database || !user) {
  throw new Error("DATABASE_URL must include a username, host, and database");
}

const adapter = new PrismaMariaDb({
  host,
  port,
  connectionLimit: 10,
  user,
  password,
  database,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
