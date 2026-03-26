
import { useState, useEffect } from 'react';

export function getFaturas(clienteId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/faturas/${clienteId}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [clienteId]);

  return { data, loading };
}