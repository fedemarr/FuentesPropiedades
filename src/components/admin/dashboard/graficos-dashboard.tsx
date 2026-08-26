"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORES_PIE = ["#1B3A5C", "#E63946", "#457B9D", "#F4A261", "#2A9D8F"];

interface Props {
  consultasPorMes: { mes: string; cantidad: number }[];
  propiedadesTop: { titulo: string; vistas: number }[];
  estadoPropiedades: { estado: string; cantidad: number }[];
}

export function GraficosDashboard({
  consultasPorMes,
  propiedadesTop,
  estadoPropiedades,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Consultas por mes */}
      <div className="lg:col-span-2 rounded-fp-lg border border-fp-line bg-white p-5 shadow-fp-sm">
        <h3 className="text-fp-body font-semibold text-fp-ink mb-4">
          Consultas por mes
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={consultasPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 13,
              }}
            />
            <Bar dataKey="cantidad" fill="#E63946" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Estado propiedades */}
      <div className="rounded-fp-lg border border-fp-line bg-white p-5 shadow-fp-sm">
        <h3 className="text-fp-body font-semibold text-fp-ink mb-4">
          Estado de propiedades
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={estadoPropiedades}
              dataKey="cantidad"
              nameKey="estado"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {estadoPropiedades.map((_, i) => (
                <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top propiedades más vistas */}
      <div className="lg:col-span-3 rounded-fp-lg border border-fp-line bg-white p-5 shadow-fp-sm">
        <h3 className="text-fp-body font-semibold text-fp-ink mb-4">
          Top 5 propiedades más vistas
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={propiedadesTop} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis
              type="category"
              dataKey="titulo"
              width={220}
              tick={{ fontSize: 12 }}
              stroke="#94A3B8"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                fontSize: 13,
              }}
            />
            <Bar dataKey="vistas" fill="#1B3A5C" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
