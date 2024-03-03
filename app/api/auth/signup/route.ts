import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, fristname, lastname } = await req.json();
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fristname,
        lastname,
        fullname: fristname + " " + lastname,
      },
    });
    return Response.json({ message: "User created", user });
  } catch (error) {
    return Response.json({ error: "User could not be created" });
  }
}
