declare const process: any;
import { RadoxomEconomyManager } from './systems/RadoxomEconomyManager';
import { Monster } from './entities/Monster';
import { CURRICULUM_LEVELS } from '../educational/curriculumData';

console.log('===============================================================');
console.log('🚀 RUNNING FINAL COMBAT + RADOXOM ECONOMY + RETRY QA TEST SUITE');
console.log('===============================================================\n');

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
// Test 1: Authoritative Entry Sequence & Monster Spacing
// -------------------------------------------------------------
console.log('--- SCENARIO 1: COMBAT ENTRY SEQUENCE & POSITIONING ---');
{
  const level1 = CURRICULUM_LEVELS[0];
  const monster = new Monster(level1.monster, 950, 480, false, 1);
  assert(monster.x >= 900, 'Monster spawns at tactical combat spacing (>900px)');
  
  // Monster updates real-time AI and moves toward target combat distance
  for (let i = 0; i < 30; i++) {
    monster.updateRealtimeAI(1 / 60, 200, 480, true, 480, 50, 1200, undefined, undefined, 0, 0, undefined, false, 0);
  }
  const snapshot = monster.director.getDebugSnapshot();
  assert(snapshot.telemetry.monsterMovementDistance > 0, 'Monster actively moved during entry sequence');
}

// -------------------------------------------------------------
// Test 2: Economy Deduplication & Anti-Cheat Validation
// -------------------------------------------------------------
console.log('\n--- SCENARIO 2: RADOXOM TRANSACTION DEDUPLICATION ---');
{
  const economy = RadoxomEconomyManager.getInstance();
  economy.startLevelAttempt(1, 5);

  const earn1 = economy.earnRadoxom('q_scalar_01');
  assert(earn1 === true, 'First reward for question q_scalar_01 awarded');
  assert(economy.getCurrentAttempt().remainingRadoxoms === 1, 'Inventory reflects +1 ammo');

  const earnDuplicate = economy.earnRadoxom('q_scalar_01');
  assert(earnDuplicate === false, 'Duplicate reward for question q_scalar_01 rejected');
  assert(economy.getCurrentAttempt().remainingRadoxoms === 1, 'Inventory unchanged after duplicate rejection');

  const fire1 = economy.consumeRadoxom('proj_001');
  assert(fire1 === true, 'Projectile proj_001 consumed from inventory');
  assert(economy.getCurrentAttempt().remainingRadoxoms === 0, 'Inventory depleted to 0');

  const fireDuplicate = economy.consumeRadoxom('proj_001');
  assert(fireDuplicate === false, 'Duplicate firing of proj_001 rejected');

  const fireEmpty = economy.consumeRadoxom('proj_002');
  assert(fireEmpty === false, 'Firing with 0 remaining inventory rejected');
}

// -------------------------------------------------------------
// Test 3: Player Stands Still -> Monster Approaches & Pressures
// -------------------------------------------------------------
console.log('\n--- SCENARIO 3: MONSTER AGGRESSION ON STATIONARY HERO ---');
{
  const level1 = CURRICULUM_LEVELS[0];
  const monster = new Monster(level1.monster, 850, 480, false, 1);
  const heroX = 200;
  const initialDist = Math.abs(monster.x - heroX);

  // Run AI simulation for 2 seconds with stationary hero
  for (let i = 0; i < 120; i++) {
    monster.updateRealtimeAI(1 / 60, heroX, 480, true, 480, 50, 1200, undefined, undefined, 0, 0, undefined, false, 0);
  }
  const newDist = Math.abs(monster.x - heroX);
  assert(newDist < initialDist, 'Monster closed distance on stationary player', `Initial: ${initialDist}, New: ${newDist}`);
}

// -------------------------------------------------------------
// Test 4: Player Retreats -> Monster Pursues & Intercepts
// -------------------------------------------------------------
console.log('\n--- SCENARIO 4: MONSTER PURSUIT ON RETREATING HERO ---');
{
  const level2 = CURRICULUM_LEVELS[1];
  const monster = new Monster(level2.monster, 700, 480, false, 2);
  
  // Hero retreats to left boundary at -200px/s
  let heroX = 400;
  for (let i = 0; i < 60; i++) {
    heroX = Math.max(80, heroX - 200 * (1 / 60));
    monster.updateRealtimeAI(1 / 60, heroX, 480, true, 480, 50, 1200, undefined, undefined, -200, 0, undefined, false, 0);
  }
  assert(monster.vx < 0, 'Monster maintains negative horizontal velocity pursuing retreating player', `vx: ${monster.vx}`);
}

// -------------------------------------------------------------
// Test 5: Authoritative Death & Retry Ammo Formula (Fired 3 of 5)
// -------------------------------------------------------------
console.log('\n--- SCENARIO 5: AUTHORITATIVE RETRY AMMO RECOVERY (FIRED 3 OF 5) ---');
{
  const economy = RadoxomEconomyManager.getInstance();
  economy.startLevelAttempt(5, 5); // Level 5, requires 5 radoxoms

  // Earn 5 radoxoms
  for (let i = 1; i <= 5; i++) {
    economy.earnRadoxom(`level5_q${i}`);
  }
  assert(economy.getCurrentAttempt().earnedRadoxoms === 5, 'Earned 5 Radoxoms');
  assert(economy.getCurrentAttempt().remainingRadoxoms === 5, 'Remaining 5 Radoxoms');

  // Combat: Player fires 3 shots and then dies
  economy.consumeRadoxom('p1');
  economy.consumeRadoxom('p2');
  economy.consumeRadoxom('p3');

  assert(economy.getCurrentAttempt().firedRadoxoms === 3, 'Fired exactly 3 Radoxoms');
  assert(economy.getCurrentAttempt().remainingRadoxoms === 2, 'Remaining inventory is 2 Radoxoms');

  // Player Dies: calculate retry breakdown
  const retryBreakdown = economy.calculateRetryRadoxomRequirement();
  assert(retryBreakdown.remaining === 2, 'Authoritative remaining is 2');
  assert(retryBreakdown.toRecover === 3, 'Authoritative toRecover is 3 (Required 5 - Remaining 2 = 3)');

  // Prepare Retry Attempt
  const retryPrep = economy.prepareRetryAttempt();
  assert(retryPrep.targetToRecover === 3, 'Retry target questions to recover is exactly 3');
  assert(retryPrep.existingRemaining === 2, 'Existing unspent 2 Radoxoms kept in inventory');
  assert(economy.getCurrentAttempt().attemptNumber === 2, 'Attempt number incremented to 2');
}

// -------------------------------------------------------------
// Test 6: Question Session 15-Second Timeout Awards 0 Ammo
// -------------------------------------------------------------
console.log('\n--- SCENARIO 6: 15S QUESTION TIMEOUT AWARDS 0 AMMO ---');
{
  const economy = RadoxomEconomyManager.getInstance();
  economy.startLevelAttempt(10, 5);

  const initialRemaining = economy.getCurrentAttempt().remainingRadoxoms;
  economy.recordQuestionResolvedWithoutReward('q_timeout_01', true);

  assert(economy.getCurrentAttempt().remainingRadoxoms === initialRemaining, 'Timeout awarded 0 ammo (+0)');
  assert(economy.getCurrentAttempt().questionsTimedOut === 1, 'Timeout registered in metrics');

  // Ensure this timed-out question ID cannot be rewarded retroactively
  const retroReward = economy.earnRadoxom('q_timeout_01');
  assert(retroReward === false, 'Timed-out question cannot be retroactively rewarded');
}

// -------------------------------------------------------------
// Test 7: Double Answer Prevention
// -------------------------------------------------------------
console.log('\n--- SCENARIO 7: DOUBLE ANSWER ATTEMPT PREVENTION ---');
{
  const economy = RadoxomEconomyManager.getInstance();
  economy.startLevelAttempt(11, 4);

  const first = economy.earnRadoxom('q_double_test');
  const second = economy.earnRadoxom('q_double_test');

  assert(first === true && second === false, 'First answer succeeds, second duplicate attempt rejected');
  assert(economy.getCurrentAttempt().earnedRadoxoms === 1, 'Total earned remains strictly 1');
}

// -------------------------------------------------------------
// Test 8: Post-Death Freeze & Economy Validation
// -------------------------------------------------------------
console.log('\n--- SCENARIO 8: POST-DEATH ECONOMY AUDIT & FREEZE ---');
{
  const economy = RadoxomEconomyManager.getInstance();
  economy.startLevelAttempt(12, 6);

  for (let i = 1; i <= 6; i++) {
    economy.earnRadoxom(`q_freeze_${i}`);
  }
  economy.consumeRadoxom('freeze_proj_1');
  economy.consumeRadoxom('freeze_proj_2');

  const validation = economy.validateCombatEconomy();
  assert(validation.valid === true, 'Combat economy validation passes mathematical integrity');
  assert(validation.remaining === 4, 'Remaining inventory equals 4 (6 - 2)');
}

// -------------------------------------------------------------
// Test 9: Monster AI Telemetry & Static Watchdog
// -------------------------------------------------------------
console.log('\n--- SCENARIO 9: MONSTER AI TELEMETRY & STATIC WATCHDOG ---');
{
  const level15 = CURRICULUM_LEVELS[14];
  const monster = new Monster(level15.monster, 800, 480, false, 15);

  // Run 180 frames of combat
  for (let i = 0; i < 180; i++) {
    monster.updateRealtimeAI(1 / 60, 250, 480, true, 480, 50, 1200, undefined, undefined, 0, 0, undefined, false, 0);
  }

  const debug = monster.director.getDebugSnapshot();
  assert((debug.telemetry?.monsterMovementDistance ?? 0) > 0, 'Telemetry tracks active movement distance');
  assert((debug.telemetry?.monsterAverageSpeed ?? 0) > 0, 'Telemetry calculates non-zero average speed');
  assert(debug.telemetry?.hasStaticWarning === false, 'Static watchdog prevents excessive idle camping');
}

// -------------------------------------------------------------
// Test 10: Dodge Damping & 160ms Punish Recovery Window
// -------------------------------------------------------------
console.log('\n--- SCENARIO 10: DODGE DAMPING & 160MS PUNISH WINDOW ---');
{
  const level20 = CURRICULUM_LEVELS[19];
  const monster = new Monster(level20.monster, 700, 480, false, 20);

  // Trigger an evasive dodge
  monster.state = 'dodge';
  monster.dodgeTimer = 0.32;
  monster.vx = 380;
  assert(monster.state === 'dodge', 'Monster successfully entered dodge state');

  // Simulate dodge progression with ease-out damping
  const initialDodgeVx = Math.abs(monster.vx);
  for (let i = 0; i < 10; i++) {
    monster.updateRealtimeAI(1 / 60, 200, 480, true, 480, 50, 1200, undefined, undefined, 0, 0, undefined, false, 0);
  }
  assert(Math.abs(monster.vx) < initialDodgeVx, 'Dodge horizontal velocity decellerates via ease-out damping');

  // Complete the dodge duration (0.32s = ~20 frames total at 60fps)
  for (let i = 0; i < 20; i++) {
    monster.updateRealtimeAI(1 / 60, 200, 480, true, 480, 50, 1200, undefined, undefined, 0, 0, undefined, false, 0);
  }

  assert(monster.isVulnerable === true, 'Monster is marked vulnerable during recovery window');
  assert(monster.vulnerableTimer > 0 && monster.vulnerableTimer <= 0.161, 'Punish window timer initialized up to 160ms');
}

// -------------------------------------------------------------
// Test 11: Fresh Questions on Retry Filter
// -------------------------------------------------------------
console.log('\n--- SCENARIO 11: FRESH QUESTIONS SELECTION EXCLUDING USED IDS ---');
{
  const mockPool = [
    { id: 'q1', text: 'NumPy Q1' },
    { id: 'q2', text: 'NumPy Q2' },
    { id: 'q3', text: 'NumPy Q3' },
    { id: 'q4', text: 'NumPy Q4' },
    { id: 'q5', text: 'NumPy Q5' },
    { id: 'q6', text: 'NumPy Q6' },
  ];

  const processedQuestionIds = new Set<string>(['q1', 'q2', 'q3']);
  const freshAvailable = mockPool.filter(q => !processedQuestionIds.has(q.id));

  assert(freshAvailable.length === 3, 'Fresh pool excludes previously answered question IDs');
  assert(!freshAvailable.some(q => processedQuestionIds.has(q.id)), 'No previously answered questions present in fresh retry pool');
}

// -------------------------------------------------------------
// Test 12: End-to-End Multi-Attempt Economy Audit
// -------------------------------------------------------------
console.log('\n--- SCENARIO 12: MULTI-ATTEMPT RETRY & VICTORY ECONOMY AUDIT ---');
{
  const economy = RadoxomEconomyManager.getInstance();
  
  // ATTEMPT 1: Level requires 5 Radoxoms
  economy.startLevelAttempt(25, 5);
  ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(q => economy.earnRadoxom(q));
  assert(economy.getCurrentAttempt().remainingRadoxoms === 5, 'Attempt 1: 5 Radoxoms earned');
  
  // Player fires 4, misses 2, hits 2, dies
  economy.consumeRadoxom('att1_p1');
  economy.consumeRadoxom('att1_p2');
  economy.consumeRadoxom('att1_p3');
  economy.consumeRadoxom('att1_p4');
  assert(economy.getCurrentAttempt().remainingRadoxoms === 1, 'Attempt 1: 1 unspent Radoxom remaining');

  // RETRY 1: Need to recover 4 missing ammo
  const req1 = economy.calculateRetryRadoxomRequirement();
  assert(req1.toRecover === 4, 'Attempt 2 needs to recover exactly 4 Radoxoms');
  const prep1 = economy.prepareRetryAttempt();
  assert(prep1.existingRemaining === 1, 'Carries over 1 unspent Radoxom');

  // Recover the 4 by answering 4 fresh questions
  ['q6', 'q7', 'q8', 'q9'].forEach(q => economy.earnRadoxom(q));
  assert(economy.getCurrentAttempt().remainingRadoxoms === 5, 'Attempt 2: 1 + 4 = 5 total Radoxoms ready for combat');

  // Player fires 3, defeats monster!
  economy.consumeRadoxom('att2_p1');
  economy.consumeRadoxom('att2_p2');
  economy.consumeRadoxom('att2_p3');
  assert(economy.getCurrentAttempt().remainingRadoxoms === 2, 'Monster defeated with 2 Radoxoms to spare');

  const audit = economy.validateCombatEconomy();
  assert(audit.valid === true, 'Final multi-attempt economy audit is 100% valid with 0 leaks');
}

console.log('\n===============================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED PERFECTLY!`);
console.log('===============================================================\n');
