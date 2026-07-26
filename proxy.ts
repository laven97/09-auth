import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { checkSession } from "./lib/api/serverApi";
import { parseSetCookie } from "set-cookie-parser";

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
          const redirectRes = NextResponse.redirect(
            new URL("/sign-in", req.url)
          );
          redirectRes.cookies.delete("accessToken");
          redirectRes.cookies.delete("refreshToken");
          return redirectRes;
        }

        const res = NextResponse.next();
        const setCookieHeader = response.headers?.["set-cookie"];

        if (setCookieHeader) {
          const cookiesArray = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          const parsedCookie = parseSetCookie(cookiesArray);

          parsedCookie.forEach((cookie) => {
            res.cookies.set(cookie.name, cookie.value, {
              path: cookie.path,
              expires: cookie.expires,
              maxAge: cookie.maxAge,
              sameSite: cookie.sameSite as
                | "strict"
                | "lax"
                | "none"
                | undefined,
            });
          });
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
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
