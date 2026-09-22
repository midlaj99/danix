declare const process: any;
import { Monster } from './entities/Monster';
import { CURRICULUM_LEVELS } from '../educational/curriculumData';

console.log('=== REAL-TIME COMBAT AI & ANTI-STUN-LOCK VERIFICATION TEST ===\n');

// 1. Test Level 1 Monster Initialization
const level1 = CURRICULUM_LEVELS[0];
const monster = new Monster(level1.monster, 850, 480, false, 1);
monster.isEntering = false; // Bypass entrance cinematic for direct combat test

console.log(`[INIT] Monster spawned: Archetype=${monster.config.name}, HP=${monster.currentHp}/${monster.maxHp}`);
console.log(`[INIT] Difficulty: level=1, attackCooldown=${monster.difficulty.attackCooldown}s, dodgeChance=${monster.difficulty.dodgeChance}, speed=${monster.difficulty.movementSpeed}px/s`);
console.log(`[INIT] Poise: current=${monster.director.poise}/${monster.director.maxPoise}`);

// 2. Test Active Movement Footwork from Frame 1
let heroX = 400;
let heroY = 400;
const groundY = 480;
const arenaMinX = 50;
const arenaMaxX = 1150;

let movedDistance = 0;
let previousX = monster.x;
let attackTriggered = false;

// Simulate 2.5 seconds of combat ticks
const dt = 0.05;
for (let t = 0; t < 2.5; t += dt) {
  monster.updateRealtimeAI(
    dt,
    heroX,
    heroY,
    true,
    groundY,
    arenaMinX,
    arenaMaxX,
    undefined,
    (dmg) => {
      attackTriggered = true;
      console.log(`[ATTACK EXECUTION] Monster executed melee damage: ${dmg} at t=${t.toFixed(2)}s`);
    },
    0,
    0,
    undefined,
    false
  );

  movedDistance += Math.abs(monster.x - previousX);
  previousX = monster.x;
}

const avgSpeed = movedDistance / 2.5;
console.log(`[MOVEMENT RESULT] Monster moved total ${movedDistance.toFixed(1)}px over 2.5s (Average Speed: ${avgSpeed.toFixed(1)} px/s)`);

if (avgSpeed < 50) {
  console.error('FAIL: Monster was too static on Level 1!');
  process.exit(1);
} else {
  console.log('✅ PASS: Monster is actively mobile on Level 1 (NOT a target dummy)');
}

// 3. Anti-Stun-Lock & Poise Resistance Verification
console.log('\n--- TESTING ANTI-STUN-LOCK HIT RESOLUTION ---');
const initialHp = monster.currentHp;
const initialPoise = monster.director.poise;

// Player fires 1 hit (50 damage)
monster.triggerHurt(50);
console.log(`[HIT 1] Damage 50 applied. HP: ${monster.currentHp}/${monster.maxHp}, Poise: ${monster.director.poise}/${monster.director.maxPoise}, State: ${monster.state}`);

if (monster.state === 'hurt') {
  console.error('FAIL: Normal hit should NOT cause heavy stagger state when poise is intact!');
  process.exit(1);
} else {
  console.log('✅ PASS: Poise absorbed normal hit without freezing AI into hurt state.');
}

// Tick AI immediately after hit to confirm it continues moving
monster.updateRealtimeAI(dt, heroX, heroY, true, groundY, arenaMinX, arenaMaxX);
console.log(`[AI TICK AFTER HIT] Monster state: ${monster.state}, vx: ${monster.vx.toFixed(1)} px/s`);
if (Math.abs(monster.vx) < 10 && monster.state === 'idle') {
  console.error('FAIL: Monster froze after taking hit!');
  process.exit(1);
} else {
  console.log('✅ PASS: Monster maintained footwork and dynamic movement immediately after hit.');
}

// 4. Test Anticipatory Projectile Evasion
console.log('\n--- TESTING ANTICIPATORY PROJECTILE EVASION ---');
monster.state = 'chase';
monster.attackCooldown = 2.0;
monster.isVulnerable = false;
monster.dodgeCooldown = 0;
monster.director.dodgeCharges = 1;

// Simulate incoming Radoxom projectile moving right towards monster
const fakeProjectiles = [
  { x: monster.x - 180, y: monster.y, vx: 500, vy: 0 }
];

let dodged = false;
// Test up to 15 attempts (dodge chance is 25% at Level 1, so in 15 attempts it should succeed at least once)
for (let attempt = 1; attempt <= 15; attempt++) {
  monster.dodgeCooldown = 0;
  monster.director.dodgeCharges = 1;
  const result = monster.attemptDodgeProjectile(fakeProjectiles[0].x, fakeProjectiles[0].y, fakeProjectiles[0].vx);
  if (result) {
    dodged = true;
    console.log(`[EVASION] Attempt ${attempt}: Monster successfully executed anticipatory dodge! State: ${monster.state}, vx: ${monster.vx.toFixed(1)} px/s, vy: ${monster.vy.toFixed(1)} px/s`);
    break;
  }
}

if (!dodged) {
  console.error('FAIL: Anticipatory dodge never triggered!');
  process.exit(1);
} else {
  console.log('✅ PASS: Anticipatory evasion functioning properly.');
}

// 5. Test Static Watchdog
console.log('\n--- TESTING STATIC WATCHDOG ---');
monster.state = 'chase';
monster.vx = 0;
monster.staticWatchdogTimer = 1.1; // Force stationary state > 1.0s
monster.updateRealtimeAI(dt, heroX, heroY, true, groundY, arenaMinX, arenaMaxX);
console.log(`[WATCHDOG RESULT] Monster vx after watchdog trigger: ${monster.vx.toFixed(1)} px/s`);
if (Math.abs(monster.vx) < 30) {
  console.error('FAIL: Static watchdog did not break static freeze!');
  process.exit(1);
} else {
  console.log('✅ PASS: Static watchdog actively dislodges frozen/stalled states.');
}

console.log('\n🌟 ALL COMBAT AI REAL-TIME TESTS PASSED SUCCESSFULLY! 🌟\n');
