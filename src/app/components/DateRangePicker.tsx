"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Props = {
  defaultStart: string;
  defaultEnd: string;
};

const cities = ["New York", "Tel Aviv"];

export default function DateRangePicker({ defaultStart, defaultEnd }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [city, setCity] = useState(params.get("city") || "New York");
  const [error, setError] = useState<string | null>(null);

  const handleChange = () => {
    const today = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!start || !end) {
      setError("Both start and end dates are required.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    if (endDate > today) {
      setError("End date cannot be in the future.");
      return;
    }

    setError(null);
    const newParams = new URLSearchParams();
    newParams.set("start", start);
    newParams.set("end", end);
    newParams.set("city", city);
    router.push(`/?${newParams.toString()}`);
  };

  useEffect(() => {
    const spStart = params.get("start");
    const spEnd = params.get("end");

    const isValidDate = (s: string | null) =>
      !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s).getTime());

    if (isValidDate(spStart) && isValidDate(spEnd)) {
      setStart(spStart!);
      setEnd(spEnd!);
    } else {
      router.replace("/");
    }

    const spCity = params.get("city");
    if (spCity && cities.includes(spCity)) {
      setCity(spCity);
    }
  }, [params, router]);

  const today = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  const isValid = !!start && !!end && startDate <= endDate && endDate <= today;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <label className="text-sm font-medium text-gray-700">
          Start Date
          <input
            type="date"
            className="ml-2 border border-gray-300 rounded px-2 py-1 bg-white text-black"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          End Date
          <input
            type="date"
            className="ml-2 border border-gray-300 rounded px-2 py-1 bg-white text-black"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          City
          <select
            className="ml-2 border border-gray-300 rounded px-2 py-1 bg-white text-black"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <button
          className={`px-4 py-2 rounded shadow text-white transition-colors ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isValid}
          onClick={handleChange}
        >
          Apply
        </button>
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-2 text-center">{error}</div>
      )}
    </div>
  );
}
