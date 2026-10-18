import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

// Extract credentials and endpoint parameters from DATABASE_URL
// Format: mysql://user:pass@host:port/db or mysql://user@host:port/db or with options
const dbUrl = process.env.DATABASE_URL!;
const matches = dbUrl.match(/mysql:\/\/([^:]+):?([^@]+)?@([^:]+):(\d+)\/([^?]+)/);
if (!matches) throw new Error("Invalid DATABASE_URL format");

const [, user, password = "", host, port, database] = matches;

const adapter = new PrismaMariaDb({
  host,
  port: parseInt(port),
  connectionLimit: 10,
  user,
  password,
  database,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
