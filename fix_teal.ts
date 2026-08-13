import fs from 'fs';

const path = './src/components/AdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-\[#e6f9f5\]/g, 'bg-emerald-500/10');
content = content.replace(/border-teal-100/g, 'border-emerald-500/20');
content = content.replace(/bg-\[#004d5a\]/g, 'bg-slate-900'); // Just in case it wasn't replaced
content = content.replace(/text-slate-800/g, 'text-slate-200');

fs.writeFileSync(path, content);
console.log('Fixed teal');
