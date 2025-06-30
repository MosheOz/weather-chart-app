"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WeatherData } from "@/app/types";
import { getLast30DaysRange } from "@/app/lib/utils"; // 👈 adjust path as needed

export default function WeatherChart() {
  const params = useSearchParams();
  const router = useRouter();

  const { start: defaultStart, end: defaultEnd } = getLast30DaysRange();

  const start = params.get("start") || defaultStart;
  const end = params.get("end") || defaultEnd;
  const city = params.get("city") || "New York";

  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Redirect to defaults if missing
  useEffect(() => {
    const hasStart = params.get("start");
    const hasEnd = params.get("end");

    if (!hasStart || !hasEnd) {
      const newParams = new URLSearchParams(params);
      newParams.set("start", start);
      newParams.set("end", end);
      router.replace(`/?${newParams.toString()}`);
    }
  }, [params, router, start, end]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/weather?start=${start}&end=${end}&city=${city}`
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${errorText}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(
          "Failed to load weather data. Please check the date range or try again later."
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [start, end, city]);

  if (loading)
    return <p className="text-center text-blue-600">Loading chart...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  if (data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No data available for the selected range.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="min_temp"
          stroke="#8884d8"
          name="Min Temp"
        />
        <Line
          type="monotone"
          dataKey="max_temp"
          stroke="#82ca9d"
          name="Max Temp"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
