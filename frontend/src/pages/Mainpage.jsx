import React,{useState} from 'react'
import Input from '../component/Input/index.jsx'
import Table from '../component/Tabel/index.jsx'
import './mainpage.css'
import { useNavigate } from 'react-router-dom';

function Mainpage() {
   const navigate = useNavigate();
  const [length, setLength] = useState(0);
   const [batchId, setbatchId] = useState('Null');
  const hometab = () => {
   navigate('/'); // Navigate to the Home component
  }
    return (
    <div className='appmain'>
    <button className='homebtn' onClick={hometab}>Home</button>
      <div className="input">
      <Input setLength={setLength} setbatchId={setbatchId} />
      </div>  
      <div className="genrated">
      <h2>Generated Certificate</h2>
      <div className="divtable">
      <Table length={length} batchId={batchId}/>
      </div>
      </div>
    </div>
    )
}

export default Mainpage;