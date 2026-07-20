import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { cookies } from "next/headers";

import { api } from "../../api";
import { ApiError } from "@/lib/api/api";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const apiRes = await api.post("auth/login", body);

    const cookieStore = await cookies();
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
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
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
}
