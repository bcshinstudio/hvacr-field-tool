/* Low-temperature walk-in configuration reuses the shared DX component graph.
 * Freezer reference targets and diagnostic scope are resolved through APP_WIF,
 * not by copying the cooler's reference temperatures. */
import {walkInCooler} from './walk_in_cooler.js';
export const walkInFreezer = {
  ...walkInCooler,
  id:'walk_in_freezer',
  name:'Walk-In Freezer',
  description:'Low-temperature walk-in refrigeration system; freezer-specific reference and defrost conditions apply.'
};
