import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const res = await prisma.post.findMany({
      where: { isdelete: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const pattern = {
      data: {
        rows: res,
      },
    };

    return Response.json(pattern);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content, categoryId } = await req.json();
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        categoryId,
      },
    });
    return Response.json("Create Post sucessfuly");
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}
