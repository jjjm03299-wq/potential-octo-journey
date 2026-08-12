import React, { useState, useEffect } from 'react';

export default function App() {
  const [countries, setCountries] = useState([]);
  const [vpn, setVpn] = useState({ status: 'Disconnected', connectedCountry: null, assignedIp: null });
  const [selectedCountry, setSelectedCountry] = useState('US');

  useEffect(() => {
    fetch('/api/countries')
      .then(res => res.json())
      .then(data => setCountries(data));

    fetch('/api/vpn/status')
      .then(res => res.json())
      .then(data => setVpn(data));
  }, []);

  const connectVpn = async () => {
    const res = await fetch('/api/vpn/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryCode: selectedCountry }),
    });
    const data = await res.json();
    setVpn(data);
  };

  const disconnectVpn = async () => {
    const res = await fetch('/api/vpn/disconnect', { method: 'POST' });
    const data = await res.json();
    setVpn(data);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <h2>VPN Control Center (MSW)</h2>
      <div style={{ padding: '10px', background: vpn.status === 'Connected' ? '#d4edda' : '#f8d7da', marginBottom: '20px' }}>
        <strong>Status:</strong> {vpn.status} <br />
        {vpn.connectedCountry && <><strong>Country:</strong> {vpn.connectedCountry.flag} {vpn.connectedCountry.name} <br /></>}
        {vpn.assignedIp && <><strong>Assigned IP:</strong> {vpn.assignedIp}</>}
      </div>

      <label>Select Country:</label>
      <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={{ display: 'block', width: '100%', padding: '8px', margin: '10px 0' }}>
        {countries.map(c => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name} ({c.ip})
          </option>
        ))}
      </select>

      {vpn.status === 'Disconnected' ? (
        <button onClick={connectVpn} style={{ background: 'green', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Connect VPN</button>
      ) : (
        <button onClick={disconnectVpn} style={{ background: 'red', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Disconnect VPN</button>
      )}
    </div>
  );
}
