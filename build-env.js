// Run: node build-env.js   (reads .env and writes env.js which the app loads)
const fs=require('fs');
const file=['.env','_env'].find(f=>fs.existsSync(f)&&fs.statSync(f).size>0);
if(!file){console.error('No .env found (or it is empty). Copy .env.example to .env and fill it in.');process.exit(1)}
const e={};
fs.readFileSync(file,'utf8').split(/\r?\n/).forEach(l=>{
  const m=l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
  if(m)e[m[1]]=m[2].replace(/^(['"])(.*)\1$/,'$2');       // strip surrounding quotes
});
const need=['APPWRITE_ENDPOINT','APPWRITE_PROJECT_ID','APPWRITE_DATABASE_ID','APPWRITE_USERS_TABLE_ID'];
const miss=need.filter(k=>!e[k]);
if(miss.length){console.error('Missing in '+file+': '+miss.join(', '));process.exit(1)}
fs.writeFileSync('env.js','window.ENV='+JSON.stringify({ENDPOINT:e.APPWRITE_ENDPOINT,PROJECT:e.APPWRITE_PROJECT_ID,DB:e.APPWRITE_DATABASE_ID,USERS:e.APPWRITE_USERS_TABLE_ID,BUCKET:e.APPWRITE_BUCKET_ID||''},null,1)+';\n');
console.log('env.js written from '+file);