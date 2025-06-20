import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only allow access to barber routes if user is authenticated
        if (req.nextUrl.pathname.startsWith('/barber') && 
            !req.nextUrl.pathname.startsWith('/barber/login')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/barber/:path*'],
};
