import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { checkSession } from "./lib/api/serverApi";

export async function proxy(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPrivateRoute) {
    if (!accessToken) {
      if (refreshToken) {
        const response = await checkSession();

        if (!response?.data) {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        const res = NextResponse.next();
        const setCookieHeader = response.headers?.["set-cookie"];

        if (setCookieHeader) {
          const cookiesArray = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookiesArray.forEach((cookieStr) => {
            const cookie = parseSetCookie(cookieStr);

            if (cookie) {
              res.cookies.set(cookie);
            }
          });
        }

        if (isAuthRoute) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        return res;
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
