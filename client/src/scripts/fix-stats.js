const fs = require('fs');
const path = require('path');

const filePath = path.resolve('c:/Users/chava/Downloads/u/client/src/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace stats missing 'shares'
content = content.replace(/(stats:\s*{\s*likes:\s*\d+,\s*support:\s*\d+,\s*comments:\s*\d+)(\s*})/g, '$1, shares: 0$2');

// Fix the optimistic handleCreatePost fallback which also needs 'shares: 0'
content = content.replace(/(stats:\s*{\s*likes:\s*0,\s*support:\s*0,\s*comments:\s*0)(\s*})/g, '$1, shares: 0$2');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Stats interfaces in Home.tsx');
