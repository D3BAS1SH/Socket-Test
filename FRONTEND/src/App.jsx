import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css'

const socket = io('http://localhost:5000');
console.log(socket);

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(data);
    socket.on('DataChange', (change) => {
      console.log(change);
      if (change.operationType === 'insert') {
        setData((prev) => [...prev, change.fullDocument]);
      }
    });
    
    console.log(data);
    return () => socket.off('DataChange');
  }, []);



  return (
    <div>
      <h1>Real-time Data</h1>
      {data.map((item) => (
        <div key={item._id}>{item.message}</div>
      ))}
    </div>
  );
}

export default App
