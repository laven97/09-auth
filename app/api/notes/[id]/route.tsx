import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { api, ApiError } from "../../api";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const cookieStorte = await cookies();
    const { id } = await params;
    const res = await api(`/notes/${id}`, {
      headers: {
        Cookies: cookieStorte.toString(),
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

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const res = await api.delete(`/notes/${id}`, {
      headers: {
        Cookies: cookieStore.toString(),
      },
    });
    return NextResponse.json({ status: res.status });
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

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    const body = await request.json();

    const res = await api.patch(`/notes/${id}`, body, {
      headers: {
        Cookies: cookieStore.toString(),
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
