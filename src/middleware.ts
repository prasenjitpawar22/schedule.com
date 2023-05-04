import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie =
    process.env.VERCEL !== undefined
      ? request.cookies.get("__Secure-next-auth.session-token")
      : request.cookies.get("next-auth.session-token");

  console.log(sessionCookie);

  if (sessionCookie === undefined) {
    return NextResponse.rewrite(new URL("/api/auth/signin", request.url));
  }
}
// api/auth/signin
export const config = { matcher: ["/events/:path*", "/settings/:path*"] };
