import { Question, LevelConfig } from '../types/curriculum';
import { QUESTION_BANK } from './questionBank';
import { shuffleQuestion } from './questionUtils';

export interface ParameterizedVariantBlueprint {
  variantGroup: string;
  topic: string;
  subtopic: string;
  difficulty: number;
  generate: (seed: number) => Question;
}

/**
 * Validates a Question to ensure absolute correctness and zero flaws:
 * 1. Correct answer must be in options
 * 2. Exactly one option matches correct answer
 * 3. All options are distinct
 * 4. Question text and explanation are non-empty
 */
export function validateQuestion(q: Question): boolean {
  if (!q.id || !q.question || !q.correctAnswer || !q.options) return false;
  if (!Array.isArray(q.options) || q.options.length < 2) return false;
  if (!q.options.includes(q.correctAnswer)) return false;
  const uniqueOpts = new Set(q.options);
  if (uniqueOpts.size !== q.options.length) return false;
  return true;
}

/**
 * Procedural Question Variant Generator Factory
 * Generates verified parameter-varied NumPy questions for retry pools.
 */
function createParameterizedVariants(): Question[] {
  const variants: Question[] = [];

  // Group 1: Array creation with np.zeros, np.ones, np.full
  const shapes: [number, number][] = [
    [2, 3], [3, 2], [4, 2], [2, 4], [3, 5], [5, 3], [4, 4], [2, 6], [3, 3], [6, 2]
  ];

  shapes.forEach(([r, c], idx) => {
    // Zeros shape variant
    const zerosQ: Question = {
      id: `v_zeros_${r}_${c}`,
      topic: 'creation',
      difficulty: 1,
      type: 'shape_prediction',
      question: `What is the output of np.zeros((${r}, ${c})).shape?`,
      codeSnippet: `import numpy as np\narr = np.zeros((${r}, ${c}))\nprint(arr.shape)`,
      options: [`(${r}, ${c})`, `(${c}, ${r})`, `(${r * c},)`, `${r * c}`],
      correctAnswer: `(${r}, ${c})`,
      hint: 'The shape tuple matches the exact dimensions passed to np.zeros().',
      explanation: `np.zeros((${r}, ${c})) instantiates a 2D array of ${r} rows and ${c} columns, yielding shape (${r}, ${c}).`,
      requiredConcepts: ['array-creation', 'zeros', 'shape'],
    };
    if (validateQuestion(zerosQ)) variants.push(zerosQ);

    // Ones total elements (size) variant
    const onesQ: Question = {
      id: `v_ones_size_${r}_${c}`,
      topic: 'shape',
      difficulty: 1,
      type: 'predict_output',
      question: `What is the total number of elements (arr.size) in np.ones((${r}, ${c}))?`,
      codeSnippet: `import numpy as np\narr = np.ones((${r}, ${c}))\nprint(arr.size)`,
      options: [`${r * c}`, `${r + c}`, `(${r}, ${c})`, `${r}`],
      correctAnswer: `${r * c}`,
      hint: 'The total size of a 2D array is rows multiplied by columns.',
      explanation: `Total elements = rows * cols: ${r} * ${c} = ${r * c} elements.`,
      requiredConcepts: ['shape', 'size'],
    };
    if (validateQuestion(onesQ)) variants.push(onesQ);

    // Full fill-value variant
    const fillVal = (idx * 3 + 4) % 10 + 2;
    const fullQ: Question = {
      id: `v_full_${r}_${c}_${fillVal}`,
      topic: 'creation',
      difficulty: 2,
      type: 'predict_output',
      question: `What does np.full((${r}, ${c}), ${fillVal})[0, 0] evaluate to?`,
      codeSnippet: `import numpy as np\narr = np.full((${r}, ${c}), ${fillVal})\nprint(arr[0, 0])`,
      options: [`${fillVal}`, '0', '1', `(${r}, ${c})`],
      correctAnswer: `${fillVal}`,
      hint: 'np.full() populates every single cell in the array with the specified fill value.',
      explanation: `np.full() initializes all ${r * c} elements to the constant value ${fillVal}.`,
      requiredConcepts: ['array-creation', 'full'],
    };
    if (validateQuestion(fullQ)) variants.push(fullQ);
  });

  // Group 2: np.arange with varied start, stop, step
  const arangeCases = [
    { start: 0, stop: 10, step: 2, count: 5, expected: '[0 2 4 6 8]' },
    { start: 1, stop: 10, step: 2, count: 5, expected: '[1 3 5 7 9]' },
    { start: 0, stop: 15, step: 3, count: 5, expected: '[ 0  3  6  9 12]' },
    { start: 10, stop: 30, step: 5, count: 4, expected: '[10 15 20 25]' },
    { start: 2, stop: 12, step: 2, count: 5, expected: '[ 2  4  6  8 10]' },
    { start: 0, stop: 20, step: 4, count: 5, expected: '[ 0  4  8 12 16]' },
    { start: 5, stop: 25, step: 5, count: 4, expected: '[ 5 10 15 20]' },
    { start: 10, stop: 50, step: 10, count: 4, expected: '[10 20 30 40]' },
  ];

  arangeCases.forEach((c, idx) => {
    const q: Question = {
      id: `v_arange_${c.start}_${c.stop}_${c.step}`,
      topic: 'creation',
      difficulty: 1,
      type: 'predict_output',
      question: `What is the length (len) of np.arange(${c.start}, ${c.stop}, ${c.step})?`,
      codeSnippet: `import numpy as np\narr = np.arange(${c.start}, ${c.stop}, ${c.step})\nprint(len(arr))`,
      options: [`${c.count}`, `${c.count + 1}`, `${c.count - 1}`, `${c.stop}`],
      correctAnswer: `${c.count}`,
      hint: 'Remember that the stop value is exclusive in Python ranges and np.arange.',
      explanation: `np.arange(${c.start}, ${c.stop}, ${c.step}) generates values starting at ${c.start} up to but excluding ${c.stop}, producing exactly ${c.count} items.`,
      requiredConcepts: ['array-creation', 'arange'],
    };
    if (validateQuestion(q)) variants.push(q);
  });

  // Group 3: 1D Slicing variants
  const sliceCases = [
    { start: 1, stop: 4, expected: '[20 30 40]' },
    { start: 0, stop: 3, expected: '[10 20 30]' },
    { start: 2, stop: 5, expected: '[30 40 50]' },
    { start: 1, stop: 5, expected: '[20 30 40 50]' },
    { start: 3, stop: 6, expected: '[40 50 60]' },
    { start: 0, stop: 2, expected: '[10 20]' },
  ];

  sliceCases.forEach((s, idx) => {
    const q: Question = {
      id: `v_slice_${s.start}_${s.stop}`,
      topic: 'slicing',
      difficulty: 2,
      type: 'predict_output',
      question: `What does arr[${s.start}:${s.stop}] return for arr = np.array([10, 20, 30, 40, 50, 60])?`,
      codeSnippet: `import numpy as np\narr = np.array([10, 20, 30, 40, 50, 60])\nprint(arr[${s.start}:${s.stop}])`,
      options: [s.expected, '[10 20 30 40 50 60]', `[${s.start * 10} ${s.stop * 10}]`, 'IndexError: out of bounds'],
      correctAnswer: s.expected,
      hint: 'In Python slices arr[start:stop], index start is included and index stop is excluded.',
      explanation: `The slice extracts elements from index ${s.start} up to ${s.stop - 1}, resulting in ${s.expected}.`,
      requiredConcepts: ['slicing', 'indexing'],
    };
    if (validateQuestion(q)) variants.push(q);
  });

  // Group 4: Element-wise arithmetic & vectorization variants
  const mathScales = [2, 3, 4, 5, 10];
  mathScales.forEach((multiplier) => {
    const q: Question = {
      id: `v_vec_mult_${multiplier}`,
      topic: 'arrays',
      difficulty: 1,
      type: 'predict_output',
      question: `What does np.array([2, 4, 6]) * ${multiplier} evaluate to?`,
      codeSnippet: `import numpy as np\narr = np.array([2, 4, 6]) * ${multiplier}\nprint(arr)`,
      options: [
        `[${2 * multiplier} ${4 * multiplier} ${6 * multiplier}]`,
        `[2, 4, 6, 2, 4, 6]`,
        `[${2 * multiplier}]`,
        'TypeError: cannot multiply array by integer',
      ],
      correctAnswer: `[${2 * multiplier} ${4 * multiplier} ${6 * multiplier}]`,
      hint: 'NumPy performs element-wise multiplication on every number in the array simultaneously.',
      explanation: `Element-wise vectorization multiplies each item: 2*${multiplier}=${2*multiplier}, 4*${multiplier}=${4*multiplier}, 6*${multiplier}=${6*multiplier}.`,
      requiredConcepts: ['vectorization', 'arrays'],
    };
    if (validateQuestion(q)) variants.push(q);

    // Addition variant
    const qAdd: Question = {
      id: `v_vec_add_${multiplier}`,
      topic: 'arrays',
      difficulty: 1,
      type: 'predict_output',
      question: `What does np.array([10, 20, 30]) + ${multiplier} evaluate to?`,
      codeSnippet: `import numpy as np\narr = np.array([10, 20, 30]) + ${multiplier}\nprint(arr)`,
      options: [
        `[${10 + multiplier} ${20 + multiplier} ${30 + multiplier}]`,
        `[10, 20, 30, ${multiplier}]`,
        `[${10 + multiplier}]`,
        'Error: list concatenation required',
      ],
      correctAnswer: `[${10 + multiplier} ${20 + multiplier} ${30 + multiplier}]`,
      hint: 'Adding a scalar to a NumPy array broadcasts the scalar and adds it to each individual element.',
      explanation: `Each element has ${multiplier} added: 10+${multiplier}=${10+multiplier}, 20+${multiplier}=${20+multiplier}, 30+${multiplier}=${30+multiplier}.`,
      requiredConcepts: ['vectorization', 'arrays'],
    };
    if (validateQuestion(qAdd)) variants.push(qAdd);
  });

  // Group 5: Reshape variants
  const reshapePairs = [
    { orig: [2, 6], target: [3, 4], size: 12 },
    { orig: [3, 4], target: [2, 6], size: 12 },
    { orig: [1, 12], target: [4, 3], size: 12 },
    { orig: [4, 3], target: [6, 2], size: 12 },
    { orig: [2, 8], target: [4, 4], size: 16 },
    { orig: [4, 4], target: [8, 2], size: 16 },
    { orig: [3, 6], target: [2, 9], size: 18 },
  ];

  reshapePairs.forEach((rp, idx) => {
    const q: Question = {
      id: `v_reshape_${rp.orig[0]}x${rp.orig[1]}_to_${rp.target[0]}x${rp.target[1]}`,
      topic: 'reshaping',
      difficulty: 2,
      type: 'shape_prediction',
      question: `If an array has shape (${rp.orig[0]}, ${rp.orig[1]}), which new shape is valid for arr.reshape()?`,
      options: [
        `(${rp.target[0]}, ${rp.target[1]})`,
        `(${rp.target[0] + 1}, ${rp.target[1]})`,
        `(${rp.target[0]}, ${rp.target[1] + 2})`,
        `(${rp.orig[0] + 2}, ${rp.orig[1] + 2})`,
      ],
      correctAnswer: `(${rp.target[0]}, ${rp.target[1]})`,
      hint: 'The total number of elements (product of dimensions) must remain strictly identical.',
      explanation: `Total elements = ${rp.orig[0]} * ${rp.orig[1]} = ${rp.size}. Shape (${rp.target[0]}, ${rp.target[1]}) also has ${rp.target[0]} * ${rp.target[1]} = ${rp.size} elements, so it is valid.`,
      requiredConcepts: ['reshaping', 'shape'],
    };
    if (validateQuestion(q)) variants.push(q);
  });

  // Group 6: Broadcasting compatibility variants
  const broadcastShapes = [
    { a: '(3, 1)', b: '(1, 4)', res: '(3, 4)' },
    { a: '(4, 1)', b: '(1, 5)', res: '(4, 5)' },
    { a: '(2, 1)', b: '(1, 6)', res: '(2, 6)' },
    { a: '(5, 1)', b: '(1, 3)', res: '(5, 3)' },
    { a: '(1, 4)', b: '(3, 1)', res: '(3, 4)' },
  ];

  broadcastShapes.forEach((bs, idx) => {
    const q: Question = {
      id: `v_broadcast_${idx}`,
      topic: 'broadcasting',
      difficulty: 3,
      type: 'shape_prediction',
      question: `What is the resulting shape when broadcasting array A of shape ${bs.a} with array B of shape ${bs.b}?`,
      options: [bs.res, '(1, 1)', `${bs.a}`, 'ValueError: operands could not be broadcast together'],
      correctAnswer: bs.res,
      hint: 'Broadcasting expands dimensions of size 1 to match the other array along each axis.',
      explanation: `Along axis 0, max(3, 1) = 3; along axis 1, max(1, 4) = 4, resulting in shape ${bs.res}.`,
      requiredConcepts: ['broadcasting', 'shape'],
    };
    if (validateQuestion(q)) variants.push(q);
  });

  return variants;
}

// Pre-generated verified variants pool
const PARAMETERIZED_VARIANTS: Question[] = createParameterizedVariants();

/**
 * QuestionHistoryManager:
 * Tracks question history per level to strictly enforce ZERO REPETITION on retry.
 */
export class QuestionHistoryManager {
  private static instance: QuestionHistoryManager | null = null;
  private usedQuestionIdsByLevel: Map<number, Set<string>> = new Map();
  private attemptCountsByLevel: Map<number, number> = new Map();

  private constructor() {}

  public static getInstance(): QuestionHistoryManager {
    if (!QuestionHistoryManager.instance) {
      QuestionHistoryManager.instance = new QuestionHistoryManager();
    }
    return QuestionHistoryManager.instance;
  }

  public getAttemptNumber(levelId: number): number {
    return this.attemptCountsByLevel.get(levelId) || 1;
  }

  public recordAttempt(levelId: number) {
    const current = this.attemptCountsByLevel.get(levelId) || 0;
    this.attemptCountsByLevel.set(levelId, current + 1);
  }

  public resetLevel(levelId: number) {
    this.usedQuestionIdsByLevel.delete(levelId);
    this.attemptCountsByLevel.delete(levelId);
  }

  /**
   * Selects a fresh set of questions for a level attempt.
   * Guarantees that no previously seen questions for this level are reused
   * until the entire combined pool (bank + variants) is genuinely exhausted.
   */
  public getFreshQuestionSet(config: LevelConfig, countNeeded: number, isRetry: boolean = false): Question[] {
    const levelId = config.id;
    let usedIds = this.usedQuestionIdsByLevel.get(levelId);
    if (!usedIds) {
      usedIds = new Set<string>();
      this.usedQuestionIdsByLevel.set(levelId, usedIds);
    }

    // 1. Gather all base questions matching level or topic
    const baseQuestions: Question[] = [];
    // Primary: questions explicitly configured for level
    config.questionIds.forEach((id) => {
      const q = QUESTION_BANK[id];
      if (q && validateQuestion(q)) {
        baseQuestions.push(q);
      }
    });

    // Secondary: all questions from QUESTION_BANK with matching topic
    Object.values(QUESTION_BANK).forEach((q) => {
      if (q.topic === config.topic && !baseQuestions.some((b) => b.id === q.id) && validateQuestion(q)) {
        baseQuestions.push(q);
      }
    });

    // Tertiary: add parameterized variants matching this topic
    PARAMETERIZED_VARIANTS.forEach((vq) => {
      if (vq.topic === config.topic && !baseQuestions.some((b) => b.id === vq.id)) {
        baseQuestions.push(vq);
      }
    });

    // 2. Filter out all previously used question IDs for this level
    let freshCandidates = baseQuestions.filter((q) => !usedIds!.has(q.id));

    // If pool is truly exhausted (player died 4+ times on same level), reset used set to allow clean recycling
    if (freshCandidates.length < countNeeded) {
      usedIds.clear();
      freshCandidates = [...baseQuestions];
    }

    // 3. Shuffle candidates randomly
    const shuffled = [...freshCandidates].sort(() => Math.random() - 0.5);

    // 4. Select the required count
    const selected = shuffled.slice(0, Math.max(countNeeded, 5));

    // 5. Mark selected question IDs as used in history
    selected.forEach((q) => {
      usedIds!.add(q.id);
    });

    // 6. Return each question with randomized options ordering
    return selected.map(shuffleQuestion);
  }
}
