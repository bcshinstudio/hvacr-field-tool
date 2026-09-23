export async function loadJson(path){const r=await fetch(path);if(!r.ok)throw new Error(`Failed to load ${path}: ${r.status}`);return r.json();}
export async function loadKnowledge(base="../data/knowledge"){
 const [manifest,concepts,rules,relationships,checks,discriminators,fieldGuidance,sources,application]=await Promise.all([
  loadJson(`${base}/manifest.json`),loadJson(`${base}/core/concepts.json`),loadJson(`${base}/core/evidence_rules.json`),
  loadJson(`${base}/core/relationships.json`),loadJson(`${base}/core/checks.json`),loadJson(`${base}/core/discriminators.json`),
  loadJson(`${base}/core/field_guidance.json`),loadJson(`${base}/sources/sources.json`),loadJson(`${base}/applications/walk_in_cooler.json`)]);
 return {manifest,concepts,rules,relationships,checks,discriminators,fieldGuidance,sources,application};
}
