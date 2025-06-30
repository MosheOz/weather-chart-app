import { openDb } from "@/app/lib/db";
import { withErrorHandler } from "@/app/lib/withErrorHandler";
import { WeatherQuerySchema } from "@/app/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const parsed = WeatherQuerySchema.safeParse({
    start: searchParams.get("start"),
    end: searchParams.get("end"),
    city: searchParams.get("city") || "New York",
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid or missing query parameters",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { start, end, city } = parsed.data;
  const db = await openDb();

  try {
    const rows = await db.all(
      `
      SELECT DATE(time) as date,
             MIN(temperature) as min_temp,
             MAX(temperature) as max_temp
      FROM temperature_hourly
      WHERE city = ?
        AND DATE(time) BETWEEN ? AND ?
      GROUP BY DATE(time)
      ORDER BY DATE(time)
      `,
      city,
      start,
      end
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("DB query error:", (error as Error)?.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await db.close();
  }
});
