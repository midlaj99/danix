declare const process: any;
import { CURRICULUM_LEVELS } from './curriculumData';
import { validateAllLevels } from './LevelBalanceValidator';

console.log('Validating', CURRICULUM_LEVELS.length, 'levels...');
const result = validateAllLevels(CURRICULUM_LEVELS);

console.log('\n--- VALIDATION SUMMARY ---');
console.log('Total Levels:', result.reports.length);
console.log('All Valid:', result.allValid);

const failed = result.reports.filter(r => !r.isValid);
if (failed.length > 0) {
  console.error('FAILED LEVELS:');
  failed.forEach(f => console.error(`Level ${f.levelId} (${f.levelTitle}): ${f.error}`));
  process.exit(1);
} else {
  console.log('✅ ALL 42 LEVELS ARE MATHEMATICALLY BALANCED AND VALID!');
  process.exit(0);
}
