import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("cook", request.cookies);

  const sessionCookie =
    process.env.VERCEL !== undefined
      ? request.cookies.get("__Secure-next-auth.session-token")
      : request.cookies.get("next-auth.session-token");
  console.info("sessionCookie", sessionCookie);
  if (sessionCookie === undefined) {
    return NextResponse.rewrite(new URL("/auth/signin", request.url));
  }
}
export const config = {
  matcher: [
    "/events/:path*",
    "/settings/:path*",
    "/teams/:path*",
    "/requests/:path",
  ],
};
