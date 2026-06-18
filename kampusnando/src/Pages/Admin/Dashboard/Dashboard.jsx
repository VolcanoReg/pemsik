import React from "react";
import Heading from "@/Pages/Admin/Components/Heading";
import Card from "@/Pages/Admin/Components/Card";
import { useChart } from "@/Utils/Hooks/useChart";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Dashboard = () => {
  const { data: chartData, isLoading, isError } = useChart();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-600 font-medium text-lg animate-pulse">
          Memuat data Dashboard...
        </div>
      </div>
    );
  }

  if (isError || !chartData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 font-medium text-lg">
          Gagal memuat data Dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Heading as="h1" align="left" color="text-gray-800" className="mb-2">
          Dashboard Visualisasi Akademik
        </Heading>
        <p className="text-gray-500 text-sm">
          Ringkasan visual data dan statistik akademik universitas.
        </p>
      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Bar Chart: Mahasiswa per Fakultas */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Mahasiswa per Fakultas</h3>
            <p className="text-gray-400 text-xs">Perbandingan populasi mahasiswa antar fakultas.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.students}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="faculty" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  name="Jumlah Mahasiswa"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Pie Chart: Rasio Gender Mahasiswa */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Rasio Gender Mahasiswa</h3>
            <p className="text-gray-400 text-xs">Proporsi mahasiswa berdasarkan jenis kelamin.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.genderRatio}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={85}
                  dataKey="count"
                  nameKey="gender"
                >
                  {chartData.genderRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Line Chart: Tren Pendaftaran Baru */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Tren Pendaftaran Baru</h3>
            <p className="text-gray-400 text-xs">Tren pendaftaran mahasiswa baru tahunan.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.registrations}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  name="Total Pendaftar"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 4. Radar Chart: Sebaran Nilai Mata Kuliah */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Sebaran Nilai Mata Kuliah</h3>
            <p className="text-gray-400 text-xs">Analisis sebaran nilai rata-rata mata kuliah.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData.gradeDistribution}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Radar
                  name="Nilai A"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Nilai B"
                  dataKey="B"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 5 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 5. Area Chart: Distribusi Jabatan Akademik Dosen (Spans 2 columns) */}
        <Card className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Distribusi Jabatan Akademik Dosen</h3>
            <p className="text-gray-400 text-xs">Komposisi jabatan fungsional dosen universitas.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData.lecturerRanks}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="rank" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  name="Jumlah Dosen"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
