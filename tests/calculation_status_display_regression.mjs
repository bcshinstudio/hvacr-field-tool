import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const begin = source.indexOf('    const classifyReading = (value, low, high) => {', source.indexOf('function buildCalculationsTool()'));
const end = source.indexOf('    const activeReferenceProfile', begin);
assert(begin !== -1 && end > begin, 'Calculation status functions not found');
const context = vm.createContext({});
vm.runInContext(`${source.slice(begin, end)}; globalThis.check = { classifyReading, readingRow };`, context);
const {classifyReading, readingRow} = context.check;
for (const [reading, status] of [[2,'LOW'], [10,'NORMAL'], [24,'HIGH']]) {
  const classification=classifyReading(reading,5,20);
  assert.equal(classification,status);
  assert.match(readingRow('Superheat',`${reading}°F`,classification), new RegExp(`>${status}</span>`));
}
assert.equal(classifyReading(10,undefined,undefined),null);
assert.match(readingRow('Subcooling','10°F','REFERENCE_NA'),/REF N\/A/);
assert.doesNotMatch(readingRow('Subcooling','—','REFERENCE_NA'),/REF N\/A/);
assert.match(readingRow('Subcooling','10°F','NORMAL',true),/Estimated measurement/);
assert(source.includes('classifyReading(evaporatorSuperheat, applicableShRange?.low, applicableShRange?.high) || "REFERENCE_NA"'));
assert(source.includes('classifyReading(condenserOutletSubcooling, applicableScRange?.low, applicableScRange?.high) || "REFERENCE_NA"'));
console.log('PASS: Calculation statuses HIGH/NORMAL/LOW, reference N/A and estimated measurement');
