const fs=require('fs');
const p='components/helper/index.tsx';
let s=fs.readFileSync(p,'utf8');

// 1) Attach header in first FetchData header block
const old1='    myHeaders.append("Authorization", "Bearer " + token);\n    myHeaders.append("Content-Type", "text/plain");\n';
const new1='    myHeaders.append("Authorization", "Bearer " + token);\n    myHeaders.append("Content-Type", "text/plain");\n    if ((methods == "POST" || methods == "PUT") && currentResourceVersion) {\n      myHeaders.append("x-expected-version", currentResourceVersion);\n    }\n';
if(!s.includes(old1)){ console.log('old1 NF'); process.exit(1);}
s=s.replace(old1,new1);

// 2) Cache version after parsing in first FetchData success path
const old2='308:     const datatext = data;\n309:     const datajson: any = JSON.parse(GetDecrypt(datatext));';
// fallback search
const needle='const datajson: any = JSON.parse(GetDecrypt(datatext));';
const idx=s.indexOf(needle);
if(idx<0){ console.log('needle NF'); process.exit(1);}
const insert='\n    const __v = extractResourceVersion(datajson); if (__v) currentResourceVersion = __v;';
s=s.replace(needle, needle+insert, 1);

fs.writeFileSync(p,s);
console.log('done');
