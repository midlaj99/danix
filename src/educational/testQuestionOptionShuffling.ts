declare const process: any;
import { QUESTION_BANK } from './questionBank';
import { CURRICULUM_LEVELS } from './curriculumData';
import { shuffleQuestion, shuffleMiniPractice } from './questionUtils';

console.log('================================================================');
console.log('🧪 TESTING QUESTION OPTION SHUFFLING & NO-LOOPHOLE VERIFICATION');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] Test ${totalTests}: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] Test ${totalTests}: ${testName}`);
    if (detail) console.error(`   Detail: ${detail}`);
    process.exit(1);
  }
}

// -------------------------------------------------------------
// Test 1: shuffleQuestion preserves correctAnswer in options
// -------------------------------------------------------------
console.log('--- TEST 1: CORRECT ANSWER PRESERVATION ---');
{
  const rawQ = QUESTION_BANK['q_arr_01'];
  const shuffled = shuffleQuestion(rawQ);

  assert(shuffled.options.includes(rawQ.correctAnswer), 'Shuffled options still contain the correctAnswer');
  assert(shuffled.options.length === rawQ.options.length, 'Shuffled options have the exact same length');
}

// -------------------------------------------------------------
// Test 2: Options are distributed across positions (not stuck at 0)
// -------------------------------------------------------------
console.log('\n--- TEST 2: NON-ZERO OPTION INDEX DISTRIBUTION ---');
{
  const rawQ = QUESTION_BANK['q_arr_01']; // Originally options[0] was correct
  const indexCounts = [0, 0, 0, 0];
  const trials = 300;

  for (let i = 0; i < trials; i++) {
    const shuffled = shuffleQuestion(rawQ);
    const idx = shuffled.options.indexOf(shuffled.correctAnswer);
    if (idx >= 0 && idx < 4) {
      indexCounts[idx]++;
    }
  }

  console.log(`   Distribution across indices [0, 1, 2, 3] over ${trials} runs:`, indexCounts);

  // Verify that options appeared at indices 1, 2, and 3 (NOT solely index 0)
  assert(indexCounts[1] > 0, 'Correct answer appears at index 1 (Option B)');
  assert(indexCounts[2] > 0, 'Correct answer appears at index 2 (Option C)');
  assert(indexCounts[3] > 0, 'Correct answer appears at index 3 (Option D)');
  assert(indexCounts[0] < trials * 0.7, 'Index 0 is NOT favored/locked (no loophole)');
}

// -------------------------------------------------------------
// Test 3: MiniPractice shuffling recalculates correctIndex accurately
// -------------------------------------------------------------
console.log('\n--- TEST 3: MINI PRACTICE RE-INDEXING INTEGRITY ---');
{
  const level1 = CURRICULUM_LEVELS[0];
  const rawPractice = level1.miniPractice;
  const originalAnswer = rawPractice.options[rawPractice.correctIndex];

  let foundNonZero = false;
  for (let i = 0; i < 50; i++) {
    const shuffledPractice = shuffleMiniPractice(rawPractice);
    const answerAtNewIndex = shuffledPractice.options[shuffledPractice.correctIndex];
    
    assert(
      answerAtNewIndex === originalAnswer,
      'Recalculated correctIndex points to the exact same correct answer string'
    );

    if (shuffledPractice.correctIndex !== 0) {
      foundNonZero = true;
    }
  }

  assert(foundNonZero, 'MiniPractice correctIndex is successfully randomized away from index 0');
}

// -------------------------------------------------------------
// Test 4: All Curriculum Levels MiniPractice Verification
// -------------------------------------------------------------
console.log('\n--- TEST 4: ALL 42 LEVELS MINI PRACTICE VALIDITY ---');
{
  let allMatched = true;
  for (const level of CURRICULUM_LEVELS) {
    const originalAnswer = level.miniPractice.options[level.miniPractice.correctIndex];
    const shuffled = shuffleMiniPractice(level.miniPractice);
    if (shuffled.options[shuffled.correctIndex] !== originalAnswer) {
      allMatched = false;
      break;
    }
  }
  assert(allMatched, 'All 42 levels miniPractice shuffle and match their correct answers flawlessly');
}

console.log('\n================================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} OPTION SHUFFLE TESTS PASSED!`);
console.log('================================================================\n');
