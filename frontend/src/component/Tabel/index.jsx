
// import React, { useEffect, useState } from 'react';
// import style from './style.module.css';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// function Table() {
//   const [certificates, setCertificates] = useState([]);

//   useEffect(() => {
//     socket.on('certificate-generated', (cert) => {
//       console.log('Certificate created:', cert);
//       setCertificates((prev) => [...prev, cert]);
//     });

//     return () => socket.off('certificate-generated');
//   }, []);

//   const handleView = (path) => {
//     window.open(`http://localhost:5000${path}`, '_blank');
//   };

//   const handleDownload = async (path, fileName) => {
//   try {
//     const response = await fetch(`http://localhost:5000${path}`);
//     const blob = await response.blob();

//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = fileName;

//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//     window.URL.revokeObjectURL(url); // Clean up blob URL
//   } catch (error) {
//     console.error('Download failed:', error);
//   }
// }
//   return (
//     <div className={style.main}>
//       <div className={style.tablediv}>
//         <table className={style.table}>
//           <thead>
//             <tr>
//               <th>Sr No</th>
//               <th>Name</th>
//               <th>View Certificate</th>
//               <th>Download</th>
//             </tr>
//           </thead>
//           <tbody>
//             {certificates.map((cert, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{cert.name}</td>
//                 <td>
//                   <button className={style.download} onClick={() => handleView(cert.path)}>
//                     View
//                   </button>
//                 </td>
//                 <td>
//                   <button className={style.download} onClick={() => handleDownload(cert.path, cert.fileName)}>
//                     Download
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {certificates.length === 0 && (
//               <tr>
//                 <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
//                   No certificates generated yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     <button className='downall'> Download all </button>
//     </div>
//   );
// }

// export default Table;
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Table() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    socket.on('certificate-generated', (cert) => {
      console.log('Certificate created:', cert);
      setCertificates((prev) => [...prev, cert]);
    });

    return () => socket.off('certificate-generated');
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

  return (
    <div className={style.main}>
      <div className={style.tablediv}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>View Certificate</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{cert.name}</td>
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
