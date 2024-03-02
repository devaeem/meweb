import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content, categoryId } = await req.json();
    const post = await prisma.post.update({
      where: { id: params.id },
      data: { title, content, categoryId },
    });
    return Response.json(post);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isdelete } = await req.json();
    return Response.json(
      await prisma.post.update({
        where: { id: params.id },
        data: { isdelete },
      })
    );
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}
