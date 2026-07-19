import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { api, ApiError } from "../../api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/auth/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
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
