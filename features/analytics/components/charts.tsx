"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TrendData = Array<{ date: string; count: number }>;
type TypeData = Array<{ type: string; count: number }>;
type StatusData = Array<{ name: string; count: number }>;

const PIE_COLORS: Record<string, string> = {
  Uploaded: "hsl(38 92% 50%)",
  Processing: "hsl(var(--primary))",
  Analyzed: "hsl(160 84% 39%)",
  Failed: "hsl(var(--destructive))",
};

const FALLBACK_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--destructive))",
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  color: "hsl(var(--foreground))",
};

export function TrendChart({ data }: { data: TrendData }) {
  const trendData = useMemo(
    () =>
      data.map((point, index) => {
        const start = Math.max(0, index - 6);
        const window = data.slice(start, index + 1);
        const average =
          window.reduce((sum, item) => sum + item.count, 0) / window.length;

        return {
          ...point,
          movingAverage: Number(average.toFixed(2)),
        };
      }),
    [data],
  );

  const xAxisInterval =
    trendData.length > 12 ? Math.floor(trendData.length / 8) : 0;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={trendData}
          margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.65}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            interval={xAxisInterval}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(
              value: number | string | undefined,
              name: string | number | undefined,
            ) => {
              const numericValue = Number(value ?? 0);
              if (name === "movingAverage") {
                return [numericValue.toFixed(1), "7-day avg"];
              }

              return [numericValue, "Uploads"];
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2.25}
            fillOpacity={1}
            fill="url(#trendFill)"
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="movingAverage"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ContractTypeChart({ data }: { data: TypeData }) {
  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data],
  );

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            horizontal={false}
          />
          <XAxis
            type="number"
            stroke="hsl(var(--muted-foreground))"
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="type"
            width={128}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={false}
            formatter={(value: number | string | undefined) => [
              Number(value ?? 0),
              "Files",
            ]}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {sortedData.map((item, index) => {
              const opacity = Math.max(0.35, 0.95 - index * 0.12);
              return (
                <Cell
                  key={`${item.type}-${index}`}
                  fill={`hsl(var(--primary) / ${opacity})`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ContractStatusChart({ data }: { data: StatusData }) {
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.count, 0),
    [data],
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-[76%] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={94}
              paddingAngle={3}
              dataKey="count"
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
                  fill={
                    PIE_COLORS[entry.name] ??
                    FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                  }
                />
              ))}
            </Pie>
            {total > 0 && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan
                  x="50%"
                  y="50%"
                  className="fill-foreground text-base font-semibold"
                >
                  {total}
                </tspan>
                <tspan
                  x="50%"
                  dy="16"
                  className="fill-muted-foreground text-[11px]"
                >
                  Files
                </tspan>
              </text>
            )}
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number | string | undefined) => [
                Number(value ?? 0),
                "Files",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        {data.map((item, index) => {
          const color =
            PIE_COLORS[item.name] ??
            FALLBACK_COLORS[index % FALLBACK_COLORS.length];

          return (
            <div
              key={`${item.name}-legend`}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/25 px-2.5 py-1.5"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[11px] text-muted-foreground truncate">
                {item.name}
              </span>
              <span className="ml-auto text-[11px] font-medium text-foreground">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
