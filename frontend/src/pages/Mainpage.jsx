import React,{useState} from 'react'
import Input from '../component/Input/index.jsx'
import Table from '../component/Tabel/index.jsx'
import './mainpage.css'

function Mainpage() {
  const [length, setLength] = useState(0);
console.log('length',length)

    return (
    <div className='appmain'>
      <div className="input">
      <Input setLength={setLength} />
      </div>  
      <div className="genrated">
      <h2>Generated Certificate</h2>
      <div className="divtable">
      <Table length={length} />
      </div>
      </div>
    </div>
    )
}

export default Mainpage;