
function Contoh1(){
    return <div>
        <button>Test1</button>
    </div>
}

function IsiArtikel({nama,isi}){
    return <tr>
        <td>{nama}</td>
        <td>{isi}</td>
    </tr>
}

function Artikel(){
    return <div>
        <table>
            <th>Nama Artikel</th>
            <th>Isi Artikel</th>
            <IsiArtikel nama="ES TEH TERENAK DI DUNIA" isi="BERITA TERHANGET"/>
            <IsiArtikel nama="ES TEH TERENAK DI DUNIA" isi="BERITA TERHANGET"/>
            <IsiArtikel nama="ES TEH TERENAK DI DUNIA" isi="BERITA TERHANGET"/>
        </table>
    </div>
}

function Nama({nama}){
    return <h1>{nama}</h1>
}

function Nim({nim}){
    return <h3>{nim}</h3>
}

function Mhs(){
    const mahasiswa = [
        {
            nama: "Nando",
            nim: "A11.2023.11111"
        },
        {
            nama: "Danu",
            nim: "A11.2023.11112"
        },
        {
            nama: "Nandoa",
            nim: "A11.2023.11113"
        }
    ]

    return <div>
        <Nama nama={mahasiswa[0].nama}/>
        <Nim nim={mahasiswa[0].nim}/>
        <Nama nama={mahasiswa[1].nama}/>
        <Nim nim={mahasiswa[1].nim}/>
        <Nama nama={mahasiswa[2].nama}/>
        <Nim nim={mahasiswa[2].nim}/>
    </div>
}

function App(){
    return <div>
        <h1>Halo dek </h1>
        <Artikel/>
        <Mhs/>
    </div>
}


export default App;