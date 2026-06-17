import React from "react";
import { useMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useDosen } from "@/Utils/Hooks/useDosen";
import { useKelas } from "@/Utils/Hooks/useKelas";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

const Dashboard = () => {
  // Queries
  const { data: mahasiswaRes, isLoading: isMhsLoading } = useMahasiswa({});
  const { data: dosenRes, isLoading: isDosenLoading } = useDosen({});
  const { data: kelasRes, isLoading: isKelasLoading } = useKelas({});
  const { data: matkulRes, isLoading: isMatkulLoading } = useMataKuliah({});

  const mahasiswa = mahasiswaRes?.data || [];
  const dosen = dosenRes?.data || [];
  const kelas = kelasRes?.data || [];
  const mataKuliah = matkulRes?.data || [];

  const isLoading = isMhsLoading || isDosenLoading || isKelasLoading || isMatkulLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-600 font-medium text-lg animate-pulse">
          Memuat Data Statistik...
        </div>
      </div>
    );
  }

  // Ringkasan Statistik
  const stats = [
    {
      label: "Total Mahasiswa",
      value: mahasiswa.length,
      icon: "🎓",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      label: "Total Dosen",
      value: dosen.length,
      icon: "👨‍🏫",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      label: "Total Mata Kuliah",
      value: mataKuliah.length,
      icon: "📚",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      label: "Total Kelas Aktif",
      value: kelas.length,
      icon: "🏫",
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  // --- CHART 1 DATA: Beban SKS Dosen ---
  // Ambil 6 dosen teratas dan hitung beban SKS yang sedang mereka ajar
  const dosenSksLoad = dosen.slice(0, 6).map((d) => {
    const totalSks = kelas
      .filter((k) => String(k.dosen_id || k.dosenId) === String(d.id))
      .reduce((sum, k) => {
        const mk = mataKuliah.find((m) => String(m.id) === String(k.mata_kuliah_id || k.matakuliahId));
        return sum + (mk?.sks || 0);
      }, 0);
    // Bersihkan gelar akademik dosen untuk label X-axis agar lebih ringkas
    const shortName = d.nama.split(",")[0].replace(/^(Dr\.|Prof\.)\s*/i, "");
    return {
      name: shortName,
      fullName: d.nama,
      totalSks,
      maxSks: d.max_sks || 12,
    };
  });

  const chart1MaxVal = Math.max(
    ...dosenSksLoad.map((d) => Math.max(d.totalSks, d.maxSks)),
    12
  );

  // --- CHART 2 DATA: Distribusi Limit SKS Mahasiswa ---
  const mhs24 = mahasiswa.filter((m) => m.max_sks === 24).length;
  const mhs20 = mahasiswa.filter((m) => m.max_sks === 20).length;
  const mhsOther = mahasiswa.length - mhs24 - mhs20;
  const mhsTotal = mahasiswa.length || 1;

  const pct24 = ((mhs24 / mhsTotal) * 100).toFixed(1);
  const pct20 = ((mhs20 / mhsTotal) * 100).toFixed(1);
  const pctOther = ((mhsOther / mhsTotal) * 100).toFixed(1);

  // Perhitungan donut stroke dashes
  const donutRadius = 60;
  const donutCircumference = 2 * Math.PI * donutRadius; // 376.99
  const offset24 = 0;
  const stroke24 = (mhs24 / mhsTotal) * donutCircumference;
  const offset20 = -stroke24;
  const stroke20 = (mhs20 / mhsTotal) * donutCircumference;
  const offsetOther = -(stroke24 + stroke20);
  const strokeOther = (mhsOther / mhsTotal) * donutCircumference;

  // --- CHART 3 DATA: Kepadatan Peserta Kelas ---
  const kelasPopuler = kelas
    .map((k) => {
      const matkul = mataKuliah.find((m) => String(m.id) === String(k.mata_kuliah_id || k.matakuliahId));
      return {
        nama: k.nama || (matkul ? matkul.nama : `Kelas ${k.id}`),
        count: (k.mahasiswa_ids || []).length,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const chart3MaxCount = Math.max(...kelasPopuler.map((c) => c.count), 5);

  return (
    <div className="space-y-8">
      <div>
        <Heading as="h1" align="left" color="text-gray-800" className="mb-2">
          Dashboard Akademik
        </Heading>
        <p className="text-gray-500 text-sm">
          Selamat datang di panel manajemen akademik. Berikut adalah ringkasan performa hari ini.
        </p>
      </div>

      {/* Grid Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <h3 className="text-3xl font-extrabold text-gray-800">{s.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-2xl shadow-sm`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: Beban Kerja Dosen (Vertical Bar Chart) */}
        <Card className="flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Beban Kerja Dosen</h3>
            <p className="text-gray-400 text-xs">
              Perbandingan akumulasi SKS mengajar (batang) vs batas SKS maksimum (garis merah).
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center p-2">
            <svg viewBox="0 0 500 300" className="w-full h-auto">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                const yVal = 240 - p * 200;
                const label = Math.round(p * chart1MaxVal);
                return (
                  <g key={i} className="opacity-30">
                    <line x1="50" y1={yVal} x2="480" y2={yVal} stroke="#94a3b8" strokeDasharray="4 4" />
                    <text x="35" y={yVal + 4} textAnchor="end" className="text-[10px] fill-slate-500 font-medium">{label}</text>
                  </g>
                );
              })}

              {/* Bars */}
              {dosenSksLoad.map((d, idx) => {
                const barWidth = 32;
                const spacing = 70;
                const x = 70 + idx * spacing;
                const barHeight = (d.totalSks / chart1MaxVal) * 200;
                const y = 240 - barHeight;
                const limitY = 240 - (d.maxSks / chart1MaxVal) * 200;

                return (
                  <g key={idx} className="group">
                    {/* Background hover indicator */}
                    <rect x={x - 10} y="30" width={barWidth + 20} height="220" fill="transparent" className="hover:fill-slate-50/50 transition-colors duration-200" />
                    
                    {/* Actual SKS Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 2)}
                      rx="4"
                      className="fill-blue-600 hover:fill-blue-700 transition-colors duration-200"
                    />

                    {/* Capacity Indicator Line */}
                    <line
                      x1={x - 6}
                      y1={limitY}
                      x2={x + barWidth + 6}
                      y2={limitY}
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />

                    {/* Value Labels */}
                    <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[10px] font-bold fill-blue-700">{d.totalSks} SKS</text>

                    {/* X-axis Labels */}
                    <text
                      x={x + barWidth / 2}
                      y="260"
                      textAnchor="middle"
                      className="text-[9px] fill-slate-600 font-semibold"
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
              <line x1="50" y1="240" x2="480" y2="240" stroke="#94a3b8" strokeWidth="1" />
            </svg>
          </div>
        </Card>

        {/* CHART 2: Distribusi Limit SKS Mahasiswa (Donut Chart) */}
        <Card className="flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">Limit SKS Mahasiswa</h3>
            <p className="text-gray-400 text-xs">
              Persentase pembagian kapasitas SKS mahasiswa aktif.
            </p>
          </div>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-around p-4 gap-6">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
                {/* Background Circle */}
                <circle cx="80" cy="80" r={donutRadius} fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                
                {/* 24 SKS Limit slice */}
                {mhs24 > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="16"
                    strokeDasharray={`${stroke24} ${donutCircumference}`}
                    strokeDashoffset={offset24}
                    className="transition-all duration-300 hover:stroke-[18px]"
                  />
                )}

                {/* 20 SKS Limit slice */}
                {mhs20 > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    strokeDasharray={`${stroke20} ${donutCircumference}`}
                    strokeDashoffset={offset20}
                    className="transition-all duration-300 hover:stroke-[18px]"
                  />
                )}

                {/* Other/Unset slice */}
                {mhsOther > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="transparent"
                    stroke="#94a3b8"
                    strokeWidth="16"
                    strokeDasharray={`${strokeOther} ${donutCircumference}`}
                    strokeDashoffset={offsetOther}
                    className="transition-all duration-300 hover:stroke-[18px]"
                  />
                )}
              </svg>
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-5 shadow-inner">
                <span className="text-2xl font-black text-gray-800">{mahasiswa.length}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mhs</span>
              </div>
            </div>

            {/* Legends */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-md bg-emerald-500 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-700">Limit 24 SKS</div>
                  <div className="text-[10px] text-gray-400">{mhs24} Mahasiswa ({pct24}%)</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-md bg-amber-500 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-700">Limit 20 SKS</div>
                  <div className="text-[10px] text-gray-400">{mhs20} Mahasiswa ({pct20}%)</div>
                </div>
              </div>
              {mhsOther > 0 && (
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-md bg-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-gray-700">Lainnya</div>
                    <div className="text-[10px] text-gray-400">{mhsOther} Mahasiswa ({pctOther}%)</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* CHART 3: Kepadatan Kelas (Horizontal Bar Chart) */}
      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">Tingkat Kepadatan Kelas</h3>
          <p className="text-gray-400 text-xs">
            Daftar 5 kelas terpadat berdasarkan jumlah mahasiswa yang terdaftar di dalamnya.
          </p>
        </div>
        <div className="p-2">
          {kelasPopuler.length === 0 ? (
            <div className="text-center py-8 text-gray-400 italic text-sm">
              Belum ada data pendaftaran mahasiswa di kelas.
            </div>
          ) : (
            <svg viewBox="0 0 600 240" className="w-full h-auto">
              {kelasPopuler.map((c, idx) => {
                const barHeight = 24;
                const spacing = 42;
                const y = 20 + idx * spacing;
                const maxBarWidth = 380;
                const barWidth = (c.count / chart3MaxCount) * maxBarWidth;

                return (
                  <g key={idx}>
                    {/* Class Name Label */}
                    <text
                      x="160"
                      y={y + 16}
                      textAnchor="end"
                      className="text-[10px] font-bold fill-slate-700"
                    >
                      {c.nama.length > 22 ? `${c.nama.substring(0, 20)}...` : c.nama}
                    </text>

                    {/* Bar Background Track */}
                    <rect x="180" y={y} width={maxBarWidth} height={barHeight} rx="6" fill="#f1f5f9" />

                    {/* Enrollment Bar */}
                    <rect
                      x="180"
                      y={y}
                      width={Math.max(barWidth, 6)}
                      height={barHeight}
                      rx="6"
                      className="fill-emerald-500 hover:fill-emerald-600 transition-colors duration-200"
                    />

                    {/* Count Text */}
                    <text
                      x={180 + Math.max(barWidth, 6) + 8}
                      y={y + 16}
                      className="text-[10px] font-extrabold fill-emerald-800"
                    >
                      {c.count} Mahasiswa
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
