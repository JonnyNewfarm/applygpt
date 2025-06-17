import { hash } from "bcrypt";
import  prisma  from "../lib/prisma";

async function main() {
  const password = await hash("test1234", 10);
  await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Jonas",
      password,
    },
  });
}

main().catch(e => console.error(e));
