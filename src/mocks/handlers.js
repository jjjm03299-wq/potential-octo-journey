import { http, HttpResponse } from 'msw';

const countries = [
  { id: 1, name: 'United States', code: 'US', flag: '🇺🇸', ip: '192.168.1.10' },
  { id: 2, name: 'Germany', code: 'DE', flag: '🇩🇪', ip: '185.220.101.5' },
  { id: 3, name: 'Japan', code: 'JP', flag: '🇯🇵', ip: '203.0.113.42' },
  { id: 4, name: 'United Kingdom', code: 'GB', flag: '🇬🇧', ip: '51.15.20.19' },
  { id: 5, name: 'Canada', code: 'CA', flag: '🇨🇦', ip: '198.51.100.24' },
  { id: 6, name: 'Australia', code: 'AU', flag: '🇦🇺', ip: '139.99.144.8' },
  { id: 7, name: 'Singapore', code: 'SG', flag: '🇸🇬', ip: '165.22.255.12' },
  { id: 8, name: 'France', code: 'FR', flag: '🇫🇷', ip: '51.158.33.2' },
  { id: 9, name: 'Switzerland', code: 'CH', flag: '🇨🇭', ip: '193.134.156.2' },
  { id: 10, name: 'Netherlands', code: 'NL', flag: '🇳🇱', ip: '145.40.64.1' },
];

let vpnState = { status: 'Disconnected', connectedCountry: null, assignedIp: null };

export const handlers = [
  // Получить список стран
  http.get('/api/countries', () => {
    return HttpResponse.json(countries);
  }),

  // Получить статус VPN
  http.get('/api/vpn/status', () => {
    return HttpResponse.json(vpnState);
  }),

  // Подключиться к VPN
  http.post('/api/vpn/connect', async ({ request }) => {
    const { countryCode } = await request.json();
    const target = countries.find((c) => c.code === countryCode);
    
    if (!target) {
      return new HttpResponse(JSON.stringify({ error: 'Country not found' }), { status: 404 });
    }

    vpnState = {
      status: 'Connected',
      connectedCountry: target,
      assignedIp: target.ip,
    };

    return HttpResponse.json(vpnState);
  }),

  // Отключить VPN
  http.post('/api/vpn/disconnect', () => {
    vpnState = { status: 'Disconnected', connectedCountry: null, assignedIp: null };
    return HttpResponse.json(vpnState);
  }),
];
