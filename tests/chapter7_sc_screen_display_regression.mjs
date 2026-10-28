import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const src = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const start = src.indexOf('    const classifyReading = (value, low, high) => {', src.indexOf('function buildCalculationsTool()'));
const end = src.indexOf('    const activeReferenceProfile', start);
assert(start >= 0 && end > start);
const ctx = vm.createContext({});
vm.runInContext(`${src.slice(start,end)}; globalThis.demo={classifyReading,readingRow};`,ctx);
for(const [value,label] of [[0.3,'LOW'],[10,'NORMAL'],[25,'HIGH']]){
  assert.equal(ctx.demo.classifyReading(value,5,20),label);
  assert.match(ctx.demo.readingRow('Subcooling',`${value}°F`,label,true,true),new RegExp(`${label} · SCREEN`));
}
assert.match(src,/const walkInScScreening = \["walk_in_cooler", "walk_in_freezer"\]\.includes\(currentSystem\?\.id\) && hasReceiver;/);
assert.match(src,/SC Screening Range \(Chapter 7\)/);
assert.match(src,/5–20°F; not a charge target/);
assert.match(src,/const applicableScRange = walkInScScreening \? chapter7ScScreenRange/);
console.log('PASS: walk-in receiver Chapter 7 subcooling screening; display only');
