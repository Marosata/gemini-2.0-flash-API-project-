import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Génération du token JWT
const token = jwt.sign(
    { 
        userId: 'test-user',
        role: 'user'
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

console.log('Token JWT pour les tests:');
console.log(token); 