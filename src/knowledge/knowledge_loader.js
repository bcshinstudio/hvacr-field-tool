export async function loadJson(path){const r=await fetch(path);if(!r.ok)throw new Error(`Failed to load ${path}: ${r.status}`);return r.json();}
export async function loadKnowledge(base="../data/knowledge", applicationId="APP_WIC"){
 const [manifest,concepts,rules,relationships,checks,discriminators,fieldGuidance,sources,application]=await Promise.all([
  loadJson(`${base}/manifest.json`),loadJson(`${base}/core/concepts.json`),loadJson(`${base}/core/evidence_rules.json`),
  loadJson(`${base}/core/relationships.json`),loadJson(`${base}/core/checks.json`),loadJson(`${base}/core/discriminators.json`),
  loadJson(`${base}/core/field_guidance.json`),loadJson(`${base}/sources/sources.json`),loadJson(`${base}/applications/${({APP_WIC:"walk_in_cooler",APP_RIC:"app_ric",APP_RIF:"app_rif"})[applicationId]||"walk_in_cooler"}.json`)]);
 const reachInProfiles = await Promise.all([
  loadJson(`${base}/applications/app_ric.json`),
  loadJson(`${base}/applications/app_rif.json`)
 ]);
 const applications = Object.fromEntries([application,...reachInProfiles].map(p=>[p.id,p]));
 return {manifest,concepts,rules,relationships,checks,discriminators,fieldGuidance,sources,application,applications};
}
