const fs=require('fs');
const p='components/helper/index.tsx';
let s=fs.readFileSync(p,'utf8');

// FetchDataDocument header block
const old='  myHeaders.append("Authorization", "Bearer " + token);\n  if (methods == "POST" || methods == "PUT") {';
const newstr='  myHeaders.append("Authorization", "Bearer " + token);\n  if ((methods == "POST" || methods == "PUT") && currentResourceVersion) {\n    myHeaders.append("x-expected-version", currentResourceVersion);\n  }\n  if (methods == "POST" || methods == "PUT") {';
if(!s.includes(old)){ console.log('old NF'); process.exit(1);}
s=s.replace(old,newstr);

// FetchDataDocument version cache: after const datajson
const needle2='const datajson: any = JSON.parse(GetDecrypt(data));';
const idx=s.indexOf(needle2);
if(idx<0){ console.log('needle2 NF'); process.exit(1);}
const insert2='\n    const __v2 = extractResourceVersion(datajson); if (__v2) currentResourceVersion = __v2;';
s=s.replace(needle2, needle2+insert2, 1);

fs.writeFileSync(p,s);
console.log('done');
