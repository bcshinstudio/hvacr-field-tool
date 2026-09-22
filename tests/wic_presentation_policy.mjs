import fs from"fs";const s=fs.readFileSync(new URL("../src/app.js",import.meta.url),"utf8");
const need=[
'result.diagnoses.length === 1\\n            ? []',
'result.diagnoses.length === 1 ? "RECOMMENDED ACTION" : "NEXT ACTION / CHECK"',
'currentSystem?.id === "walk_in_cooler" && knowledgeHub\\n                ? buildKnowledgeHubComparison'
];
for(const x of need)if(!s.includes(x.replaceAll("\\n","\n")))throw Error("Missing presentation policy: "+x);
console.log("WIC PRESENTATION POLICY: PASS");