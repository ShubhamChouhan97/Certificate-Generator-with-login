import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Input from './component/Input/index.jsx'
import Table from './component/Tabel/index.jsx'
function App() {
  const [showcerticatediv, setshowcerticatediv] = useState(true)
  return (
  <div className='appmain'>
    <div className="input">
      <Input />
    </div>
{ showcerticatediv && 

    <div className="genrated">
    <h2>Generated Certificate</h2>
    <div className="divtable">
    <Table/>
    </div>
    </div>
}
  </div>
  )
}

export default App
