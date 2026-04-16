import Mhs from './Mhs.jsx';

function IsiArtikel({nama,isi}){
    return <tr>
        <td>{nama}</td>
        <td>{isi}</td>
    </tr>
}

function Artikel(){
    return <div>
        <table>
            <thead>
                  <tr>
                      <th>Nama Artikel</th>
                      <th>Isi Artikel</th>
                  </tr>
            </thead>
            <tbody>
                <IsiArtikel nama="ES TEH TERENAK DI DUNIA" isi="BERITA TERHANGET"/>
                <IsiArtikel nama="ES TEH TERENAK DI DUNIA" isi="BERITA TERHANGET"/>
                <IsiArtikel nama="ES TEH TERENAK DI DUNIA" isi="BERITA TERHANGET"/>
            </tbody>
        </table>
    </div>
}



function List_Mhs(){
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
        <Mhs mhs={mahasiswa[0]}/>
        <Mhs mhs={mahasiswa[1]}/>
        <Mhs mhs={mahasiswa[2]}/>
    </div>
}

function App(){
    return <div>
        <h1>Halo dek </h1>
        <Artikel/>
        <List_Mhs/>

        <h1 class="text-3xl font-bold underline"> hello World!</h1>
    </div>
}


export default App;