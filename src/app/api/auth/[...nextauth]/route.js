import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  site: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Só permite login se o e-mail bater com o dono do site
    async signIn({ user }) {
      return user.email === process.env.ADMIN_EMAIL;
    },
  },
});

export { handler as GET, handler as POST };