import fs from 'fs';

const path = './src/components/AdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-slate-900\/10/g, 'bg-white/10');
content = content.replace(/bg-slate-900\/5/g, 'bg-white/5');
content = content.replace(/bg-slate-900\/20/g, 'bg-white/20');
content = content.replace(/bg-slate-900\/30/g, 'bg-white/30');
content = content.replace(/bg-slate-900\/50/g, 'bg-white/50');

fs.writeFileSync(path, content);
console.log('Fixed opacity');
