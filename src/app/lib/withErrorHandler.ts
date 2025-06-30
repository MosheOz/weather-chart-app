import { NextResponse } from "next/server";

export function withErrorHandler(handler: Function) {
  return async function (...args: any[]) {
    try {
      return await handler(...args);
    } catch (err: any) {
      console.error("Unhandled API error:", err);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  };
}
