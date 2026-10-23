// Run: node build-env.js   (reads .env and writes env.js which the app loads)
const fs=require('fs'),e={};fs.readFileSync('.env','utf8').split('\n').forEach(l=>{const m=l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);if(m)e[m[1]]=m[2]});
fs.writeFileSync('env.js','window.ENV='+JSON.stringify({ENDPOINT:e.APPWRITE_ENDPOINT,PROJECT:e.APPWRITE_PROJECT_ID,DB:e.APPWRITE_DATABASE_ID,USERS:e.APPWRITE_USERS_TABLE_ID,BUCKET:e.APPWRITE_BUCKET_ID})+';');console.log('env.js written');
