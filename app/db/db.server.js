// app/db/db.server.js
import { PrismaClient } from "@prisma/client";

let db;
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
db = global.prisma;

export default db;
