import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";

import { api } from "../../api";
import { ApiError } from "@/lib/api/api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken) {
      return NextResponse.json({ success: true });
    }
    if (refreshToken) {
      const apiRes = await api.get("auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const setCookie = apiRes.headers["set-cookie"];
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.expires ? new Date(parsed.expires) : undefined,
            path: parsed.path,
            maxAge: Number(parsed["Max-Age"]),
          };

          if (parsed.accessToken) {
            cookieStore.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            cookieStore.set("refreshToken", parsed.refreshToken, options);
          }
          if (parsed.sessionId) {
            cookieStore.set("sessionId", parsed.sessionId, options);
          }
        }
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          (error as ApiError).response?.data?.error ??
          (error as ApiError).message,
      },
      { status: (error as ApiError).status }
    );
  }

  return NextResponse.json({ success: false });
}
