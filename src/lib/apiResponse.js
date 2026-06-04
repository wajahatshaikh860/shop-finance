import { NextResponse } from "next/server";

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function message(text, status = 200) {
  return json({ message: text }, status);
}
