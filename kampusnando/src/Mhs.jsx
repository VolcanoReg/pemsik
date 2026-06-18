import Nama from './Nama.jsx';
import Nim from './Nim.jsx';

function Mhs({mhs}){
    return <div>
        <Nama nama={mhs.nama}/>
        <Nim nim={mhs.nim}/>
    </div>
}

export default Mhs;