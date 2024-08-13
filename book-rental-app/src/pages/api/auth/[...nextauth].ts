import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import { query } from '../../../../lib/db'; // Adjust the path as necessary

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Query the database for the user
          const result = await query('SELECT * FROM users WHERE email = $1', [email]);
          const user = result.rows[0];

          if (user && await bcrypt.compare(password, user.password)) {
            // Return user object if credentials are correct
            return { id: user.id, name: user.name, email: user.email };
          } else {
            // Return null if credentials are incorrect
            return null;
          }
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub; 
      }
      return session;
    },
  },
});
