import fs from 'fs';

const path = './src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/text-slate-700/g, 'text-slate-300');
content = content.replace(/text-slate-600/g, 'text-slate-400');

fs.writeFileSync(path, content);
console.log('Fixed text colors in App.tsx');
