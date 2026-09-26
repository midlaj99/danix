import { Hero } from './entities/Hero';
import { CURRICULUM_LEVELS } from '../educational/curriculumData';

console.log('===============================================================');
console.log('🚀 TESTING ULTIMATE SKILL & FINISHING MOVE QA SYSTEM');
console.log('===============================================================');

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${msg}`);
    throw new Error(msg);
  } else {
    console.log(`✅ [PASS] ${msg}`);
  }
}

// 1. Hero Ultimate Charge Accumulation
const hero = new Hero();
assert(hero.ultimateCharge === 0, 'Hero begins with 0 ultimate charge');
assert(!hero.isUltimateReady(), 'Ultimate is not ready at 0 charge');

hero.addUltimateCharge(14);
assert(hero.ultimateCharge === 14, 'Hero charges +14 on melee strike');

hero.addUltimateCharge(18);
assert(hero.ultimateCharge === 32, 'Hero charges +18 on radoxom hit');

hero.addUltimateCharge(20);
assert(hero.ultimateCharge === 52, 'Hero charges +20 on tactical dodge roll');

hero.addUltimateCharge(50);
assert(hero.ultimateCharge === 100, 'Ultimate charge caps at 100 max');
assert(hero.isUltimateReady(), 'Ultimate is marked READY at 100 charge');

// 2. Skill-Specific Ultimate Names
hero.setSkill('Array Strike');
assert(hero.ultimateName === 'Zero-G Shatter', 'Array Strike maps to Zero-G Shatter');

hero.setSkill('Dimensional Cleave');
assert(hero.ultimateName === 'Dimensional Hyper-Cleave', 'Dimensional Cleave maps to Dimensional Hyper-Cleave');

hero.setSkill('Flame Blast');
assert(hero.ultimateName === 'Zero-G Supernova', 'Flame Blast maps to Zero-G Supernova');

hero.setSkill('Matrix Genesis Beam');
assert(hero.ultimateName === 'Matrix Particle Purge', 'Matrix Beam maps to Matrix Particle Purge');

hero.setSkill('Sovereign Mastery');
assert(hero.ultimateName === 'Sovereign Omnislash', 'Sovereign maps to Sovereign Omnislash');

// 3. Reset after ultimate execution
hero.resetUltimate();
assert(hero.ultimateCharge === 0, 'Ultimate charge properly resets to 0 after use');
assert(!hero.isUltimateReady(), 'Ultimate is no longer ready after reset');

// 4. Verify all 42 Levels have Boss Archetypes with Dialogue
CURRICULUM_LEVELS.forEach((level) => {
  assert(level.monster !== undefined, `Level ${level.id} has defined monster`);
  assert(level.monster.name.length > 0, `Level ${level.id} monster has valid name: ${level.monster.name}`);
  assert(level.monster.introDialogue.length > 0, `Level ${level.id} monster has intro taunt dialogue`);
  assert(level.monster.hp > 0, `Level ${level.id} monster has valid HP`);
});

console.log('===============================================================');
console.log('🎉 ALL ULTIMATE & BOSS ENCOUNTER CHECKS PASSED PERFECTLY!');
console.log('===============================================================');
