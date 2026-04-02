const nim = "01010101"
const list_nim = ["01010101","01010102","01010103"]
const mahasiswa = {
    nim: "12345",
    nama: "Rosin Adin",
    status: true,
    matkul: [
        
        {
            matkulId: "11123",
            nilai: 100
        },
        {
            matkulId: "11123",
            nilai: 100
        },

    ]

}

console.log(mahasiswa)

const list_Mahasiswa = [
    {
        nim: "a1122222",
        nama: "carman",
        matkul: [
            {
                id: 1,
                nama: "fisikaDasar"
            },
            {
                id: 2,
                nama: "fisikaDasar"
            }
        ]
    },
    {
        nim: "a1122222",
        nama: "carman",
        matkul: [
            {
                id: 1,
                nama: "fisikaDasar"
            },
            {
                id: 2,
                nama: "fisikaDasar"
            }
        ]
    }
]

console.log(list_Mahasiswa)



const { nama, umur, status} = mahasiswa;
console.log("Nama: $(nama) umur: $()")




const listmahasiswa = [
    {nim: "1234", nama: "danus", umur: 25, status: true},
    {nim: "1234", nama: "danu", umur: 22, status: true},
    {nim: "1234", nama: "danas", umur: 43, status: false},
    {nim: "1234", nama: "danis", umur: 21, status: true},
]








const newlistmahasiswa = [
    ...list_Mahasiswa,
    ...listmahasiswa
]


console.log(newlistmahasiswa)

//latihan soal 