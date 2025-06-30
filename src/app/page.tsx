import WeatherChart from "./components/WeatherChart";
import DateRangePicker from "./components/DateRangePicker";
import { getLast30DaysRange } from "./lib/utils";

export default function Home() {
  const { start, end } = getLast30DaysRange();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto dark:bg-white rounded-xl shadow p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Weather Overview 🌤️
        </h1>
        <DateRangePicker defaultStart={start} defaultEnd={end} />
        <div>
          <WeatherChart />
        </div>
      </div>
    </main>
  );
}
