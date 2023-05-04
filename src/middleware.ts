import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("next-auth.session-token");

  if (sessionCookie === undefined) {
    return NextResponse.rewrite(new URL("/api/auth/signin", request.url));
  }
}
// api/auth/signin
export const config = { matcher: ["/events/:path*", "/settings/:path*"] };
