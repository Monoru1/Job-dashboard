import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [cv, setCV] = useState(null);
  const [query, setQuery] = useState('java');
  const [location, setLocation] = useState('austin, tx');
  const [results, setResults] = useState([]);

  const api = axios.create({
    baseURL: 'https://YOUR_BACKEND_URL.onrender.com', // 🔁 REMPLACE avec ton URL Render backend
  });

  const register = async () => {
    await api.post('/register', new URLSearchParams({ email, password }));
    alert('Inscription réussie');
  };

  const login = async () => {
    const res = await api.post('/token', new URLSearchParams({ username: email, password }));
    setToken(res.data.access_token);
  };

  const uploadCV = async () => {
    const formData = new FormData();
    formData.append('file', cv);
    await api.post('/upload_cv', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('CV Uploadé');
  };

  const searchJobs = async () => {
    const res = await api.post(
      '/search_jobs',
      {
        query,
        location,
        radius: 25,
        pages: 1,
        limit: 10,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setResults(res.data.results);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Indeed Job Bot</h1>

      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full" />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full" />

      <div className="flex gap-2">
        <button onClick={register} className="bg-blue-500 text-white p-2 rounded">Register</button>
        <button onClick={login} className="bg-green-500 text-white p-2 rounded">Login</button>
      </div>

      {token && (
        <>
          <input type="file" onChange={e => setCV(e.target.files[0])} className="mt-2" />
          <button onClick={uploadCV} className="bg-purple-500 text-white p-2 rounded mt-2">Uploader CV</button>

          <input placeholder="Mots-clés" value={query} onChange={e => setQuery(e.target.value)} className="border p-2 w-full mt-4" />
          <input placeholder="Lieu" value={location} onChange={e => setLocation(e.target.value)} className="border p-2 w-full" />
          <button onClick={searchJobs} className="bg-black text-white p-2 rounded mt-2">Rechercher</button>

          <div className="mt-4">
            <h2 className="font-bold">Résultats :</h2>
            {results.map((job, i) => (
              <div key={i} className="border p-2 mb-2">
                <p className="font-semibold">{job.jobtitle}</p>
                <p>{job.company} – {job.formattedLocation}</p>
                <a href={job.url} target="_blank" rel="noreferrer" className="text-blue-600">Voir l'offre</a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
