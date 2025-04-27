import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
import ProgressBar from '../ProgressBar/index.jsx';
function Table({length ,batchId}) {
  const [Total, setTotal] = useState(length);
  const [certificates, setCertificates] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTotal(prev => prev + length);
  }, [batchId]);

  useEffect(() => {
    const handleCertificateGenerated = (cert) => {
      setCount((prev) => prev + 1);
    //  console.log('Certificate created:', cert);
      setCertificates((prev) => [...prev, cert]);
    };
  
    socket.on('certificate-generated', handleCertificateGenerated);
    return () => {
      socket.off('certificate-generated', handleCertificateGenerated);
    };
  }, []);
  const handleView = (path) => {
    window.open(`http://localhost:5000${path}`, '_blank');
  };

  const handleDownload = async (path, fileName) => {
    try {
      const response = await fetch(`http://localhost:5000${path}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDownloadAll = async () => {
    for (const cert of certificates) {
      await handleDownload(cert.path, cert.fileName);
    }
  };
const progressPercent = Total === 0 ? 0 : (count / Total) * 100;
  return (
    <div className={style.main}>
    <div className={style.detail}>
    <h3>Total Generated : {count}/{Total}</h3>
    <h3> BatchId :{batchId}</h3>
   <ProgressBar progress={progressPercent} />
   </div>
      <div className={style.tablediv}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>Certificate Id</th>
              <th>View Certificate</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{cert.name}</td>
                <td>{cert.certificateId}</td>
                <td>
                  <button className={style.download} onClick={() => handleView(cert.path)}>
                    View
                  </button>
                </td>
                <td>
                  <button className={style.download} onClick={() => handleDownload(cert.path, cert.fileName)}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                  No certificates generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {certificates.length > 0 && (
        <button className={style.downall} onClick={handleDownloadAll}>
          Download all
        </button>
      )}
    </div>
  );
}

export default Table;
// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// const ProgressBar = ({ progress }) => {
//   const barStyle = {
//     height: '25px',
//     width: '100%',
//     backgroundColor: '#ddd',
//     borderRadius: '5px',
//     marginTop: '10px',
//     overflow: 'hidden',
//   };

//   const fillerStyle = {
//     height: '100%',
//     width: `${progress}%`,
//     backgroundColor: '#4caf50',
//     textAlign: 'right',
//     transition: 'width 0.5s ease-in-out',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     color: 'white',
//     fontWeight: 'bold',
//     paddingRight: '10px',
//   };

//   return (
//     <div style={barStyle}>
//       <div style={fillerStyle}>{Math.floor(progress)}%</div>
//     </div>
//   );
// };

// function Table({ length }) {
//   const [Total, setTotal] = useState(length);
//   const [certificates, setCertificates] = useState([]);
//   const [count, setCount] = useState(0);
//   const [batchId, setbatchId] = useState('Null');

//   useEffect(() => {
//     setTotal(prev => prev + length);
//   }, [length]);

//   useEffect(() => {
//     const handleCertificateGenerated = (cert) => {
//       setCount((prev) => prev + 1);
//       setCertificates((prev) => [...prev, cert]);
//     };

//     socket.on('certificate-generated', handleCertificateGenerated);
//     return () => {
//       socket.off('certificate-generated', handleCertificateGenerated);
//     };
//   }, []);

//   const handleView = (path) => {
//     window.open(`http://localhost:5000${path}`, '_blank');
//   };

//   const handleDownload = async (path, fileName) => {
//     try {
//       const response = await fetch(`http://localhost:5000${path}`);
//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = fileName;

//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Download failed:', error);
//     }
//   };

//   const handleDownloadAll = async () => {
//     for (const cert of certificates) {
//       await handleDownload(cert.path, cert.fileName);
//     }
//   };

//   const progressPercent = Total === 0 ? 0 : (count / Total) * 100;

//   return (
//     <div style={{ padding: '20px' }}>
//       <div style={{ marginBottom: '20px' }}>
//         <h3>Total Generated: {count}/{Total}</h3>
//         <h3>Batch ID: {batchId}</h3>
//         <ProgressBar progress={progressPercent} />
//       </div>

//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th>Sr No</th>
//             <th>Name</th>
//             <th>View Certificate</th>
//             <th>Download</th>
//           </tr>
//         </thead>
//         <tbody>
//           {certificates.map((cert, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{cert.name}</td>
//               <td>
//                 <button onClick={() => handleView(cert.path)}>View</button>
//               </td>
//               <td>
//                 <button onClick={() => handleDownload(cert.path, cert.fileName)}>Download</button>
//               </td>
//             </tr>
//           ))}
//           {certificates.length === 0 && (
//             <tr>
//               <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
//                 No certificates generated yet.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {certificates.length > 0 && (
//         <button onClick={handleDownloadAll} style={{ marginTop: '20px' }}>
//           Download all
//         </button>
//       )}
//     </div>
//   );
// }

// export default Table;
