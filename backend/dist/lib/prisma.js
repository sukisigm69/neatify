"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const client_1 = require("@prisma/client");
// Extract credentials and endpoint parameters from DATABASE_URL
// Format: mysql://user:pass@host:port/db or mysql://user@host:port/db or with options
const dbUrl = process.env.DATABASE_URL;
const matches = dbUrl.match(/mysql:\/\/([^:]+):?([^@]+)?@([^:]+):(\d+)\/([^?]+)/);
if (!matches)
    throw new Error("Invalid DATABASE_URL format");
const [, user, password = "", host, port, database] = matches;
const adapter = new adapter_mariadb_1.PrismaMariaDb({
    host,
    port: parseInt(port),
    connectionLimit: 10,
    user,
    password,
    database,
});
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
//# sourceMappingURL=prisma.js.map