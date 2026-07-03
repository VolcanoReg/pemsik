import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file manually
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL || env.supabase_url;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.supabase_publishable_key;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Supabase URL or Anon Key is missing in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dbFolder = path.join(__dirname, "db");

async function migrateTable(fileName, tableName, transformFn = (x) => x) {
  const filePath = path.join(dbFolder, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File ${fileName} tidak ditemukan, melewati...`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const data = Array.isArray(rawData) ? rawData : [rawData];
  const transformedData = data.map(transformFn);

  console.log(`Mengunggah ${transformedData.length} baris ke tabel '${tableName}'...`);

  // Hapus semua data lama terlebih dahulu agar bersih
  const { error: deleteError } = await supabase.from(tableName).delete().neq("id", -1);
  if (deleteError) {
    // Jika primary key bukan integer (misal tabel charts yang key-nya text), sesuaikan query
    await supabase.from(tableName).delete().not("key", "eq", "dummy_non_existent");
  }

  const { error: insertError } = await supabase.from(tableName).insert(transformedData);
  if (insertError) {
    console.error(`Gagal mengunggah data ke '${tableName}':`, insertError.message);
  } else {
    console.log(`Berhasil mengunggah data ke '${tableName}'!`);
  }
}

async function startMigration() {
  try {
    // 1. Mahasiswa
    await migrateTable("mahasiswa.json", "mahasiswa");

    // 2. Dosen
    await migrateTable("dosen.json", "dosen");

    // 3. Mata Kuliah
    await migrateTable("matakuliah.json", "matakuliah");

    // 4. Kelas
    await migrateTable("kelas.json", "kelas", (item) => {
      return {
        id: item.id,
        nama: item.nama,
        matakuliahId: item.matakuliahId || parseInt(item.mata_kuliah_id),
        dosenId: item.dosenId || parseInt(item.dosen_id),
        mata_kuliah_id: String(item.mata_kuliah_id || item.matakuliahId),
        dosen_id: String(item.dosen_id || item.dosenId),
        mahasiswa_ids: item.mahasiswa_ids || []
      };
    });

    // 5. User
    await migrateTable("user.json", "users", (item) => {
      return {
        id: String(item.id),
        name: item.name,
        email: item.email,
        password: item.password,
        role: item.role,
        permission: item.permission || []
      };
    });

    // 6. Chart (simpan sebagai key-value)
    const chartPath = path.join(dbFolder, "chart.json");
    if (fs.existsSync(chartPath)) {
      const chartData = JSON.parse(fs.readFileSync(chartPath, "utf-8"));
      console.log("Mengunggah data chart ke tabel 'charts'...");
      
      // Hapus data lama
      await supabase.from("charts").delete().eq("key", "chart");
      
      const { error: insertError } = await supabase.from("charts").insert({
        key: "chart",
        data: chartData
      });
      if (insertError) {
        console.error("Gagal mengunggah data chart:", insertError.message);
      } else {
        console.log("Berhasil mengunggah data chart!");
      }
    }

    console.log("\nMigrasi selesai!");
  } catch (err) {
    console.error("Terjadi kesalahan saat migrasi:", err);
  }
}

startMigration();
