import { authOptions } from "./auth-options";
import nextAuth from "next-auth";

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };

declare module "next-auth" {
    interface User {
      id: string; 
      fullName: string;
      email: string;
      role: string; 
    }
  
    interface JWT {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  
    interface Session {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }