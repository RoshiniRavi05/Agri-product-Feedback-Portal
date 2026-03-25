const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: '65eaf1234567890abcdef123' }, process.env.JWT_SECRET || 'bannari_secret_key_123', { expiresIn: '30d' });

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/farmers',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Status:', res.statusCode, 'Data:', data));
});
req.on('error', e => console.error(e));
req.end();
