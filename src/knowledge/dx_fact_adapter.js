/* Shared DX evidence adapter. The existing WIC adapter is the validated
 * implementation; this alias makes its reusable role explicit while WIC-only
 * observations remain optional/unknown for residential A/C. */
export { buildWicKnowledgeFacts as buildDxKnowledgeFacts } from './wic_fact_adapter.js';
