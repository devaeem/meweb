import { type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userToken = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  try {
    const session = await getServerSession(authOptions);

    console.log("session", session);

    if (!userToken) {
      const notPage = {
        msg: "not token",
      };

      return Response.json(notPage);
    }
    const searchParams = req.nextUrl.searchParams;

    if (!searchParams.get("page")) {
      const notPage = {
        msg: "filed page  require",
      };

      return Response.json(notPage);
    }

    if (!searchParams.get("pageSize")) {
      const notPageSize = {
        msg: "filed pageSize  require",
      };

      return Response.json(notPageSize);
    }

    const page: number = parseInt(searchParams.get("page") || "1", 10);
    const pageSize: number = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || "";

    console.log("first", { page, pageSize, search });

    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: {
          isdelete: true,
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
      prisma.post.count({ where: { isdelete: true } }),
    ]);
    //sds
    const totalPages = Math.ceil(totalCount / pageSize);

    const pattern = {
      data: {
        rows,
        pagination: {
          currentPage: page,
          pageSize,
          totalPages,
          totalCount,
        },
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
