import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth, { SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, profile }: {
      token: JWT,
      profile?: any
    }) {
      if (profile) {
        await connectDB();
        let existingUser = await User.findOne({ email: profile.email });
    
        if (!existingUser) {
          const newUser = new User({
            name: profile.name,
            email: profile.email,
          });
          await newUser.save();
          existingUser = newUser;
        }
        token.userId = existingUser._id.toString();
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
