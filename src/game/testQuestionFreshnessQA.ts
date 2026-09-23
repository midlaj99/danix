declare const process: any;
import { CURRICULUM_LEVELS } from '../educational/curriculumData';
import { QuestionHistoryManager } from '../educational/QuestionPoolEngine';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error('❌ ASSERTION FAILED:', msg);
    process.exit(1);
  }
  console.log('✅ PASS:', msg);
}

console.log('🚀 TESTING QUESTION POOL ENGINE & ZERO-REPEAT RETRY ARCHITECTURE');

const historyManager = QuestionHistoryManager.getInstance();
const level1 = CURRICULUM_LEVELS[0];

// Attempt 1: First play
console.log('\n--- ATTEMPT 1: Initial Question Set ---');
historyManager.resetLevel(level1.id);
const attempt1Questions = historyManager.getFreshQuestionSet(level1, 5, false);
assert(attempt1Questions.length === 5, 'Attempt 1 returned exactly 5 questions');
const attempt1Ids = new Set(attempt1Questions.map((q) => q.id));
console.log('Attempt 1 IDs:', [...attempt1Ids]);

// Attempt 2: Player dies and retries
console.log('\n--- ATTEMPT 2: First Retry After Death ---');
const attempt2Questions = historyManager.getFreshQuestionSet(level1, 5, true);
assert(attempt2Questions.length === 5, 'Attempt 2 returned exactly 5 questions');
const attempt2Ids = new Set(attempt2Questions.map((q) => q.id));
console.log('Attempt 2 IDs:', [...attempt2Ids]);

// Verify STRICT ZERO OVERLAP between Attempt 1 and Attempt 2
const overlap1And2 = attempt2Questions.filter((q) => attempt1Ids.has(q.id));
assert(overlap1And2.length === 0, 'ZERO question ID repetition between Attempt 1 and Retry Attempt 2!');

// Attempt 3: Player dies again and retries
console.log('\n--- ATTEMPT 3: Second Retry After Death ---');
const attempt3Questions = historyManager.getFreshQuestionSet(level1, 5, true);
assert(attempt3Questions.length === 5, 'Attempt 3 returned exactly 5 questions');
const attempt3Ids = new Set(attempt3Questions.map((q) => q.id));
console.log('Attempt 3 IDs:', [...attempt3Ids]);

// Verify STRICT ZERO OVERLAP with both Attempt 1 and Attempt 2
const overlap3WithPrevious = attempt3Questions.filter((q) => attempt1Ids.has(q.id) || attempt2Ids.has(q.id));
assert(overlap3WithPrevious.length === 0, 'ZERO question ID repetition across Attempt 1, Retry 1, and Retry 2!');

console.log('\n🎉 ALL ZERO-REPEAT RETRY & QUESTION POOL TESTS PASSED PERFECTLY!\n');
