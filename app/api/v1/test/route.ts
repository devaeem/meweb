import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
export async function GET(request: any) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (user) {
    // Signed in
    return Response.json({ user });
  } else {
    // Not Signed in
    return Response.json("not token");
  }
}
