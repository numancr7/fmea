import { NextAuthOptions } from "next-auth";
import User from "@/models/User";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Allow OTP login if password is 'otp' and user is verified
        if (credentials.password === 'otp') {
          if (user.emailVerified) {
            return {
              id: (user as any)._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              image: user.avatar?.url || undefined,
            };
          } else {
            throw new Error("Email not verified");
          }
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return fields to be stored in token
        return {
          id: (user as any)._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar?.url || undefined,
        };
      },
    }),
  ],

  callbacks: {
    // Add fields to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.email = user.email;
        token.image = user.image || undefined;
        // Fetch emailVerified from DB as boolean
        const dbUser = await User.findOne({ email: user.email });
        token.emailVerified = !!dbUser?.emailVerified;
      }
      return token;
    },

    // Pass token fields to the session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as "admin" | "user";
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        (session.user as any).emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
