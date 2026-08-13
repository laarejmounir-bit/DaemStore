import fs from 'fs';

const path = './src/components/AdminDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-\[#f8fafc\]/g, 'bg-slate-950');
content = content.replace(/bg-white/g, 'bg-slate-900');
content = content.replace(/bg-\[#004d5a\]/g, 'bg-slate-900');
content = content.replace(/text-slate-900/g, 'text-white');
content = content.replace(/text-slate-700/g, 'text-slate-200');
content = content.replace(/text-slate-600/g, 'text-slate-300');
content = content.replace(/text-slate-500/g, 'text-slate-400');
content = content.replace(/border-slate-200/g, 'border-white/10');
content = content.replace(/border-slate-100/g, 'border-white/5');
content = content.replace(/bg-slate-100/g, 'bg-slate-800');
content = content.replace(/bg-slate-50/g, 'bg-slate-800/50');
content = content.replace(/divide-slate-100/g, 'divide-white/5');
content = content.replace(/hover:bg-slate-50/g, 'hover:bg-slate-800');
content = content.replace(/hover:bg-slate-100/g, 'hover:bg-slate-800');
content = content.replace(/hover:bg-slate-200/g, 'hover:bg-slate-700');

fs.writeFileSync(path, content);
console.log('Done');
