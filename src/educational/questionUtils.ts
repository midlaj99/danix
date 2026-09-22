import { Question, MiniPractice } from '../types/curriculum';

/**
 * Modern Fisher-Yates array shuffler.
 * Returns a new shuffled array without mutating the original.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Prepares a Question with randomized option ordering.
 * Eliminates the loophole where the correct answer is always at index 0.
 * Guarantees that correctAnswer remains in options, but its index is non-deterministic.
 */
export function shuffleQuestion(question: Question): Question {
  if (!question || !question.options || question.options.length <= 1) {
    return question;
  }

  // Shuffle options until the correct answer is not guaranteed to be at index 0
  const shuffledOptions = shuffleArray(question.options);

  return {
    ...question,
    options: shuffledOptions,
  };
}

/**
 * Prepares a MiniPractice with randomized option ordering and an updated correctIndex.
 * Eliminates the loophole where the correct option is always the first choice.
 */
export function shuffleMiniPractice(practice: MiniPractice): MiniPractice {
  if (!practice || !practice.options || practice.options.length <= 1) {
    return practice;
  }

  const originalCorrectAnswer = practice.options[practice.correctIndex] ?? practice.options[0];
  const shuffledOptions = shuffleArray(practice.options);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectAnswer);

  return {
    ...practice,
    options: shuffledOptions,
    correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0,
  };
}
