//soal
//1. buat 1 objek mahasiswa terdiri dari nim dan nama
//2. buat array object listMatkul, tiap objek terdiri dari matkulId, nilai dan matkulNama
//3. spread array listMatkul ke dalam objek mahasiswa
//4. tampilkan dengan literal, output biodata mahasiswa dan matkul yang di ambil

//jawaban 
mahasiswa = {
    nim: "a1111",
    nama: "nando"
}

//jawaban
listMatkul = [
    {
        matkulId: "1A1",
        nilai: 85,
        matkulNama: "Pemprograman Sisi Klien"
    },
    {
        matkulId: "1A2",
        nilai: 90,
        matkulNama: "Pemprograman Sisi Server"
    },
    {
        matkulId: "1A3",
        nilai: 95,
        matkulNama: "Kalkulus"
    }
]

//jawaban

mahasiswa = { 
    ...mahasiswa,
    ...listMatkul
}

//jawaban
console.log(mahasiswa)


//tampilkan 3 tabel dengan 1 data