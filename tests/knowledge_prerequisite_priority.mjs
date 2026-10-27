import assert from "node:assert/strict";
import fs from "node:fs";
import {evaluateHypotheses} from "../src/knowledge/hypothesis_engine.js";
const load=(name)=>JSON.parse(fs.readFileSync(new URL(`../data/knowledge/core/${name}.json`,import.meta.url),"utf8")).items;
const knowledge={rules:load("evidence_rules"),relationships:load("relationships"),discriminators:load("discriminators"),checks:load("checks")};
const run=(facts=[],state="STABLE_COOLING",completedChecks=[],factRecords=[])=>evaluateHypotheses({...knowledge,facts,application:"APP_WIC",operatingState:state,completedChecks,factRecords});
for (const [fact,expected,state] of [
 ["FACT_WIRING_SCHEME_UNKNOWN","CHECK_WIRING_DIAGRAM_CONTROL_STATE","UNKNOWN"],
 ["FACT_CONTACTOR_COIL_NOT_ENERGIZED","CHECK_WIRING_DIAGRAM_CONTROL_STATE","STABLE_COOLING"],
 ["FACT_OVERHEAT_CAUSE_UNRESOLVED","CHECK_OVERHEAT_CAUSE","STABLE_COOLING"],
 ["FACT_EVAP_OUTLET_PRESSURE_SUSPECT","CHECK_VERIFY_EVAP_PRESSURE_MEASUREMENT","STABLE_COOLING"]
]) {
 assert.equal(run([fact],state).nextCheck,expected,`${fact} must lead to prerequisite`);
 assert.notEqual(run([fact],state,[expected]).nextCheck,expected,`completed check ${expected} must not loop`);
}
assert.equal(run([],"UNKNOWN").nextCheck,"CHECK_ESTABLISH_OPERATING_STATE","unknown state remains a prerequisite by default");
assert.notEqual(run(["FACT_OPERATING_STATE_CONFIRMED"],"STABLE_COOLING").nextCheck,"CHECK_ESTABLISH_OPERATING_STATE","confirmed state not requested again");
assert.notEqual(run([],"STABLE_COOLING",[],[{id:"FACT_EVAP_OUTLET_PRESSURE_SUSPECT",quality:"INVALID"}]).nextCheck,"CHECK_VERIFY_EVAP_PRESSURE_MEASUREMENT","invalid evidence cannot drive check");
console.log("Knowledge prerequisite priority: 11 assertions PASS");
