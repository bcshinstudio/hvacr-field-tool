import fs from 'node:fs';
const s=JSON.parse(fs.readFileSync(new URL('./wic_challenge_cases_v3.json',import.meta.url),'utf8'));
let bad=[];for(const c of s.cases){if(!c.id||!c.title||!c.scope||!c.applicable_systems?.length||!c.operating_state||!c.setup?.facts?.length||!c.expected?.system_check_result||!c.expected?.confirmed_findings?.length||!c.expected?.what_this_means||!c.expected?.next_action_check||!c.expected?.troubleshooting_path?.length)bad.push(c.id||'?')}
console.log(`WIC CHALLENGE 3 CONTRACT: ${s.cases.length-bad.length}/${s.cases.length} cases structurally valid`);if(bad.length){console.log('INVALID:',bad.join(', '));process.exitCode=1}
