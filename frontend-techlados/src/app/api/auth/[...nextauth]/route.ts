import { getUserModel } from "@/models/user";
import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const User = await getUserModel();
        const userFound = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!userFound) throw new Error("Credenciales invalidas");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error("Credenciales invalidas");

        return userFound;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user, account, profile }: {
      token: JWT,
      user?: any,
      account?: any,
      profile?: any
    }) {
      if (account && profile) {
        const User = await getUserModel();
        let existingUser = await User.findOne({ email: profile.email });
    
        if (!existingUser) {
          const newUser = new User({
            name: profile.name,
            email: profile.email,
            avatar: "default.png",
            password: null,
            typeSign: "google",
          });
          await newUser.save();
          existingUser = newUser;
        }
        token.userId = existingUser._id.toString();
      }

      if (user) {
        if (!token.userId) {
          token.userId = user.id.toString();
        }
        token.user = user;
      }
      return token;
    },
    async session({ session, token } : {
      session: Session,
      token: JWT
    }) {
      if (token.userId) {
        session.user = {
          ...session.user,
          _id: token.userId,
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
