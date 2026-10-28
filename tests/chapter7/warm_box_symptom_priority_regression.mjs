import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../../src/knowledge/hypothesis_engine.js';
const read=name=>JSON.parse(fs.readFileSync(new URL(`../../data/knowledge/core/${name}.json`,import.meta.url),'utf8')).items;
const knowledge={rules:read('evidence_rules'),relationships:read('relationships'),checks:read('checks'),discriminators:read('discriminators')};
const source=fs.readFileSync(new URL('../../src/app.js',import.meta.url),'utf8');
assert.match(source,/boxTempHigh:\s*wicDiagnosticContext\.reportedProblem === "insufficient_cooling"/);
assert.match(source,/Number\.isFinite\(getNumericMeasurementValue\("box_temperature", "temperature"\)\)/);
const baseline={calculated:{evaporatorSat:35,evaporatorReferenceLow:30,evaporatorReferenceHigh:50,condenserSat:115,condenserReferenceLow:100,condenserReferenceHigh:120,evaporatorSuperheat:14},references:{evaporatorSuperheat:{low:5,high:20}},context:{operatingState:'STABLE_COOLING',evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'},configuration:['TXV','RECEIVER']};
function run(reported,state="STABLE_COOLING"){const s={...baseline,derived:reported?{boxTempHigh:true}:{},context:{...baseline.context,operatingState:state}};const a=buildWicKnowledgeFacts(s);return evaluateHypotheses({...knowledge,facts:a.facts,factRecords:a.factRecords,application:'APP_WIC',operatingState:state,configuration:s.configuration});}
const reported=run(true);
assert.equal(reported.nextCheck,'CHECK_LOAD_INFILTRATION');
assert(reported.hypotheses.some(x=>x.candidate==='CAUSE_PRODUCT_LOAD_PULLDOWN'||x.candidate==='CAUSE_CONTROLLER_SETTING_OR_SENSOR_FAULT'));
const unreported=run(false);
assert(!unreported.hypotheses.some(x=>x.candidate==='CAUSE_PRODUCT_LOAD_PULLDOWN'));
const unknown=run(true,'UNKNOWN');
assert(unknown.hypotheses.length>0 || unknown.nextCheck==='CHECK_LOAD_INFILTRATION','Unknown state must offer provisional check or cause');
console.log('PASS warm-box explicit symptom, contextual next check and no invented complaint');
