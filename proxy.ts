import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";
import { parse } from "set-cookie-parser";

export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPrivateRoute && !accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const response = await checkSession();

    if (!response?.data) {
      const redirectRes = NextResponse.redirect(new URL("/sign-in", req.url));
      redirectRes.cookies.delete("accessToken");
      redirectRes.cookies.delete("refreshToken");
      return redirectRes;
    }

    const setCookieHeader = response.headers?.["set-cookie"];
    const requestHeaders = new Headers(req.headers);

    if (setCookieHeader) {
      const parsedCookies = parse(setCookieHeader, { map: false });

      parsedCookies.forEach((cookie) => {
        req.cookies.set(cookie.name, cookie.value);
      });

      requestHeaders.set("cookie", req.cookies.toString());
    }

    const res = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    if (setCookieHeader) {
      const parsedCookies = parse(setCookieHeader, { map: false });

      parsedCookies.forEach((cookie) => {
        let sameSite: "strict" | "lax" | "none" | undefined;
        if (typeof cookie.sameSite === "string") {
          const lower = cookie.sameSite.toLowerCase();
          if (lower === "strict" || lower === "lax" || lower === "none") {
            sameSite = lower;
          }
        }

        res.cookies.set(cookie.name, cookie.value, {
          path: cookie.path,
          expires: cookie.expires,
          maxAge: cookie.maxAge,
          sameSite,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
        });
      });
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
