import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt-ts";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && (await compare(credentials.password, user.password))) {
          return {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
          };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user, account }: any) => {
      if (account) {
        token.accessToken = account.access_token;
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fullname = user.fullname;
      }
      return { ...token };
    },
    session: async ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.fullname = token.fullname;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  } as any,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
