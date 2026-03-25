const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: '65eaf1234567890abcdef123' }, process.env.JWT_SECRET || 'bannari_secret_key_123', {
    expiresIn: '30d',
});
console.log(token);
