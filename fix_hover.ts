import fs from 'fs';

const path = './src/components/AdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/hover:bg-emerald-50/g, 'hover:bg-emerald-500/10');
content = content.replace(/hover:bg-red-50/g, 'hover:bg-red-500/10');
content = content.replace(/hover:text-emerald-600/g, 'hover:text-emerald-400');
content = content.replace(/hover:text-red-600/g, 'hover:text-red-400');
content = content.replace(/text-emerald-600/g, 'text-emerald-400'); // Just in case

fs.writeFileSync(path, content);
console.log('Fixed hover colors');
