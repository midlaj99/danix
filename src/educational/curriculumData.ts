import { LevelConfig } from '../types/curriculum';

export const CURRICULUM_LEVELS: LevelConfig[] = [
  // =========================================================================
  // WORLD 1 — NUMPY BEGINNER / FOUNDATIONS (LEVELS 1 - 4)
  // =========================================================================

  // LEVEL 1: WHAT IS NUMPY?
  {
    id: 1,
    worldId: 1,
    worldTitle: 'World 1: Foundations',
    title: 'The Awakening: What is NumPy?',
    subtitle: 'Numerical Python vs Standard Python Lists',
    topic: 'arrays',
    masteryCategory: 'Array Creation',
    levelType: 'exploration',
    environment: {
      name: 'Peaceful Japanese Sakura Village',
      type: 'village',
      skyColor: '#1e1b4b',
      groundColor: '#292524',
      accentColor: '#f472b6',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Konnichiwa, brave traveler! Welcome to the sacred lands of the NumPy Kingdom.',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'I am Aria, your guide through these numerical realms.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Before you face the rogue demons beyond this peaceful village, you must learn the foundational essence of all numerical computing: NumPy.',
        expression: 'serious',
      },
    ],
    theory: {
      partA: {
        title: "What is NumPy & Why Does It Exist?",
        concept: "Contiguous C memory blocks, ndarray type, and SIMD hardware acceleration",
        simpleAnalogy: "Imagine organizing your workspace: standard Python lists are like loose items scattered across different drawers, so finding each one takes extra time. A NumPy array is like a precision-molded tool tray where identical items snap side-by-side into a single contiguous block. Because they are aligned in memory, your computer processor can operate on all of them in a single hardware cycle!",
        explanation: "• NumPy's core object is numpy.ndarray (<class 'numpy.ndarray'>), created with np.array().\n• Python lists store memory pointers to scattered heap objects; NumPy stores raw contiguous C data in RAM.\n• NumPy math is vectorized: arr * 2 multiplies every number at native C speed without slow for-loops.\n• Arrays are strictly homogeneous: mixing numbers and strings (e.g. [1, 2, 'three']) causes NumPy to upcast everything to matching strings (['1' '2' 'three']).\n• Python lists repeat on multiplication ([1, 2] * 2 == [1, 2, 1, 2]); NumPy multiplies element-wise ([2 4]).",
        whyUseIt: "Executes numerical math 10x to 50x faster than standard Python loops by leveraging CPU cache locality and SIMD hardware instructions.",
        useCases: [
          "Machine learning models & neural network tensor operations",
          "Computer vision & image processing matrices",
          "Scientific simulations & high-frequency quantitative analytics",
          "Audio signal processing & Fourier transformation",
        ],
      },
      partB: {
        title: "Importing NumPy and ndarray Basics",
        concept: "Aliasing module as np, inspecting types, and element-wise arithmetic",
        code: `import numpy as np

# Standard Python list multiplication duplicates the sequence
py_list = [1, 2, 3]
print("Python list * 2:", py_list * 2)

# NumPy array multiplication performs vectorized element-wise math!
np_arr = np.array([1, 2, 3])
print("NumPy array * 2:", np_arr * 2)
print("Array Type:", type(np_arr))

# Homogeneity: mixed types are upcast to a common type (e.g. strings)
mixed_arr = np.array([1, 2, "three"])
print("Mixed array:", mixed_arr)`,
        output: `Python list * 2: [1, 2, 3, 1, 2, 3]
NumPy array * 2: [2 4 6]
Array Type: <class 'numpy.ndarray'>
Mixed array: ['1' '2' 'three']`,
        breakdown: "• 'import numpy as np' is the universally adopted standard convention.\n• 'type(np_arr)' confirms the core class is <class 'numpy.ndarray'>.\n• 'np_arr * 2' multiplies each element in-place via vectorization, turning [1, 2, 3] into [2, 4, 6].\n• Mixed types like [1, 2, 'three'] automatically upcast to strings: ['1' '2' 'three'].",
        visualArray: [['1', '2', '3']],
      },
    },
    miniPractice: {
      question: 'Which statement correctly imports NumPy under its standard alias?',
      codeSnippet: '# Choose the standard data science import statement',
      options: [
        'import numpy as np',
        'include numpy',
        'import numpy.all as np',
        'from numpy import everything',
      ],
      correctIndex: 0,
      explanation: '`import numpy as np` is the universal, industry-standard alias across all Python data science.',
    },
    monster: {
      name: 'Oni Vanguard Scout',
      archetype: 'Forest Demon Scout',
      hp: 150,
      maxHp: 150,
      attack: 18,
      introDialogue: [
        'Grrrr! An apprentice wanders into our sacred village borders?',
        'Think you understand vector arrays? Feed my claws!',
      ],
      defeatDialogue: 'Impossible... your vector calculations broke through my demonic guard!',
      color: '#ef4444',
      spriteType: 'demon_beast',
      aiProfile: {
        movementSpeed: 160,
        reactionDelay: 0.35,
        attackFrequency: 2.2,
        dodgeChance: 0.15,
        predictionStrength: 0.1,
        aggression: 0.5,
        preferredDistance: 140,
        personality: 'aggressive_beast',
      },
    },
    questionIds: ['q_arr_01', 'q_arr_02', 'q_arr_03', 'q_arr_04', 'q_arr_05', 'q_arr_06'],
    rewardXp: 120,
    unlockedSkill: {
      name: 'Array Strike',
      description: 'Channel contiguous memory energy to strike enemies with vectorized force!',
      icon: 'Zap',
    },
  },

  // LEVEL 2: CREATING ARRAYS (1D, 2D, 3D)
  {
    id: 2,
    worldId: 1,
    worldTitle: 'World 1: Foundations',
    title: 'The Grove of Dimensions: Creating Arrays',
    subtitle: '1D, 2D, 3D Arrays & Nested Lists',
    topic: 'creation',
    masteryCategory: 'Array Creation',
    levelType: 'puzzle_platforms',
    puzzleGate: {
      id: 'gate_create_arr',
      x: 480,
      prompt: 'Runic Array Gate: Instantiate multidimensional coordinates to raise bridge',
      questionId: 'q_create_arr_01',
      bridgeStartX: 470,
      bridgeEndX: 690,
      activated: false,
    },
    environment: {
      name: 'Bamboo Forest of Dimensions',
      type: 'forest',
      skyColor: '#064e3b',
      groundColor: '#14532d',
      accentColor: '#22c55e',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Look at the tall bamboo around you. Each stalk is a 1D column, but together they form a 2D forest grid!',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: '`np.array()` converts nested Python lists into multi-dimensional matrices and 3D tensors.',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "Building Multi-Dimensional Structures",
        concept: "1D vectors, 2D matrices, and 3D tensors from nested lists",
        simpleAnalogy: "Think of dimensions like geometry in the physical world: a 1D array is a straight ruler (length), a 2D array is a spreadsheet or sheet of paper (rows and columns), and a 3D array is a stack of papers forming a book (depth, rows, and columns).",
        explanation: "• 1D vector: Shape (N,), ndim=1, representing a single line of numbers.\n• 2D matrix: Shape (rows, cols), ndim=2, created from nested lists like [[1, 2], [3, 4]].\n• 3D tensor: Shape (blocks, rows, cols), ndim=3, created from 3 levels of nested brackets.\n• len(arr) on a 2D array always returns the outer dimension size (the number of rows).\n• Modern NumPy requires all sub-lists to have equal lengths; passing ragged/uneven rows raises a ValueError.",
        whyUseIt: "Structures multi-dimensional data like tabular tables, color image pixel matrices, and video volumes into predictable grids.",
        useCases: [
          "Tabular datasets: 2D array with shape (samples, features)",
          "Digital images: 2D grayscale (height, width) or 3D color (height, width, channels)",
          "Video streaming: 4D tensor (frames, height, width, channels)",
        ],
      },
      partB: {
        title: "Constructing 1D, 2D, and 3D Arrays",
        concept: "Building multi-axis arrays and inspecting shapes and ndim",
        code: `import numpy as np

# 1D Vector (shape: (3,), ndim: 1)
v = np.array([10, 20, 30])

# 2D Matrix (4 rows, 3 columns) -> shape: (4, 3), len(m) == 4, ndim: 2
m = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]])
print("2D shape:", m.shape, "| ndim:", m.ndim, "| len(m):", len(m))

# 3D Tensor (3 blocks, 2 rows, 2 columns) -> shape: (3, 2, 2), ndim: 3
t = np.array([
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]],
  [[9, 10], [11, 12]]
])
print("3D shape:", t.shape, "| ndim:", t.ndim)`,
        output: `2D shape: (4, 3) | ndim: 2 | len(m): 4
3D shape: (3, 2, 2) | ndim: 3`,
        breakdown: "• 'v = np.array([10, 20, 30])' creates a 1D vector (shape: (3,), ndim: 1).\n• 'm = np.array(...)' creates a 2D matrix (shape: (4, 3), ndim: 2). Here, len(m) returns 4 (rows).\n• 't = np.array(...)' creates a 3D tensor (shape: (3, 2, 2), ndim: 3).\n• Passing uneven lists like [[1, 2], [3]] raises 'ValueError: setting an array element with a sequence'.",
        visualArray: [
          ['1', '2', '3'],
          ['4', '5', '6'],
        ],
      },
    },
    miniPractice: {
      question: 'What is the dimension (ndim) of an array initialized with [[10, 20], [30, 40], [50, 60]]?',
      options: ['2', '3', '6', '1'],
      correctIndex: 0,
      explanation: 'There are two levels of nesting: outer list containing row lists. Hence it is a 2D matrix (ndim = 2).',
    },
    monster: {
      name: 'Shadow Bamboo Phantom',
      archetype: 'Evasive Forest Stalker',
      hp: 160,
      maxHp: 160,
      attack: 20,
      introDialogue: [
        'You weave matrices out of thin air? Let us see if your coordinates can strike my shifting shadows!',
      ],
      defeatDialogue: 'My multi-axis form... resolved into a singular zero!',
      color: '#a855f7',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 190,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.2,
        aggression: 0.6,
        preferredDistance: 160,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_create_arr_01', 'q_create_arr_02', 'q_create_arr_03', 'q_create_arr_04', 'q_create_arr_05'],
    rewardXp: 150,
    unlockedSkill: {
      name: 'Dimension Slash',
      description: 'Strike across multi-dimensional planes with matrix precision!',
      icon: 'Layers',
    },
  },

  // LEVEL 3: ARRAY ATTRIBUTES (ndim, shape, size, itemsize, nbytes)
  {
    id: 3,
    worldId: 1,
    worldTitle: 'World 1: Foundations',
    title: 'The Ancient Pagoda: Array Attributes',
    subtitle: 'Mastering ndim, shape, size, itemsize & nbytes',
    topic: 'shape',
    masteryCategory: 'Array Attributes',
    levelType: 'exploration',
    environment: {
      name: 'Pagoda Mist Gardens',
      type: 'village',
      skyColor: '#0f172a',
      groundColor: '#334155',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Every physical structure in this pagoda has dimensions, height, weight, and density.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'NumPy arrays have attributes too: `ndim` (dimensions), `shape` (rows & columns), `size` (total elements), and `nbytes` (RAM consumed)!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Inspecting Array Geometry & Memory",
        concept: "Array metadata: ndim, shape, size, itemsize, and nbytes",
        simpleAnalogy: "Every package has a shipping label that describes its contents: its dimensions (ndim), row and column counts (shape), total item count (size), weight of each item (itemsize), and total package weight (nbytes). Array attributes are that exact label!",
        explanation: "• arr.ndim: The number of axes/dimensions (1 for vector, 2 for matrix, 3 for tensor).\n• arr.shape: A tuple with the size along each axis (e.g. (2, 3) means 2 rows and 3 columns).\n• arr.size: Total number of elements across all dimensions (e.g. 2 * 3 = 6 elements).\n• arr.itemsize: Memory consumed by a single element in bytes (float64 = 8 bytes, int32 = 4 bytes).\n• arr.nbytes: Total memory consumed by the entire array: nbytes = size * itemsize (e.g. 10 elements * 4 bytes = 40 bytes).",
        whyUseIt: "Guarantees array dimensions match before matrix operations and prevents memory overflow when handling large datasets.",
        useCases: [
          "Validating neural network layer input/output tensor shapes",
          "Calculating RAM consumption before loading big data tables",
          "Confirming image width, height, and color channels",
        ],
      },
      partB: {
        title: "Inspecting Geometry and Memory Footprint",
        concept: "Reading ndim, shape, size, itemsize, and calculating total nbytes",
        code: `import numpy as np

matrix = np.array([[10, 20, 30], [40, 50, 60]], dtype=np.int32)

print("Dimensions (ndim):", matrix.ndim)
print("Shape (rows, cols):", matrix.shape)
print("Total elements (size):", matrix.size)
print("Bytes per item:", matrix.itemsize)
print("Total memory (nbytes):", matrix.nbytes)`,
        output: `Dimensions (ndim): 2
Shape (rows, cols): (2, 3)
Total elements (size): 6
Bytes per item: 4
Total memory (nbytes): 24`,
        breakdown: "• 'matrix.shape' returns (2, 3) = 2 rows by 3 columns.\n• 'matrix.size' is 6 (2 rows * 3 columns = 6 numbers total).\n• 'matrix.itemsize' is 4 bytes for int32 (or 8 bytes for float64).\n• 'matrix.nbytes' is 24 bytes (6 elements * 4 bytes = 24 bytes total memory).",
        visualArray: [
          ['10', '20', '30'],
          ['40', '50', '60'],
        ],
      },
    },
    miniPractice: {
      question: 'What is the total element count (size) of an array with shape (3, 4, 5)?',
      options: ['60', '12', '345', '15'],
      correctIndex: 0,
      explanation: 'The size is the product of all shape dimensions: 3 * 4 * 5 = 60 elements.',
    },
    monster: {
      name: 'Armored Stone Gargoyle',
      archetype: 'Impenetrable Stone Fiend',
      hp: 170,
      maxHp: 170,
      attack: 22,
      introDialogue: [
        'My stone plates have high density and strict shape! Can your attacks calculate my mass?',
      ],
      defeatDialogue: 'My armor... fractured along its dimensional axes!',
      color: '#0284c7',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 140,
        reactionDelay: 0.4,
        attackFrequency: 2.4,
        dodgeChance: 0.1,
        predictionStrength: 0.15,
        aggression: 0.7,
        preferredDistance: 120,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_shape_01', 'q_shape_02', 'q_shape_03', 'q_shape_04', 'q_shape_05'],
    rewardXp: 180,
  },

  // LEVEL 4: DATA TYPES (dtype & astype)
  {
    id: 4,
    worldId: 1,
    worldTitle: 'World 1: Foundations',
    title: 'The Blacksmith Foundry: Data Types',
    subtitle: 'int, float, bool, uint8, dtype & astype()',
    topic: 'dtype',
    masteryCategory: 'Data Types',
    levelType: 'multi_monster',
    minions: [
      {
        name: 'Byte Goblin Alpha',
        hp: 45,
        maxHp: 45,
        attack: 10,
        color: '#f97316',
        spriteType: 'goblin',
      },
    ],
    environment: {
      name: 'Volcanic Foundry of Dtypes',
      type: 'ruins',
      skyColor: '#18181b',
      groundColor: '#7c2d12',
      accentColor: '#f97316',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In the blacksmith foundry, weapons must be forged from pure, homogeneous metal.',
        expression: 'serious',
      },
      {
        speaker: 'Aria',
        text: 'NumPy is the same! Every single item in an array must share the exact same Data Type (dtype).',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "Homogeneous Memory Architecture",
        concept: "Precision types: int32, int64, float64, uint8, bool, and astype() conversion",
        simpleAnalogy: "Think of containers designed for specific cargo: a coin counter only holds whole integers, while a laboratory graduated cylinder holds precise decimal water droplets. Using the right container prevents memory waste and ensures mathematical accuracy.",
        explanation: "• Standard integer lists default to int64 (or int32 on 32-bit OS); float arrays default to float64.\n• np.uint8 stores unsigned 8-bit integers from 0 to 255 (the universal standard for RGB image pixels).\n• arr.astype(new_dtype) creates and returns a NEW converted copy; it NEVER mutates the original in-place.\n• Converting float to int via astype(int) truncates decimals toward zero (1.9 becomes 1).\n• astype(bool) converts 0 to False and any non-zero number (e.g. 1, 5, -2) to True.",
        whyUseIt: "Optimizes memory consumption (uint8 uses 8x less RAM than int64) and enables GPU hardware acceleration.",
        useCases: [
          "Digital computer vision: uint8 (0 to 255 per RGB color channel)",
          "Deep learning training: float32 and float16 for GPU tensor cores",
          "Boolean masks: bool (1 byte per True/False decision)",
        ],
      },
      partB: {
        title: "Data Types and astype() Type Casting",
        concept: "Converting floats, integers, and booleans with astype()",
        code: `import numpy as np

# Float array with decimals
arr = np.array([1.9, 2.1, 3.8])
print("Original dtype:", arr.dtype)

# astype(int) truncates decimals and returns a converted copy!
int_arr = arr.astype(int)
print("Converted to int:", int_arr)
print("Original untouched:", arr)`,
        output: `Original dtype: float64
Converted to int: [1 2 3]
Original untouched: [1.9 2.1 3.8]`,
        breakdown: "• 'arr = np.array([1.9, 2.1, 3.8])' starts as float64.\n• 'arr.astype(int)' truncates decimals, returning a new array [1, 2, 3].\n• The original array 'arr' remains completely untouched.\n• 'np.array([0, 1, 5, 0]).astype(bool)' evaluates to [False, True, True, False].",
      },
    },
    miniPractice: {
      question: 'Which method should you call to convert a float array to integers?',
      options: ['arr.astype(int)', 'arr.to_int()', 'np.convert(arr, int)', 'int(arr)'],
      correctIndex: 0,
      explanation: '`arr.astype(new_type)` is the official, optimized NumPy method for type casting.',
    },
    monster: {
      name: 'Infernal Foundry Fiend',
      archetype: 'Molten Flame Fiend',
      hp: 175,
      maxHp: 175,
      attack: 24,
      introDialogue: [
        'Impurities burn in my flames! You cannot forge victory without homogenous dtypes!',
      ],
      defeatDialogue: 'My molten flame... cooled by your strict type discipline!',
      color: '#ea580c',
      spriteType: 'fire_demon',
      aiProfile: {
        movementSpeed: 170,
        reactionDelay: 0.32,
        attackFrequency: 2.1,
        dodgeChance: 0.25,
        predictionStrength: 0.2,
        aggression: 0.65,
        preferredDistance: 150,
        personality: 'fire_sorcerer',
      },
    },
    questionIds: ['q_dtype_01', 'q_dtype_02', 'q_dtype_03', 'q_dtype_04', 'q_dtype_05'],
    rewardXp: 200,
    unlockedSkill: {
      name: 'Fire Strike',
      description: 'Cast blazing elemental fury across homogenous array structures!',
      icon: 'Flame',
    },
  },

  // =========================================================================
  // WORLD 2 — ARRAY CONTROL (LEVELS 5 - 9)
  // =========================================================================

  // LEVEL 5: INDEXING (1D, 2D, 3D, Negative)
  {
    id: 5,
    worldId: 2,
    worldTitle: 'World 2: Array Control',
    title: 'The Torii Path: Indexing Mastery',
    subtitle: 'Zero-Based Coordinates, Negative Indices & 2D Access',
    topic: 'indexing',
    masteryCategory: 'Indexing',
    levelType: 'exploration',
    environment: {
      name: 'Sacred Torii Pathway',
      type: 'village',
      skyColor: '#1e1b4b',
      groundColor: '#451a03',
      accentColor: '#dc2626',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Every torii gate along this path has an exact numbered step.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'In NumPy, we locate values using Indexing: starting at 0, or counting backward from the end with negative indices like -1!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Coordinate Navigation in Arrays",
        concept: "Zero-based indexing, negative indices, multi-axis [row, col], and bounds safety",
        simpleAnalogy: "Imagine an apartment building with floor numbers and apartment numbers. In programming, the ground floor is always Floor 0. Asking for Floor -1 takes you straight to the top penthouse at the back of the building!",
        explanation: "• NumPy indexing is 0-based: index 0 is the first element, index 1 is the second.\n• Negative indices count backward from the end: arr[-1] is the last item, arr[-2] is second-to-last.\n• In 2D arrays, access coordinates via comma syntax: arr[row, col] (e.g. matrix[1, 2]).\n• In 3D arrays, use arr[block, row, col].\n• Accessing an index outside array bounds raises an IndexError (e.g. index 5 on a 4-element array).\n• Assigning to an index (arr[0, 0] = 99) mutates the element in-place.",
        whyUseIt: "Allows instantaneous coordinate-based reading and updating of specific values in multi-dimensional space.",
        useCases: [
          "Locating player coordinates (x, y) on a game map",
          "Reading the latest sensor data reading at index -1",
          "Modifying an individual pixel color in an image buffer",
        ],
      },
      partB: {
        title: "Accessing Coordinates with Multi-Axis Indexing",
        concept: "Zero-based row/col coordinates, negative indexing, and mutation",
        code: `import numpy as np

matrix = np.array([
  [10, 20, 30],
  [40, 50, 60]
])

print("Row 0, Col 2:", matrix[0, 2])
print("Row 1, Last Col:", matrix[1, -1])

# In 3D arrays of shape (blocks, rows, cols):
tensor = np.zeros((2, 3, 4))
tensor[0, 1, 2] = 42 # Block 0, Row 1, Col 2
print("3D Element:", tensor[0, 1, 2])

# In-place element mutation
matrix[0, 0] = 99
print("Mutated matrix:\n", matrix)`,
        output: `Row 0, Col 2: 30
Row 1, Last Col: 60
3D Element: 42.0
Mutated matrix:
 [[99 20 30]
 [40 50 60]]`,
        breakdown: "• 'matrix[0, 2]' accesses row 0, column 2 (value 30).\n• 'matrix[1, -1]' accesses row 1, last column (value 60).\n• 'tensor[0, 1, 2]' accesses block 0, row 1, column 2 in a 3D array.\n• 'matrix[0, 0] = 99' updates the element in-place; accessing out-of-bounds raises IndexError.",
      },
    },
    miniPractice: {
      question: 'What is the clean NumPy syntax to access row 2, column 3 in a 2D array?',
      options: ['arr[2, 3]', 'arr[2][3]', 'arr.get(2, 3)', 'arr(2, 3)'],
      correctIndex: 0,
      explanation: '`arr[2, 3]` is the idiomatic, highly optimized NumPy multi-axis index notation.',
    },
    monster: {
      name: 'Obsidian Ronin Demon',
      archetype: 'Blade Master Fiend',
      hp: 180,
      maxHp: 180,
      attack: 26,
      introDialogue: [
        'Halt! My katana strikes with zero error at exact coordinates!',
      ],
      defeatDialogue: 'My sword... blocked at index [0, 0]!',
      color: '#dc2626',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 180,
        reactionDelay: 0.3,
        attackFrequency: 2.0,
        dodgeChance: 0.3,
        predictionStrength: 0.25,
        aggression: 0.7,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_idx_01', 'q_idx_02', 'q_idx_03', 'q_idx_04', 'q_idx_05'],
    rewardXp: 220,
    unlockedSkill: {
      name: 'Index Slash',
      description: 'Pinpoint and pierce enemy vulnerabilities with 0-indexed precision!',
      icon: 'Crosshair',
    },
  },

  // LEVEL 6: SLICING (start:stop:step, 2D Slicing)
  {
    id: 6,
    worldId: 2,
    worldTitle: 'World 2: Array Control',
    title: 'The Windy Ridge: Slicing Mastery',
    subtitle: '1D & 2D Slicing: [start:stop:step]',
    topic: 'slicing',
    masteryCategory: 'Slicing',
    levelType: 'puzzle_platforms',
    puzzleGate: {
      id: 'gate_slice',
      x: 500,
      prompt: 'Slice Gate: Provide slice indices to bridge the mountain chasm',
      questionId: 'q_slice_01',
      bridgeStartX: 490,
      bridgeEndX: 710,
      activated: false,
    },
    environment: {
      name: 'Windy Alpine Ridge',
      type: 'mountains',
      skyColor: '#082f49',
      groundColor: '#0f766e',
      accentColor: '#14b8a6',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Feel the sharp mountain winds! Here, warriors carve through arrays with clean slices.',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'Remember: in `[start : stop : step]`, the stop value is ALWAYS excluded!',
        expression: 'serious',
      },
    ],
    theory: {
      partA: {
        title: "Slicing Sub-Arrays Without Copying",
        concept: "Slicing syntax: [start : stop : step], negative steps, and 2D submatrices",
        simpleAnalogy: "Slicing is like using an adjustable window or stencil to view only a portion of a long timeline or photograph. You set where the stencil opens, where it closes, and how many frames to skip between steps.",
        explanation: "• arr[start : stop] extracts elements from start up to (but excluding) stop.\n• The 'stop' boundary is non-inclusive (half-open interval [start, stop)).\n• 'step' determines the stride interval: arr[::2] selects every second element.\n• A negative step arr[::-1] reverses the array order.\n• In 2D matrices, slice both axes with commas: matrix[row_start:row_stop, col_start:col_stop].\n• arr[:, 1] extracts all rows along column 1 as a 1D vector.",
        whyUseIt: "Extracts sub-regions, time windows, and image crops instantaneously with zero computational overhead.",
        useCases: [
          "Cropping a bounding box region of interest in an image",
          "Subsampling a signal by taking every 2nd or 4th audio sample",
          "Reversing chronological time series data",
        ],
      },
      partB: {
        title: "1D and 2D Slicing Mechanics",
        concept: "Extracting subarrays, whole columns, and reversing with strides",
        code: `import numpy as np

matrix = np.array([
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12]
])

print("Column 1 across all rows:", matrix[:, 1])
print("Submatrix (rows 0-1, cols 1-2):\n", matrix[0:2, 1:3])
print("Reversed rows:\n", matrix[::-1, :])`,
        output: `Column 1 across all rows: [ 2  6 10]
Submatrix (rows 0-1, cols 1-2):
 [[2 3]
 [6 7]]
Reversed rows:
 [[ 9 10 11 12]
 [ 5  6  7  8]
 [ 1  2  3  4]]`,
        breakdown: "• 'arr[1:4]' selects indices 1, 2, and 3 (stops before 4).\n• 'arr[::2]' takes strides of 2, extracting every second element: [0, 2, 4].\n• 'arr[::-1]' steps backward by -1, completely reversing the array.\n• 'matrix[0:2, 1:3]' extracts a 2x2 submatrix from rows 0-1 and columns 1-2.",
      },
    },
    miniPractice: {
      question: 'Which slice extracts all rows and only the very first column of a 2D matrix?',
      options: ['arr[:, 0]', 'arr[0, :]', 'arr[0:0]', 'arr[1, :]'],
      correctIndex: 0,
      explanation: '`arr[:, 0]` specifies all rows (`:`) and column index `0`.',
    },
    monster: {
      name: 'Gale Sky Chimera',
      archetype: 'Aerial Ridge Predator',
      hp: 190,
      maxHp: 190,
      attack: 28,
      introDialogue: [
        'KRAAAW! Can your slices cut through alpine gales as I dive from the clouds?',
      ],
      defeatDialogue: 'My soaring wings... grounded by your precise slices!',
      color: '#14b8a6',
      spriteType: 'winged_beast',
      isFlying: true,
      aiProfile: {
        movementSpeed: 210,
        reactionDelay: 0.25,
        attackFrequency: 1.9,
        dodgeChance: 0.4,
        predictionStrength: 0.35,
        aggression: 0.75,
        preferredDistance: 200,
        personality: 'aerial_predator',
      },
    },
    questionIds: ['q_slice_01', 'q_slice_02', 'q_slice_03', 'q_slice_04', 'q_slice_05'],
    rewardXp: 240,
    unlockedSkill: {
      name: 'Sub-array Cleave',
      description: 'Slice enemy HP bars cleanly across axis 0!',
      icon: 'Scissors',
    },
  },

  // LEVEL 7: RESHAPING & -1 DIMENSION
  {
    id: 7,
    worldId: 2,
    worldTitle: 'World 2: Array Control',
    title: 'The Shifting Dunes: Reshaping',
    subtitle: 'reshape(), -1 Auto-Dimension, flatten() & ravel()',
    topic: 'reshape',
    masteryCategory: 'Reshaping',
    levelType: 'exploration',
    environment: {
      name: 'Shifting Desert Ruins',
      type: 'ruins',
      skyColor: '#1c1917',
      groundColor: '#854d0e',
      accentColor: '#eab308',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'The dunes shift their geometry with the wind without losing a single grain of sand.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`reshape()` reorganizes elements into new dimensions, provided the total element count stays identical!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Dimension Transformation Without Duplication",
        concept: "Array reshaping: reshape(), -1 automatic inference, flatten() vs ravel()",
        simpleAnalogy: "Imagine having 12 ceramic tiles. You can lay them out as 1 row of 12, 2 rows of 6, 3 rows of 4, or 4 rows of 3. The tiles don't change and none are lost — only their arrangement in space changes!",
        explanation: "• arr.reshape(new_shape) changes dimensions without altering the underlying data.\n• Total element count must stay identical: an array with 12 elements can become (3, 4) or (2, 6), but not (5, 2).\n• Passing -1 allows NumPy to automatically infer that dimension (e.g. arr.reshape(-1, 2) on 10 elements gives (5, 2)).\n• arr.flatten() ALWAYS allocates and returns an independent COPY in 1D.\n• arr.ravel() returns a fast 1D VIEW whenever memory is contiguous (copy only when necessary).",
        whyUseIt: "Reshapes raw feature vectors into matrices or tensors required by machine learning frameworks and graphics engines.",
        useCases: [
          "Reshaping a 784-element pixel vector into a 28x28 image matrix for neural nets",
          "Flattening multidimensional sensor grids before classification",
          "Batching data into 3D tensors for recurrent neural networks",
        ],
      },
      partB: {
        title: "Reshaping Dimensions and Unrolling to 1D",
        concept: "Using reshape, -1 dimension inference, flatten(), and ravel()",
        code: `import numpy as np

flat = np.arange(1, 7) # [1, 2, 3, 4, 5, 6]
matrix = flat.reshape(2, 3)
print("2x3 Matrix:\n", matrix)

# Using -1 to let NumPy infer the rows: 6 elements / 2 cols = 3 rows!
auto_matrix = flat.reshape(-1, 2)
print("Auto rows shape:", auto_matrix.shape)`,
        output: `2x3 Matrix:
 [[1 2 3]
 [4 5 6]]
Auto rows shape: (3, 2)`,
        breakdown: "• 'arr.reshape(2, 3)' morphs 6 elements into a 2x3 matrix.\n• 'arr.reshape(-1, 2)' automatically infers 5 rows for a 10-element array: shape (5, 2).\n• Attempting an invalid shape like reshape(5, 2) on 12 elements raises a ValueError.\n• 'flatten()' always allocates a new copy; 'ravel()' returns a zero-copy view when possible.",
      },
    },
    miniPractice: {
      question: 'Which reshape on a 16-element array will raise a ValueError?',
      options: ['arr.reshape(3, 5)', 'arr.reshape(4, 4)', 'arr.reshape(2, 8)', 'arr.reshape(16, 1)'],
      correctIndex: 0,
      explanation: '3 * 5 = 15, which does not equal 16. Total size must remain identical.',
    },
    monster: {
      name: 'Dune Shape Shifter',
      archetype: 'Shifting Sand Phantom',
      hp: 150,
      maxHp: 150,
      attack: 30,
      introDialogue: [
        'I reshape between dimensions! Can your calculations track my shifting form?',
      ],
      defeatDialogue: 'My forms... collapsed into a single scalar...',
      color: '#eab308',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 200,
        reactionDelay: 0.28,
        attackFrequency: 1.9,
        dodgeChance: 0.35,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 140,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_reshape_01', 'q_reshape_02', 'q_reshape_03', 'q_reshape_04'],
    rewardXp: 260,
  },

  // LEVEL 8: CREATING SPECIAL ARRAYS (zeros, ones, full, eye)
  {
    id: 8,
    worldId: 2,
    worldTitle: 'World 2: Array Control',
    title: 'The Sacred Shrine: Special Arrays',
    subtitle: 'zeros(), ones(), full() & eye()',
    topic: 'creation',
    masteryCategory: 'Special Arrays & Ranges',
    levelType: 'exploration',
    environment: {
      name: 'Ancient Stone Shrine',
      type: 'village',
      skyColor: '#020617',
      groundColor: '#1e293b',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'At this sacred shrine, arrays are summoned directly from the cosmos!',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: '`zeros()`, `ones()`, `full()`, and `eye()` let you initialize memory with exact starting values in a single command.',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "Pre-Allocating Arrays",
        concept: "Array constructors: np.zeros, np.ones, np.full, and np.eye",
        simpleAnalogy: "Before an artist paints a masterpiece or an accountant balances a ledger, they start with a clean canvas: a blank white page (zeros), an initialized grid of ones, or an identity benchmark. NumPy provides instant factory constructors for these clean slates.",
        explanation: "• np.zeros(shape): Creates an array filled with 0.0 floats (or custom dtype).\n• np.ones(shape, dtype=int): Creates an array filled with 1s of specified type.\n• np.full(shape, value): Fills every element with the specified scalar value (e.g. np.full((2, 2), 7)).\n• np.eye(N): Creates an N x N 2D identity matrix with 1.0 along the main diagonal and 0.0 elsewhere.\n• np.eye(rows, cols): Also creates rectangular matrices with a diagonal of 1s (e.g. shape (3, 4)).",
        whyUseIt: "Pre-allocates memory buffers and initializes weights and identity transformation matrices without manual loops.",
        useCases: [
          "Initializing accumulator arrays and neural net weight matrices",
          "Creating identity matrices for coordinate transformations in 3D graphics",
          "Pre-allocating video display buffers to prevent memory reallocations",
        ],
      },
      partB: {
        title: "Pre-Allocating Arrays with Factory Functions",
        concept: "Instantiating zeros, ones, constant arrays, and identity matrices",
        code: `import numpy as np

z = np.zeros((2, 3))       # 2x3 zeros (float64)
o = np.ones(4, dtype=int)  # 1D array of four 1s
f = np.full((2, 2), 9)     # 2x2 matrix of 9s
i = np.eye(3)              # 3x3 identity matrix

print("Full 9s:\n", f)
print("Identity Matrix:\n", i)`,
        output: `Full 9s:
 [[9 9]
 [9 9]]
Identity Matrix:
 [[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]]`,
        breakdown: "• 'np.zeros((2, 3))' creates a 2-row, 3-column array filled with 0.0 floats.\n• 'np.ones(3, dtype=int)' creates [1, 1, 1] as integers.\n• 'np.full((2, 2), 7)' creates a 2x2 matrix filled completely with 7s.\n• 'np.eye(3)' creates a 3x3 identity matrix with 1.0 along the main diagonal.",
      },
    },
    miniPractice: {
      question: 'Which function creates a 3x3 identity matrix with ones on the diagonal?',
      options: ['np.eye(3)', 'np.identity_matrix(3)', 'np.diagonal(3)', 'np.ones_diag(3)'],
      correctIndex: 0,
      explanation: '`np.eye(N)` is the standard NumPy function to construct an N x N identity matrix.',
    },
    monster: {
      name: 'Shrine Stone Golem',
      archetype: 'Sacred Temple Guardian',
      hp: 175,
      maxHp: 175,
      attack: 32,
      introDialogue: [
        'I am carved from pure monolithic stone! Can your summoned arrays breach my sanctuary?',
      ],
      defeatDialogue: 'My monolithic frame... returns to dust...',
      color: '#38bdf8',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 150,
        reactionDelay: 0.35,
        attackFrequency: 2.2,
        dodgeChance: 0.15,
        predictionStrength: 0.2,
        aggression: 0.7,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_spec_01', 'q_spec_02', 'q_spec_03', 'q_spec_04', 'q_spec_05'],
    rewardXp: 280,
  },

  // LEVEL 9: RANGES (arange vs linspace)
  {
    id: 9,
    worldId: 2,
    worldTitle: 'World 2: Array Control',
    title: 'The Starlight Bridge: Ranges',
    subtitle: 'np.arange() vs np.linspace()',
    topic: 'ranges',
    masteryCategory: 'Special Arrays & Ranges',
    levelType: 'puzzle_platforms',
    puzzleGate: {
      id: 'gate_range',
      x: 520,
      prompt: 'Starlight Gate: Compute linear interval points to energize bridge',
      questionId: 'q_range_02',
      bridgeStartX: 510,
      bridgeEndX: 730,
      activated: false,
    },
    environment: {
      name: 'Starlight Bridge Ruins',
      type: 'ruins',
      skyColor: '#030712',
      groundColor: '#1e1b4b',
      accentColor: '#6366f1',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'To cross the Starlight Bridge, the stepping stones must be spaced with mathematical precision.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`np.arange()` steps by a given interval, while `np.linspace()` generates a specified number of evenly spaced points including both ends!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Step-Based vs Sample-Based Sequences",
        concept: "Sequence generation: np.arange() step intervals vs np.linspace() sample counts",
        simpleAnalogy: "If you are walking down a path, you can either say 'take steps of exactly 2 meters until I reach the gate' (arange), or 'divide the total distance to the gate into exactly 5 equal stops' (linspace).",
        explanation: "• np.arange(start, stop, step): Generates values in increments of step, stopping BEFORE stop (half-open [start, stop)).\n• np.arange(5, 0, -1) uses a negative step to count backward: [5, 4, 3, 2, 1].\n• np.linspace(start, stop, num): Divides the interval into num evenly spaced points and INCLUDES the stop value.\n• Choose linspace over arange when working with floating-point intervals to avoid floating-point step accumulation errors.",
        whyUseIt: "Generates numerical axes, time domains, and sample coordinates for plotting and mathematical evaluation.",
        useCases: [
          "Generating time step arrays: t = np.linspace(0, 10, 1000) for audio and physics",
          "Loop counters and integer index ranges using arange",
          "Plotting smooth mathematical curves with matplotlib",
        ],
      },
      partB: {
        title: "Comparing np.arange() and np.linspace()",
        concept: "Step size iteration vs evenly spaced sample interpolation",
        code: `import numpy as np

# arange: specifies step size (stop is excluded!)
r = np.arange(0, 10, 2)
print("arange(0, 10, 2):", r)

# linspace: specifies sample count (stop is INCLUDED!)
l = np.linspace(0, 1, 5)
print("linspace(0, 1, 5):", l)`,
        output: `arange(0, 10, 2): [0 2 4 6 8]
linspace(0, 1, 5): [0.   0.25 0.5  0.75 1.  ]`,
        breakdown: "• 'np.arange(1, 5)' produces [1, 2, 3, 4] (stops before 5).\n• 'np.arange(5, 0, -1)' counts backward: [5, 4, 3, 2, 1].\n• 'np.linspace(0, 1, 5)' produces [0.0, 0.25, 0.5, 0.75, 1.0] (includes 1.0).\n• 'np.linspace(0, 10, 5)' has 10.0 as its exact final element.",
      },
    },
    miniPractice: {
      question: 'Which function generates exactly 50 evenly spaced numbers between 0 and 100 inclusive?',
      options: ['np.linspace(0, 100, 50)', 'np.arange(0, 100, 50)', 'np.spaces(0, 100, 50)', 'np.range(0, 100, 50)'],
      correctIndex: 0,
      explanation: '`np.linspace(start, stop, num)` produces the exact count of evenly spaced samples including stop.',
    },
    monster: {
      name: 'Void Celestial Dragon',
      archetype: 'Aerial Cosmic Serpent',
      hp: 175,
      maxHp: 175,
      attack: 34,
      introDialogue: [
        'ROAAAR! The cosmic void bends along my trajectory! Can your linear intervals ground my flight?',
      ],
      defeatDialogue: 'Grounded by your pristine linspace intervals...',
      color: '#6366f1',
      spriteType: 'flying_demon',
      isFlying: true,
      aiProfile: {
        movementSpeed: 220,
        reactionDelay: 0.22,
        attackFrequency: 1.8,
        dodgeChance: 0.45,
        predictionStrength: 0.4,
        aggression: 0.8,
        preferredDistance: 210,
        personality: 'aerial_predator',
      },
    },
    questionIds: ['q_range_01', 'q_range_02', 'q_range_03', 'q_range_04', 'q_range_05'],
    rewardXp: 300,
    unlockedSkill: {
      name: 'Genesis Beam',
      description: 'Summon arrays of pure radiant energy with linspace cadence!',
      icon: 'Sun',
    },
  },

  // =========================================================================
  // WORLD 3 — ARRAY POWER (LEVELS 10 - 13)
  // =========================================================================

  // LEVEL 10: ARITHMETIC OPERATIONS
  {
    id: 10,
    worldId: 3,
    worldTitle: 'World 3: Array Power',
    title: 'The Thunder Bastion: Arithmetic',
    subtitle: '+, -, *, /, **, % Element-Wise Vectorized Math',
    topic: 'math',
    masteryCategory: 'Arithmetic Operations',
    levelType: 'exploration',
    environment: {
      name: 'Thunder Bastion Ruins',
      type: 'ruins',
      skyColor: '#0b132b',
      groundColor: '#1c2541',
      accentColor: '#48cae4',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Lightning strikes every coordinate simultaneously! That is the essence of vector arithmetic.',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'Standard operators (`+`, `-`, `*`, `/`, `**`, `%`) operate element-by-element across the entire array.',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "Element-Wise Numerical Processing",
        concept: "Vectorized arithmetic: +, -, *, /, //, %, and **",
        simpleAnalogy: "Imagine two synchronized spreadsheet columns. When you hit Calculate, row 1 pairs with row 1, row 2 pairs with row 2, and all operations occur simultaneously across the board without manual formulas.",
        explanation: "• All basic arithmetic operators in NumPy operate element-wise: elements at matching indices are paired.\n• Standard operators: + (addition), - (subtraction), * (multiplication), / (true division).\n• Powers: ** raises each element to a power (e.g. arr ** 2 squares each number).\n• Modulo & Floor: % computes remainder after division; // performs integer floor division.\n• Both arrays must have matching shapes or be compatible for broadcasting.",
        whyUseIt: "Applies mathematical transformations across millions of records in parallel in a single line of expressive code.",
        useCases: [
          "Calculating physics velocity and acceleration across all particles simultaneously",
          "Applying price discounts and tax adjustments to inventory arrays",
          "Batch coordinate translations in computer game physics",
        ],
      },
      partB: {
        title: "Element-Wise Arithmetic Operations",
        concept: "Vectorized addition, subtraction, powers, modulo, and floor division",
        code: `import numpy as np

a = np.array([10, 20, 30])
b = np.array([1, 2, 3])

print("Addition:", a + b)
print("Multiplication:", a * b)
print("Exponentiation (a ** 2):", b ** 2)
print("Modulo (a % 4):", a % 4)`,
        output: `Addition: [11 22 33]
Multiplication: [10 40 90]
Exponentiation (a ** 2): [1 4 9]
Modulo (a % 4): [2 0 2]`,
        breakdown: "• 'a + b' adds matching positions: [1, 2] + [10, 20] = [11, 22].\n• 'a ** 2' squares every number: [2, 3, 4] ** 2 = [4, 9, 16].\n• 'arr % 6' calculates remainders: [10, 15, 20] % 6 = [4, 3, 2].\n• 'arr // 3' performs floor division: [10, 20] // 3 = [3, 6].",
      },
    },
    miniPractice: {
      question: 'What does np.array([2, 3]) * np.array([4, 5]) evaluate to?',
      options: ['[ 8 15]', '[2 3 4 5]', '23', '[[8, 10], [12, 15]]'],
      correctIndex: 0,
      explanation: 'Element-wise multiplication: 2*4 = 8, 3*5 = 15 -> `[8 15]`.',
    },
    monster: {
      name: 'Thunder Oni Vanguard',
      archetype: 'Lightning Fiend',
      hp: 175,
      maxHp: 175,
      attack: 30,
      introDialogue: [
        'Zzzzt! My thunderous strikes calculate with instantaneous power!',
      ],
      defeatDialogue: 'My voltage... dissipated by your vector arithmetic...',
      color: '#48cae4',
      spriteType: 'demon_beast',
      aiProfile: {
        movementSpeed: 195,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.3,
        predictionStrength: 0.3,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'aggressive_beast',
      },
    },
    questionIds: ['q_arith_01', 'q_arith_02', 'q_arith_03', 'q_arith_04', 'q_arith_05'],
    rewardXp: 320,
  },

  // LEVEL 11: UNIVERSAL FUNCTIONS (ufuncs)
  {
    id: 11,
    worldId: 3,
    worldTitle: 'World 3: Array Power',
    title: 'The Prism Caverns: Universal Functions',
    subtitle: 'np.sqrt, np.abs, np.exp, np.log, np.sin, np.round',
    topic: 'math',
    masteryCategory: 'Universal Functions',
    levelType: 'exploration',
    environment: {
      name: 'Crystal Prism Caverns',
      type: 'caves',
      skyColor: '#1e1b4b',
      groundColor: '#581c87',
      accentColor: '#a855f7',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Inside these prism caverns, light refracts through complex mathematical functions.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'NumPy universal functions (ufuncs) like `np.sqrt()`, `np.abs()`, `np.exp()`, and `np.sin()` operate fast across entire arrays!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Universal Function Machinery",
        concept: "Fast universal functions: np.sqrt, np.abs, np.round, np.exp, np.log, and np.log10",
        simpleAnalogy: "A universal function (ufunc) is like an automated assembly line workstation: thousands of parts roll past on a conveyor belt, and an industrial laser modifies each part with zero human delay.",
        explanation: "• Universal functions (ufuncs) are pre-compiled C routines that execute element-wise at hardware speed.\n• np.sqrt(arr): Computes the square root of non-negative elements.\n• np.abs(arr): Computes the absolute value, turning negative numbers positive.\n• np.round(arr): Rounds elements to the nearest integer.\n• np.exp(arr): Computes natural exponential e^x (np.exp(0) == 1.0).\n• np.log(arr) computes natural log ln(x); np.log10(arr) computes base-10 logarithm (np.log10(100) == 2.0).",
        whyUseIt: "Eliminates Python function call overhead and executes complex mathematical transformations at native CPU speed.",
        useCases: [
          "Signal processing and acoustics using logarithmic decibel scales (log10)",
          "Exponential growth and decay models in finance and epidemiology (exp)",
          "Distance calculations via Euclidean formulas (sqrt and abs)",
        ],
      },
      partB: {
        title: "Universal Functions (ufuncs) in Practice",
        concept: "Applying sqrt, abs, round, exp, and log10 across arrays",
        code: `import numpy as np

arr = np.array([-4, 9, 16])

print("Absolute value:", np.abs(arr))
print("Square root (valid for >= 0):", np.sqrt(np.array([4, 9, 16])))
print("Rounded values:", np.round(np.array([1.25, 2.75, 3.5])))`,
        output: `Absolute value: [ 4  9 16]
Square root (valid for >= 0): [2. 3. 4.]
Rounded values: [1. 3. 4.]`,
        breakdown: "• 'np.sqrt([4, 9, 16])' computes square roots: [2.0, 3.0, 4.0].\n• 'np.abs([-5, 0, 7])' removes signs: [5, 0, 7].\n• 'np.round([1.2, 2.7, 3.5])' rounds values: [1.0, 3.0, 4.0].\n• 'np.exp(0)' evaluates to 1.0; 'np.log10(100)' evaluates to 2.0.",
      },
    },
    miniPractice: {
      question: 'What does np.abs(np.array([-10, 20, -30])) return?',
      options: ['[10 20 30]', '[-10  20 -30]', '[10 -20 30]', '60'],
      correctIndex: 0,
      explanation: '`np.abs()` computes element-wise absolute value, making all numbers non-negative: `[10 20 30]`.',
    },
    monster: {
      name: 'Crystal Prism Fiend',
      archetype: 'Cavern Crystalline Demon',
      hp: 180,
      maxHp: 180,
      attack: 32,
      introDialogue: [
        'My crystals refract your attacks! Can your ufuncs resolve my spectrum?',
      ],
      defeatDialogue: 'My crystals... shattered into scalar fragments!',
      color: '#a855f7',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 175,
        reactionDelay: 0.3,
        attackFrequency: 2.1,
        dodgeChance: 0.25,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_ufunc_01', 'q_ufunc_02', 'q_ufunc_03', 'q_ufunc_04', 'q_ufunc_05'],
    rewardXp: 340,
  },

  // LEVEL 12: AGGREGATION (sum, min, max, mean, median, std, var)
  {
    id: 12,
    worldId: 3,
    worldTitle: 'World 3: Array Power',
    title: 'The Great Library: Aggregation',
    subtitle: 'np.sum, np.min, np.max, np.mean, np.median, np.std, np.var',
    topic: 'aggregation',
    masteryCategory: 'Aggregation',
    levelType: 'exploration',
    environment: {
      name: 'Ancient Archives of Knowledge',
      type: 'village',
      skyColor: '#1e293b',
      groundColor: '#475569',
      accentColor: '#f59e0b',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In the Great Library, scholars aggregate vast chronicles into concise insights.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Aggregation functions collapse millions of numbers into statistical summaries: sum, min, max, mean, median, and variance!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Statistical Reductions",
        concept: "Statistical aggregation: sum, min, max, mean, median, std, and var",
        simpleAnalogy: "Aggregation is taking a full stadium of individual spectator votes and condensing them into key statistics: the total vote count (sum), the average voter age (mean), the middle voter age (median), and how widely opinions vary (variance and standard deviation).",
        explanation: "• arr.sum(): Calculates the total sum of all elements.\n• arr.mean(): Calculates the arithmetic average (sum / size).\n• np.median(arr): Finds the middle value after sorting (robust against extreme outliers).\n• arr.std(): Calculates the standard deviation, measuring how data spreads around the mean.\n• arr.var(): Calculates the variance, which is the square of standard deviation (var = std ** 2).",
        whyUseIt: "Condenses millions of data points into actionable analytical summaries and statistical benchmarks.",
        useCases: [
          "Calculating mean customer spend and variance across transactions",
          "Finding minimum and maximum temperatures across sensor networks",
          "Computing standard deviation for anomaly and outlier detection",
        ],
      },
      partB: {
        title: "Computing Summary Statistics",
        concept: "Extracting sum, mean, median, standard deviation, and variance",
        code: `import numpy as np

data = np.array([10, 20, 30, 40, 50])

print("Total Sum:", data.sum())
print("Minimum / Maximum:", data.min(), "/", data.max())
print("Mean Average:", data.mean())
print("Standard Deviation:", np.round(data.std(), 2))`,
        output: `Total Sum: 150
Minimum / Maximum: 10 / 50
Mean Average: 30.0
Standard Deviation: 14.14`,
        breakdown: "• 'arr.sum()' adds all numbers: [10, 20, 30].sum() = 60.\n• 'arr.mean()' computes average: [2, 4, 6].mean() = 4.0.\n• 'np.median([1, 10, 2, 9, 3])' sorts to [1, 2, 3, 9, 10] and picks the middle value 3.0.\n• 'arr.std()' measures spread; 'arr.var()' computes variance (std squared).",
      },
    },
    miniPractice: {
      question: 'What does arr.mean() return for arr = np.array([5, 10, 15])?',
      options: ['10.0', '30.0', '15.0', '5.0'],
      correctIndex: 0,
      explanation: '(5 + 10 + 15) / 3 = 30 / 3 = 10.0.',
    },
    monster: {
      name: 'Archivist Specter',
      archetype: 'Spectral Knowledge Demon',
      hp: 180,
      maxHp: 180,
      attack: 32,
      introDialogue: [
        'You think you can summarize my millennia of spectral power into a single scalar?',
      ],
      defeatDialogue: 'My variance... reduced to zero...',
      color: '#f59e0b',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 190,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 140,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_agg_01', 'q_agg_02', 'q_agg_03', 'q_agg_04', 'q_agg_05'],
    rewardXp: 350,
  },

  // LEVEL 13: AXIS MASTERY
  {
    id: 13,
    worldId: 3,
    worldTitle: 'World 3: Array Power',
    title: 'The Pillar Sanctum: AXIS Mastery',
    subtitle: 'Axis 0 (Columns) vs Axis 1 (Rows)',
    topic: 'axis',
    masteryCategory: 'Axis',
    levelType: 'exploration',
    environment: {
      name: 'Pillar Sanctum of Axes',
      type: 'ruins',
      skyColor: '#09090b',
      groundColor: '#27272a',
      accentColor: '#10b981',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Look closely at these towering pillars! This is one of the most vital concepts in all of NumPy: AXIS.',
        expression: 'serious',
      },
      {
        speaker: 'Aria',
        text: '`axis=0` collapses rows downwards along columns! `axis=1` collapses horizontally across each row! Never confuse the two!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "The Geometry of Axes & Shape Reduction",
        concept: "Multi-dimensional axes: Axis 0 (down columns) vs Axis 1 (across rows)",
        simpleAnalogy: "Imagine a spreadsheet grid of student test scores where rows are students and columns are subjects. Summing along Axis 0 squashes down each column to give the class score per subject. Summing along Axis 1 squashes across each row to give each student's total score!",
        explanation: "• In a 2D array of shape (M, N), axis=0 runs vertically down the rows, collapsing to shape (N,).\n• axis=1 runs horizontally across the columns, collapsing to shape (M,).\n• All aggregation functions accept axis: sum(axis=0), mean(axis=0), max(axis=0), min(axis=1).\n• matrix.max(axis=0) extracts column maximums; matrix.max(axis=1) extracts row maximums.\n• For shape (5, 8), matrix.mean(axis=0) produces an array of shape (8,).\n• Omitting the axis parameter aggregates all elements in the entire array into a single scalar.",
        whyUseIt: "Performs grouped statistical calculations across features (columns) or samples (rows) without writing loops.",
        useCases: [
          "Calculating average exam scores per subject (axis=0)",
          "Finding total sales generated by each regional store (axis=1)",
          "Finding peak temperature recorded by each sensor over time (axis=1)",
        ],
      },
      partB: {
        title: "Collapsing Dimensions Along Axis 0 and Axis 1",
        concept: "Column-wise (axis=0) vs row-wise (axis=1) aggregations and max/min",
        code: `import numpy as np

matrix = np.array([
  [10, 20],
  [30, 40]
])

print("axis=0 sum (columns):", matrix.sum(axis=0))
print("axis=1 sum (rows):", matrix.sum(axis=1))
print("matrix.max(axis=0):", matrix.max(axis=0))
print("matrix.max(axis=1):", matrix.max(axis=1))

# Example: (5, 8) matrix along axis=0 yields shape (8,)
big_mat = np.zeros((5, 8))
print("(5, 8) mean(axis=0) shape:", big_mat.mean(axis=0).shape)`,
        output: `axis=0 sum (columns): [40 60]
axis=1 sum (rows): [30 70]
matrix.max(axis=0): [30 40]
matrix.max(axis=1): [20 40]
(5, 8) mean(axis=0) shape: (8,)`,
        breakdown: "• In a 2x2 matrix [[1, 2], [3, 4]], sum(axis=0) sums columns [1+3, 2+4] = [4, 6].\n• sum(axis=1) sums rows [1+2, 3+4] = [3, 7].\n• For matrix [[10, 20], [30, 40]], max(axis=0) is [30, 40]; max(axis=1) is [20, 40].\n• For a (5, 8) matrix, mean(axis=0) results in shape (8,).",
        visualArray: [
          ['10 (0,0)', '20 (0,1)'],
          ['30 (1,0)', '40 (1,1)'],
        ],
      },
    },
    miniPractice: {
      question: 'In a 2D matrix with shape (3, 5), what is the shape of matrix.sum(axis=0)?',
      options: ['(5,)', '(3,)', '(3, 5)', 'scalar'],
      correctIndex: 0,
      explanation: 'Axis 0 collapses rows (length 3), leaving 5 column totals, shape `(5,)`.',
    },
    monster: {
      name: 'Colossal Axis Dreadnought',
      archetype: 'Titan of Dimensional Axes',
      hp: 185,
      maxHp: 185,
      attack: 36,
      introDialogue: [
        'Hahaha! I collapse entire rows and columns with a single stomp! Stand fast against axis 0!',
      ],
      defeatDialogue: 'My structural axes... shattered in both directions!',
      color: '#10b981',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 160,
        reactionDelay: 0.32,
        attackFrequency: 2.1,
        dodgeChance: 0.2,
        predictionStrength: 0.3,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_axis_01', 'q_axis_02', 'q_axis_03', 'q_axis_04', 'q_axis_05'],
    rewardXp: 380,
  },

  // =========================================================================
  // WORLD 4 — SMART ARRAYS (LEVELS 14 - 17)
  // =========================================================================

  // LEVEL 14: COMPARISONS
  {
    id: 14,
    worldId: 4,
    worldTitle: 'World 4: Smart Arrays',
    title: 'The Mirror Valley: Comparisons',
    subtitle: 'arr > 5, arr == val, np.all, np.any & Boolean Masks',
    topic: 'comparisons',
    masteryCategory: 'Comparisons & Filtering',
    levelType: 'exploration',
    environment: {
      name: 'Reflective Mirror Valley',
      type: 'valley',
      skyColor: '#0c4a6e',
      groundColor: '#0369a1',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'The mirrors of this valley evaluate truth and falsehood with absolute precision.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Applying comparison operators (`>`, `<`, `==`, `!=`) directly to arrays generates boolean masks without writing if-statements!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Element-Wise Truth Testing & np.array_equal",
        concept: "Relational comparisons: >, <, ==, !=, np.all(), np.any(), and np.array_equal()",
        simpleAnalogy: "Comparison is like holding up a quality inspection checklist to an entire production batch: every item that passes receives a True stamp, and every item that fails receives a False stamp.",
        explanation: "• Evaluating a condition on an array (arr > 5) evaluates element-wise, creating a boolean array of the same shape.\n• np.any(condition): Returns True if AT LEAST ONE element satisfies the condition.\n• np.all(condition): Returns True ONLY IF EVERY single element satisfies the condition.\n• Comparisons support standard operators: >, <, >=, <=, ==, !=.\n• np.array_equal(a, b): Checks if two arrays have the exact same shape and identical elements.",
        whyUseIt: "Creates conditional filters to detect anomalies, check bounds, and validate data integrity instantly.",
        useCases: [
          "Testing if any sensor values exceed safety thresholds (np.any(temp > 100))",
          "Validating that all student grades are positive (np.all(grades >= 0))",
          "Comparing experimental results against baseline benchmarks (np.array_equal)",
        ],
      },
      partB: {
        title: "Boolean Mask Generation and Array Logic",
        concept: "Testing conditions with >, any(), all(), and array_equal()",
        code: `import numpy as np

arr = np.array([5, 12, 18, 3])

mask = arr > 10
print("Boolean mask:", mask)
print("Are ALL elements > 0?", np.all(arr > 0))
print("Is ANY element > 15?", np.any(arr > 15))

# np.array_equal returns a single True/False scalar
print("array_equal([1, 2], [1, 2]):", np.array_equal([1, 2], [1, 2]))
print("arr == arr (element-wise):", arr == arr)`,
        output: `Boolean mask: [False  True  True False]
Are ALL elements > 0? True
Is ANY element > 15? True
array_equal([1, 2], [1, 2]): True
arr == arr (element-wise): [ True  True  True  True]`,
        breakdown: "• 'arr > 5' on [2, 5, 8] produces [False, False, True].\n• 'np.all([1, 2, -1] > 0)' returns False because -1 is not positive.\n• 'np.any([1, 2, -1] < 0)' returns True because -1 is negative.\n• 'np.array_equal([1, 2], [1, 2])' returns True.",
      },
    },
    miniPractice: {
      question: 'What does np.array([2, 8, 4]) == 8 evaluate to?',
      options: ['[False  True False]', 'True', '8', '[8]'],
      correctIndex: 0,
      explanation: 'Comparisons are element-wise: 2==8 (False), 8==8 (True), 4==8 (False).',
    },
    monster: {
      name: 'Mirror Doppelganger',
      archetype: 'Reflective Crystalline Fiend',
      hp: 180,
      maxHp: 180,
      attack: 32,
      introDialogue: [
        'I mirror your every movement! Can your boolean logic tell truth from illusion?',
      ],
      defeatDialogue: 'My reflections... shattered into False!',
      color: '#38bdf8',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 195,
        reactionDelay: 0.25,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 140,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_comp_01', 'q_comp_02', 'q_comp_03', 'q_comp_04', 'q_comp_05'],
    rewardXp: 390,
  },

  // LEVEL 15: BOOLEAN INDEXING
  {
    id: 15,
    worldId: 4,
    worldTitle: 'World 4: Smart Arrays',
    title: 'The Conditional Abyss: Boolean Indexing',
    subtitle: 'Filtering with arr[mask], &, |, and ~',
    topic: 'boolean_indexing',
    masteryCategory: 'Boolean Indexing',
    levelType: 'puzzle_platforms',
    puzzleGate: {
      id: 'gate_bool_idx',
      x: 520,
      prompt: 'Conditional Void Gate: Apply boolean filter to bridge the void',
      questionId: 'q_bool_01',
      bridgeStartX: 510,
      bridgeEndX: 730,
      activated: false,
    },
    environment: {
      name: 'Abyssal Void of Truth',
      type: 'ruins',
      skyColor: '#020617',
      groundColor: '#172554',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In this dark abyss, only data that satisfies True conditions can cross!',
        expression: 'serious',
      },
      {
        speaker: 'Aria',
        text: 'Passing a boolean mask inside square brackets `arr[condition]` extracts exactly the matching values! Use `&` for AND, `|` for OR, and `~` for NOT.',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Filtering Arrays via Boolean Masks",
        concept: "Boolean indexing: arr[mask], combining with &, |, ~, and 1D flattening",
        simpleAnalogy: "Imagine an automated filter sieve that only lets gold nuggets pass through while catching all dirt. Boolean indexing uses a True/False mask to extract only the elements that meet your criteria.",
        explanation: "• Passing a boolean array inside brackets arr[mask] extracts only the elements where the mask is True.\n• The returned result is ALWAYS flattened into a 1D array because row counts can vary.\n• Bitwise operators must be used instead of Python keywords: & (AND), | (OR), ~ (NOT).\n• Always enclose individual conditions in parentheses: (arr > 10) & (arr < 20).\n• arr[arr % 2 != 0] filters odd numbers; ~mask inverts True to False.",
        whyUseIt: "Filters and queries high-dimensional arrays at lightning speed without allocating intermediate lists.",
        useCases: [
          "Extracting all customer purchases between $50 and $200",
          "Isolating non-zero signal readings from background noise",
          "Filtering out negative values or error codes from sensor telemetry",
        ],
      },
      partB: {
        title: "Extracting Subsets with Boolean Indexing",
        concept: "Filtering with arr[condition], bitwise &, |, ~, and result flattening",
        code: `import numpy as np

scores = np.array([45, 88, 92, 59, 78])

# Extract passing scores >= 60
passing = scores[scores >= 60]
print("Passing scores:", passing)

# 2D Matrix Filtering: Always flattens to 1D!
matrix = np.array([[-1, 2], [3, -4]])
positives = matrix[matrix > 0]
print("2D filtered positives:", positives, "shape:", positives.shape)`,
        output: `Passing scores: [88 92 78]
2D filtered positives: [2 3] shape: (2,)`,
        breakdown: "• 'arr[arr > 10]' on [5, 12, 8, 20] extracts [12, 20].\n• '(arr > 10) & (arr < 20)' combines conditions with bitwise AND.\n• '~mask' flips boolean flags (True becomes False).\n• Filtering a 2D matrix [[-1, 2], [3, -4]] with arr > 0 flattens into 1D shape (2,): [2, 3].",
      },
    },
    miniPractice: {
      question: 'What does arr[arr % 2 == 0] extract from an integer array?',
      options: ['Only the even numbers', 'Only the odd numbers', 'An array of booleans', 'The indices of even numbers'],
      correctIndex: 0,
      explanation: '`arr % 2 == 0` evaluates to True for even numbers; boolean indexing extracts all even elements.',
    },
    monster: {
      name: 'Abyssal Void Dragon',
      archetype: 'Celestial Void Predator',
      hp: 185,
      maxHp: 185,
      attack: 34,
      introDialogue: [
        'Only entities satisfying True survive in the abyss! Can your boolean filters track my flight?',
      ],
      defeatDialogue: 'My condition evaluated to False... I plunge into the void!',
      color: '#38bdf8',
      spriteType: 'winged_beast',
      isFlying: true,
      aiProfile: {
        movementSpeed: 215,
        reactionDelay: 0.24,
        attackFrequency: 1.9,
        dodgeChance: 0.4,
        predictionStrength: 0.35,
        aggression: 0.75,
        preferredDistance: 190,
        personality: 'aerial_predator',
      },
    },
    questionIds: ['q_bool_01', 'q_bool_02', 'q_bool_03', 'q_bool_04', 'q_bool_05'],
    rewardXp: 400,
    unlockedSkill: {
      name: 'Conditional Purge',
      description: 'Filter out enemy health with vectorized boolean strikes!',
      icon: 'Filter',
    },
  },

  // LEVEL 16: NP.WHERE()
  {
    id: 16,
    worldId: 4,
    worldTitle: 'World 4: Smart Arrays',
    title: 'The Crossroads: np.where()',
    subtitle: 'Filtering, Conditional Replacement & Ternary Transformation',
    topic: 'np_where',
    masteryCategory: 'np.where()',
    levelType: 'exploration',
    environment: {
      name: 'Crossroads of Destinies',
      type: 'village',
      skyColor: '#18181b',
      groundColor: '#3f3f46',
      accentColor: '#f43f5e',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'At the crossroads, paths diverge depending on your choices.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`np.where(condition, if_true, if_false)` acts like an instantaneous vectorized ternary if-else statement across millions of values!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Vectorized Conditional Selection",
        concept: "Conditional selection: np.where(cond, x, y) and coordinate retrieval np.where(cond)",
        simpleAnalogy: "np.where() is a universal fork in the road: 'If the condition is met, take Path A; otherwise, take Path B.' It transforms arrays conditionally across all elements simultaneously.",
        explanation: "• Ternary selection: np.where(condition, if_true, if_false) evaluates condition element-wise.\n• Elements meeting the condition take values from if_true; otherwise from if_false.\n• Replacing values conditionally: np.where(arr < 0, 0, arr) replaces negative numbers with 0 while keeping positive numbers.\n• 1-argument form: np.where(condition) returns a tuple of index coordinate arrays where condition is True.\n• np.where(condition)[0] extracts the 1D index array of matches.",
        whyUseIt: "Replaces slow if-else loops with vectorized transformations and pinpoints exact indices of interest.",
        useCases: [
          "Assigning categorical labels: np.where(score >= 60, 'Pass', 'Fail')",
          "Capping minimum signal values to zero without modifying valid signals",
          "Finding coordinate indices of target objects in satellite images",
        ],
      },
      partB: {
        title: "Vectorized Conditional Logic with np.where()",
        concept: "Ternary transformation and extracting matching coordinate indices",
        code: `import numpy as np

scores = np.array([45, 85, 92, 55])

# Ternary replacement: Pass if >= 60, else Fail
grades = np.where(scores >= 60, "Pass", "Fail")
print("Grades:", grades)

# Single argument: get matching indices
failing_indices = np.where(scores < 60)
print("Failing student indices:", failing_indices[0])`,
        output: `Grades: ['Fail' 'Pass' 'Pass' 'Fail']
Failing student indices: [0 3]`,
        breakdown: "• 'np.where(scores >= 60, \"Pass\", \"Fail\")' evaluates [50, 75] to ['Fail', 'Pass'].\n• 'np.where(arr < 0, 0, arr)' zeroes out negative values while preserving positives.\n• 'np.where([True, False, True])[0]' returns index positions [0, 2].\n• 'np.where([5, 15] > 10, 100, 0)' produces [0, 100].",
      },
    },
    miniPractice: {
      question: 'What does np.where(arr > 0, arr, 0) do to negative values in an array?',
      options: ['Replaces negative values with 0', 'Deletes negative values', 'Multiplies negative values by 0', 'Raises an error'],
      correctIndex: 0,
      explanation: 'Where `arr > 0` is false (negative numbers or zero), it substitutes 0, cleanly clipping negative values.',
    },
    monster: {
      name: 'Crossroads Phantom Sentinel',
      archetype: 'Ternary Arbiter Fiend',
      hp: 185,
      maxHp: 185,
      attack: 34,
      introDialogue: [
        'Choose your branch, mortal! My strikes bifurcate through conditional logic!',
      ],
      defeatDialogue: 'My branch resolved to null...',
      color: '#f43f5e',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 190,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 140,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_where_01', 'q_where_02', 'q_where_03', 'q_where_04', 'q_where_05'],
    rewardXp: 410,
  },

  // LEVEL 17: CONDITIONAL DATA PROCESSING
  {
    id: 17,
    worldId: 4,
    worldTitle: 'World 4: Smart Arrays',
    title: 'The Analytics Citadel: Data Processing',
    subtitle: 'Pass/Fail Classifications, Mark Thresholds & Anomaly Clipping',
    topic: 'data_processing',
    masteryCategory: 'Real Dataset Processing',
    levelType: 'exploration',
    environment: {
      name: 'Analytics Citadel of Numbers',
      type: 'fortress',
      skyColor: '#09090b',
      groundColor: '#312e81',
      accentColor: '#818cf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'You have arrived at the Citadel of Analytics, where raw real-world data is processed.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Combine boolean masking, aggregations, and np.where() to clean data and solve practical problems!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Practical Data Processing Pipelines",
        concept: "Data processing pipelines: threshold counting, masked statistics, and clipping",
        simpleAnalogy: "Real-world data is raw and imperfect, like gemstones straight from a mine. A data processing pipeline washes the stones, discards debris (filtering), clips rough edges (capping), and produces polished statistical metrics.",
        explanation: "• Counting threshold matches: (scores >= 80).sum() counts how many elements satisfy the condition (True counts as 1, False as 0).\n• Conditional aggregation: scores[scores > 50].mean() calculates the mean of only qualifying items.\n• Summing subsets: arr[arr < 0].sum() computes the sum of negative numbers.\n• Clamping boundaries: np.where(arr > 100, 100, arr) clamps extreme outliers to 100 without importing extra libraries.\n• Combining masks and ufuncs forms the core of real-world data preprocessing.",
        whyUseIt: "Enables production-grade data cleansing, anomaly handling, and KPI calculations on large datasets.",
        useCases: [
          "Calculating pass rates and average passing scores in academic systems",
          "Clamping financial returns to risk thresholds in quantitative portfolios",
          "Filtering out corrupted sensor readings before feeding neural networks",
        ],
      },
      partB: {
        title: "Building Real Data Cleansing Pipelines",
        concept: "Threshold counting with .sum(), subset statistics, and outlier clamping",
        code: `import numpy as np

marks = np.array([65, 82, 90, 45, 88, 72])

# 1. Count students scoring >= 80
high_achievers = (marks >= 80).sum()

# 2. Average mark of passing students (>= 50)
pass_avg = marks[marks >= 50].mean()

print("Students >= 80:", high_achievers)
print("Passing Average:", np.round(pass_avg, 1))`,
        output: `Students >= 80: 3
Passing Average: 79.4`,
        breakdown: "• '(scores >= 80).sum()' counts elements scoring 80+: evaluates True flags to 1s.\n• 'scores[scores > 50].mean()' calculates the average of only passing scores.\n• 'np.where(arr > 100, 100, arr)' clamps values to a ceiling of 100.\n• 'arr[arr < 0].sum()' sums negative entries: [-5, 10, -15, 20] yields -20.",
      },
    },
    miniPractice: {
      question: 'How do you count how many numbers in array arr are negative?',
      options: ['(arr < 0).sum()', 'arr.count_negative()', 'arr[arr < 0].size', 'Both A and C are valid'],
      correctIndex: 3,
      explanation: 'Both `(arr < 0).sum()` and `arr[arr < 0].size` accurately count the matching elements.',
    },
    monster: {
      name: 'Citadel Analytics Dreadfiend',
      archetype: 'Dread Data Sentinel',
      hp: 185,
      maxHp: 185,
      attack: 36,
      introDialogue: [
        'Raw data means nothing without analytics! Can your algorithms survive my assault?',
      ],
      defeatDialogue: 'My metrics... neutralized by your data pipeline!',
      color: '#818cf8',
      spriteType: 'elite_demon',
      aiProfile: {
        movementSpeed: 185,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.3,
        predictionStrength: 0.35,
        aggression: 0.75,
        preferredDistance: 140,
        personality: 'elite_tactician',
      },
    },
    questionIds: ['q_cond_01', 'q_cond_02', 'q_cond_03', 'q_cond_04', 'q_cond_05'],
    rewardXp: 430,
  },

  // =========================================================================
  // WORLD 5 — BROADCASTING (LEVELS 18 - 20)
  // =========================================================================

  // LEVEL 18: BROADCASTING FUNDAMENTALS
  {
    id: 18,
    worldId: 5,
    worldTitle: 'World 5: Broadcasting',
    title: 'The Resonance Gates: Broadcasting',
    subtitle: 'Array + Scalar, 2D + 1D Vectors without Memory Copying',
    topic: 'broadcasting',
    masteryCategory: 'Broadcasting',
    levelType: 'exploration',
    environment: {
      name: 'Resonance Energy Plains',
      type: 'valley',
      skyColor: '#0f172a',
      groundColor: '#431407',
      accentColor: '#fb923c',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Look at the resonance waves! A single whisper expands into an echoing shockwave.',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'Broadcasting allows NumPy to perform arithmetic between arrays of different shapes with ZERO extra memory allocation!',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "What is Broadcasting?",
        concept: "Broadcasting foundation: scalar expansion, matching axes, and virtual stretching",
        simpleAnalogy: "Broadcasting is the magic of efficiency: instead of printing 1,000 separate paper copies of an announcement for each person, the manager makes a single announcement over the loudspeaker. The single scalar broadcasts across everyone with zero wasted paper!",
        explanation: "• Broadcasting allows arithmetic operations between arrays of different shapes without copying data in memory.\n• Scalar broadcasting: arr + 10 adds 10 to every single element in an array of any shape.\n• 1D to 2D broadcasting: Adding a 1D row of length N to an (M, N) matrix stretches the row down across all M rows.\n• Broadcasting along singleton axes: Shape (5, 3) and (5, 1) broadcast together into shape (5, 3).\n• Multi-dimensional: (8, 1, 6) + (1, 5, 1) broadcasts to shape (8, 5, 6).",
        whyUseIt: "Performs cross-dimensional operations with optimal memory performance, preventing out-of-memory crashes on massive arrays.",
        useCases: [
          "Subtracting mean feature values across tabular datasets",
          "Adding color brightness offsets across RGB image pixel arrays",
          "Scaling audio audio channels by stereo volume weights",
        ],
      },
      partB: {
        title: "Broadcasting Arrays Across Different Shapes",
        concept: "Scalar arithmetic, row-to-matrix broadcasting, and singleton dimensions",
        code: `import numpy as np

# Scalar broadcasting across np.ones((2, 3))
ones_scaled = np.ones((2, 3)) * 5
print("np.ones((2, 3)) * 5 sum:", ones_scaled.sum()) # 6 * 5 = 30

matrix = np.array([
  [1, 2, 3],
  [4, 5, 6]
]) # Shape (2, 3)

row = np.array([10, 20, 30]) # Shape (3,)

# The row broadcasts downwards across both rows!
print("Broadcasted sum:\n", matrix + row)`,
        output: `np.ones((2, 3)) * 5 sum: 30.0
Broadcasted sum:
 [[11 22 33]
 [14 25 36]]`,
        breakdown: "• 'np.array([1, 2, 3]) + 10' broadcasts 10 across all 3 elements: [11, 12, 13].\n• Adding [10, 20] to a 2x2 matrix [[1, 2], [3, 4]] yields [[11, 22], [13, 24]].\n• Shape (5, 3) + (5, 1) yields (5, 3); shape (8, 1, 6) + (1, 5, 1) yields (8, 5, 6).\n• '(np.ones((2, 3)) * 5).sum()' computes 6 elements * 5.0 = 30.0.",
      },
    },
    miniPractice: {
      question: 'When adding scalar 5 to an array with shape (3, 3), what happens?',
      options: ['5 is added to every individual element', '5 is added only to the first element', 'Error: shapes do not match', '5 is added to the main diagonal'],
      correctIndex: 0,
      explanation: 'The scalar (shape ()) broadcasts across all 9 elements in the 3x3 array.',
    },
    monster: {
      name: 'Resonance Behemoth',
      archetype: 'Vibrational Dreadnought',
      hp: 190,
      maxHp: 190,
      attack: 36,
      introDialogue: [
        'My footsteps echo across dimensions! Can your mind broadcast against my tremors?',
      ],
      defeatDialogue: 'My resonance... dampened across all axes!',
      color: '#fb923c',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 165,
        reactionDelay: 0.32,
        attackFrequency: 2.1,
        dodgeChance: 0.2,
        predictionStrength: 0.3,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_bcast_01', 'q_bcast_02', 'q_bcast_03', 'q_bcast_04', 'q_bcast_05'],
    rewardXp: 450,
    unlockedSkill: {
      name: 'Broadcast Blast',
      description: 'Expand your energy across all axes to obliterate enemy defenses!',
      icon: 'Radio',
    },
  },

  // LEVEL 19: BROADCASTING RULES
  {
    id: 19,
    worldId: 5,
    worldTitle: 'World 5: Broadcasting',
    title: 'The Dimensional Loom: Broadcasting Rules',
    subtitle: 'Trailing Dimension Alignment & Compatible vs Incompatible Shapes',
    topic: 'broadcasting',
    masteryCategory: 'Broadcasting',
    levelType: 'exploration',
    environment: {
      name: 'Celestial Loom of Dimensions',
      type: 'ruins',
      skyColor: '#1e1b4b',
      groundColor: '#312e81',
      accentColor: '#818cf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'The Loom weaves dimensions together according to strict compatibility laws.',
        expression: 'serious',
      },
      {
        speaker: 'Aria',
        text: 'Compare shapes from right to left! Two dimensions are compatible if they are equal, or if one of them is 1!',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "The Two Rules of Broadcasting",
        concept: "The Two Rules of Broadcasting: Trailing alignment and compatibility requirements",
        simpleAnalogy: "Think of checking if two gears will mesh together: two axes can mesh if they have the exact same tooth count, or if one gear has a flexible universal adapter of size 1 that expands to fit.",
        explanation: "• Alignment begins at the TRAILING (rightmost) dimension and moves left.\n• Rule: Two dimensions are compatible if: (1) They are equal, OR (2) One of them is 1.\n• If a dimension is missing in one array, it is prepended with 1.\n• Incompatible shapes raise a ValueError (e.g. (4, 3) and (4, 2) fail because 3 != 2 and neither is 1).\n• Shape (4, 3) and (3, 4) CANNOT broadcast together because 3 != 4 on the trailing axis.\n• Shape (4, 1) and (1, 7) broadcast cleanly to shape (4, 7).",
        whyUseIt: "Enables precise mathematical verification of tensor shapes before executing heavy computations.",
        useCases: [
          "Matrix-vector multiplication compatibility verification",
          "Batch data processing where batch dimension is prepended",
          "Time-series alignment across sensors with identical frequencies",
        ],
      },
      partB: {
        title: "Verifying Shape Compatibility with Broadcasting Rules",
        concept: "Right-to-left trailing alignment and identifying ValueError mismatches",
        code: `import numpy as np

# Compatible: (4, 1) and (1, 5) -> Result: (4, 5)
a = np.ones((4, 1))
b = np.ones((1, 5))
print("Broadcasted shape (4, 1) + (1, 5):", (a + b).shape)

# Incompatible: (4, 3) and (4, 2)
# Trailing dimensions 3 and 2 do not match and neither is 1 -> ValueError!`,
        output: `Broadcasted shape (4, 1) + (1, 5): (4, 5)`,
        breakdown: "• (4, 1) and (1, 7) align: dimensions 1 expand to 4 and 7, producing (4, 7).\n• (3, 1) and (3,) align: (3,) is treated as (1, 3), producing (3, 3).\n• (4, 3) and (4, 2) fail: trailing dimensions 3 and 2 are unequal and neither is 1.\n• (4, 3) and (3, 4) raise a ValueError because trailing dimensions 3 and 4 do not match.",
      },
    },
    miniPractice: {
      question: 'Which shape pair will raise a ValueError when added together?',
      options: ['(4, 3) and (4, 2)', '(3, 1) and (1, 5)', '(5, 1) and (5, 4)', '(1, 6) and (6,)'],
      correctIndex: 0,
      explanation: 'Comparing trailing dimensions from right: 3 vs 2. They do not match and neither is 1, so broadcasting fails.',
    },
    monster: {
      name: 'Loom Dimensional Weaver',
      archetype: 'Multidimensional Arbiter',
      hp: 190,
      maxHp: 190,
      attack: 38,
      introDialogue: [
        'Incompatible shapes shatter into chaos! Prove your dimensions can align with my weave!',
      ],
      defeatDialogue: 'My threads... severed by your compatible shapes...',
      color: '#818cf8',
      spriteType: 'elite_demon',
      aiProfile: {
        movementSpeed: 190,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.35,
        aggression: 0.75,
        preferredDistance: 140,
        personality: 'elite_tactician',
      },
    },
    questionIds: ['q_bcast_rules_01', 'q_bcast_rules_02', 'q_bcast_rules_03', 'q_bcast_rules_04', 'q_bcast_rules_05'],
    rewardXp: 470,
  },

  // LEVEL 20: BROADCASTING BOSS
  {
    id: 20,
    worldId: 5,
    worldTitle: 'World 5: Broadcasting',
    title: 'The Fortress of Broadcasting: BOSS',
    subtitle: 'High-Difficulty Broadcasting Synthesis Battle',
    topic: 'broadcasting',
    masteryCategory: 'Broadcasting',
    levelType: 'boss_phases',
    minions: [
      {
        name: 'Broadcasting Imp Alpha',
        hp: 50,
        maxHp: 50,
        attack: 12,
        color: '#ef4444',
        spriteType: 'demon_beast',
      },
    ],
    environment: {
      name: 'Fortress of the Broadcasting Sovereign',
      type: 'fortress',
      skyColor: '#1e1b4b',
      groundColor: '#4c0519',
      accentColor: '#f43f5e',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'This is the Fortress of Broadcasting! Ahead stands the Grand Dreadnought Malakor’s General.',
        expression: 'serious',
      },
      {
        speaker: 'Aria',
        text: 'To defeat him, you must solve complex multi-dimensional shape alignments under heavy combat fire!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Synthesis of Broadcasting Architecture",
        concept: "Broadcasting synthesis: Outer products, dataset normalization, and coordinate grids",
        simpleAnalogy: "A master clockmaker combines vertical and horizontal gear mechanisms into a master clockwork: vertical column vectors and horizontal row vectors combine to construct an entire 2D coordinate mesh or multiplication table in a single breath.",
        explanation: "• Outer multiplication: Multiplying an (N, 1) column vector by an (N,) or (1, N) row vector creates an (N, N) matrix.\n• Column normalization: Subtracting column means (shape (N,)) from a dataset of shape (M, N) normalizes each column independently: matrix - row_vector.\n• Multi-dimensional expansion: (10, 1, 4) + (1, 5, 4) expands to shape (10, 5, 4).\n• This level synthesizes broadcasting rules to defeat high-dimensional computational challenges.",
        whyUseIt: "Calculates all pairwise interactions, distances, and covariance grids in machine learning algorithms in 1 line.",
        useCases: [
          "Computing pairwise Euclidean distance matrices between geographical coordinates",
          "Creating 2D spatial coordinate meshes (np.meshgrid) for image warping",
          "Column-wise standardization of machine learning training data",
        ],
      },
      partB: {
        title: "Outer Grid Synthesis and Pairwise Operations",
        concept: "Constructing (N, M) interaction grids from (N, 1) and (1, M) vectors",
        code: `import numpy as np

# Outer multiplication grid: (3, 1) * (3,) -> (3, 3)
grid = np.arange(3).reshape(3, 1) * np.arange(3)
print("Outer multiplication grid (3x3):\n", grid)

# 3D multi-axis broadcasting: (10, 1, 4) + (1, 5, 4) -> (10, 5, 4)
a = np.zeros((10, 1, 4))
b = np.zeros((1, 5, 4))
print("Broadcasted 3D sum shape:", (a + b).shape)`,
        output: `Outer multiplication grid (3x3):
 [[0 0 0]
 [0 1 2]
 [0 2 4]]
Broadcasted 3D sum shape: (10, 5, 4)`,
        breakdown: "• 'np.arange(3).reshape(3, 1) * np.arange(3)' multiplies shape (3, 1) by (1, 3) to form a 3x3 table.\n• '(np.zeros((10, 1, 4)) + np.zeros((1, 5, 4)))' yields shape (10, 5, 4).\n• Normalizing an (M, N) dataset requires a mean vector of shape (N,) matching the column count.\n• Subtracting row_vector from matrix broadcasts across every row.",
      },
    },
    miniPractice: {
      question: 'To normalize a (100, 3) dataset by subtracting each column mean, what shape must the mean vector be?',
      options: ['(3,)', '(100,)', '(100, 1)', '(1, 100)'],
      correctIndex: 0,
      explanation: '`data.mean(axis=0)` produces shape `(3,)`, which broadcasts seamlessly across all 100 rows.',
    },
    monster: {
      name: 'Broadcasting Titan Dreadnought',
      archetype: 'Volcanic Dreadnought Boss',
      hp: 220,
      maxHp: 220,
      attack: 40,
      introDialogue: [
        'Hahaha! I command the geometry of reality! Broadcast your power or be pulverized underfoot!',
      ],
      defeatDialogue: 'My massive frame... shattered across all axes!',
      color: '#f43f5e',
      spriteType: 'boss',
      aiProfile: {
        movementSpeed: 175,
        reactionDelay: 0.28,
        attackFrequency: 1.8,
        dodgeChance: 0.3,
        predictionStrength: 0.35,
        aggression: 0.8,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_bcast_boss_01', 'q_bcast_boss_02', 'q_bcast_boss_03', 'q_bcast_boss_04', 'q_bcast_01', 'q_bcast_rules_01'],
    rewardXp: 550,
  },

  // =========================================================================
  // WORLD 6 — ARRAY MANIPULATION (LEVELS 21 - 25)
  // =========================================================================

  // LEVEL 21: CONCATENATION
  {
    id: 21,
    worldId: 6,
    worldTitle: 'World 6: Array Manipulation',
    title: 'The Great Causeway: Concatenation',
    subtitle: 'np.concatenate([a, b], axis=0 and axis=1)',
    topic: 'manipulation',
    masteryCategory: 'Array Manipulation',
    levelType: 'exploration',
    environment: {
      name: 'Great Causeway of Islands',
      type: 'village',
      skyColor: '#0c4a6e',
      groundColor: '#075985',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'The causeway bridges islands by joining stones along existing pathways.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`np.concatenate()` joins a sequence of arrays along an existing axis!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Joining Arrays Along Existing Axes",
        concept: "Array concatenation: np.concatenate([a, b], axis=...) and dimension preservation",
        simpleAnalogy: "Concatenation is like using industrial glue to bond two prefabricated bridge segments: you can join them end-to-end to make a longer bridge (axis 0), or side-by-side to make a wider bridge (axis 1). The joining edges must match perfectly in size!",
        explanation: "• np.concatenate([a, b], axis=0) stacks arrays vertically along rows, preserving column count.\n• np.concatenate([a, b], axis=1) attaches arrays horizontally along columns, preserving row count.\n• All non-concatenating dimensions must match exactly, or NumPy raises a ValueError.\n• Concatenating two 1D arrays of lengths 3 and 4 results in a 1D array of length 7.\n• Concatenating (3, 4) and (3, 4) along axis=1 produces shape (3, 8).",
        whyUseIt: "Merges new batches of data or additional feature columns into existing datasets.",
        useCases: [
          "Appending incoming sensor telemetry rows to an existing historical table (axis=0)",
          "Combining extracted feature columns with raw data matrices (axis=1)",
          "Stitching adjacent camera image strips into a wide panoramic image",
        ],
      },
      partB: {
        title: "Joining Arrays Along Existing Axes",
        concept: "Row-wise concatenation (axis=0) and column-wise concatenation (axis=1)",
        code: `import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

# axis=0: joins vertically (rows: 2+2=4)
print("axis=0 shape:", np.concatenate([a, b], axis=0).shape)

# np.ones concatenation example: (2, 5) + (4, 5) along axis=0 -> (6, 5)
ones_cat = np.concatenate([np.ones((2, 5)), np.ones((4, 5))], axis=0)
print("np.ones axis=0 shape:", ones_cat.shape)

# 1D concatenation with np.arange: length 3 + length 4 = length 7
range_cat = np.concatenate([np.arange(3), np.arange(4)])
print("np.arange concat length:", len(range_cat))`,
        output: `axis=0 shape: (4, 2)
np.ones axis=0 shape: (6, 5)
np.arange concat length: 7`,
        breakdown: "• 'np.concatenate([a, b])' joins 1D arrays: [1, 2] and [3, 4] becomes [1, 2, 3, 4].\n• Along axis=1: two (3, 4) matrices join to form shape (3, 8).\n• Along axis=0: shape (2, 5) and (4, 5) join to form shape (6, 5).\n• Passing mismatched non-concatenation dimensions raises a ValueError.",
      },
    },
    miniPractice: {
      question: 'What is the output of np.concatenate([np.array([1, 2]), np.array([3, 4])])?',
      options: ['[1 2 3 4]', '[[1 2], [3 4]]', '[4 6]', '[[1 3], [2 4]]'],
      correctIndex: 0,
      explanation: '1D concatenation joins elements end-to-end, producing `[1 2 3 4]`.',
    },
    monster: {
      name: 'Causeway Stone Drake',
      archetype: 'Stone Amphibian Fiend',
      hp: 180,
      maxHp: 180,
      attack: 34,
      introDialogue: [
        'You cannot cross without concatenating your path! Can your logic merge against my armor?',
      ],
      defeatDialogue: 'My body... fragmented along its join seam...',
      color: '#38bdf8',
      spriteType: 'demon_beast',
      aiProfile: {
        movementSpeed: 180,
        reactionDelay: 0.3,
        attackFrequency: 2.0,
        dodgeChance: 0.25,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 130,
        personality: 'aggressive_beast',
      },
    },
    questionIds: ['q_concat_01', 'q_concat_02', 'q_concat_03', 'q_concat_04', 'q_concat_05'],
    rewardXp: 480,
  },

  // LEVEL 22: STACK
  {
    id: 22,
    worldId: 6,
    worldTitle: 'World 6: Array Manipulation',
    title: 'The Sky Tower: np.stack()',
    subtitle: 'Creating New Dimensions with np.stack()',
    topic: 'manipulation',
    masteryCategory: 'Array Manipulation',
    levelType: 'exploration',
    environment: {
      name: 'Sky Tower Pagoda',
      type: 'village',
      skyColor: '#1e1b4b',
      groundColor: '#334155',
      accentColor: '#a855f7',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Unlike concatenation which joins along existing paths, building the Sky Tower requires stacking floors on top of each other!',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: '`np.stack()` introduces a brand NEW dimension, increasing `ndim` by 1!',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "Stacking Arrays into New Dimensions",
        concept: "Dimensional expansion: np.stack() creating a new axis (ndim increases by 1)",
        simpleAnalogy: "Unlike concatenation which extends an existing table, stacking is taking two individual 2D blueprint drawings and placing them on top of each other to form a 3D architectural model. You create an entirely new axis of depth!",
        explanation: "• np.stack([a, b], axis=...) joins arrays along a BRAND NEW axis, increasing ndim by 1.\n• Concatenate joins along an existing axis; stack creates a new dimension.\n• All input arrays MUST have the exact same shape.\n• Stacking three 1D arrays of shape (10,) along axis=0 gives shape (3, 10); along axis=1 gives (10, 3).\n• Stacking with axis=-1 inserts the new dimension at the trailing end: three (4, 5) arrays become (4, 5, 3).",
        whyUseIt: "Packages individual frames or feature maps into multi-dimensional tensor batches for deep learning.",
        useCases: [
          "Stacking separate Red, Green, and Blue 2D grayscale plates into a 3D color image (axis=-1)",
          "Batching multiple patient ECG recordings into a 3D tensor for recurrent neural nets",
          "Stacking time-lapse camera photos into a video clip",
        ],
      },
      partB: {
        title: "Constructing New Axes with np.stack()",
        concept: "Increasing ndim by 1, comparing axis=0, axis=1, and trailing axis=-1",
        code: `import numpy as np

x = np.array([1, 2, 3])
y = np.array([4, 5, 6])
z = np.array([7, 8, 9])

# concatenate keeps 1D: shape (6,), ndim remains 1
print("concatenate shape:", np.concatenate([x, y]).shape)

# stack creates a NEW axis: ndim increases from 1 to 2!
stacked = np.stack([x, y, z], axis=0)
print("stack 3 vectors axis=0 shape:", stacked.shape)
print("stack total size:", stacked.size, "| ndim:", stacked.ndim)`,
        output: `concatenate shape: (6,)
stack 3 vectors axis=0 shape: (3, 3)
stack total size: 9 | ndim: 2`,
        breakdown: "• Stacking three (10,) arrays along axis=0 creates shape (3, 10).\n• Stacking along axis=1 creates shape (10, 3).\n• Stacking three (4, 5) arrays with axis=-1 creates shape (4, 5, 3).\n• Unlike concatenate, np.stack requires all input arrays to share identical shapes.",
      },
    },
    miniPractice: {
      question: 'What is the shape of np.stack([a, b]) when both a and b have shape (5,)?',
      options: ['(2, 5)', '(10,)', '(5, 2)', '(5,)'],
      correctIndex: 0,
      explanation: '`np.stack` along default axis=0 creates shape `(2, 5)`.',
    },
    monster: {
      name: 'Sky Tower Phantom',
      archetype: 'Tower Specter Fiend',
      hp: 180,
      maxHp: 180,
      attack: 35,
      introDialogue: [
        'Each tier of the tower elevates my power! Can your stacked dimensions reach my height?',
      ],
      defeatDialogue: 'My stacked towers... collapsed into ground zero...',
      color: '#a855f7',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 190,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 140,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_stack_01', 'q_stack_02', 'q_stack_03', 'q_stack_04', 'q_stack_05'],
    rewardXp: 490,
  },

  // LEVEL 23: VSTACK & HSTACK
  {
    id: 23,
    worldId: 6,
    worldTitle: 'World 6: Array Manipulation',
    title: 'The Dual Gate: vstack & hstack',
    subtitle: 'Vertical (Row-wise) vs Horizontal (Column-wise) Stacking',
    topic: 'manipulation',
    masteryCategory: 'Array Manipulation',
    levelType: 'exploration',
    environment: {
      name: 'Dual Gate Mountains',
      type: 'mountains',
      skyColor: '#0f172a',
      groundColor: '#1e3a8a',
      accentColor: '#60a5fa',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Notice the dual mountain passes: one ascends vertically, the other extends horizontally.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`np.vstack()` stacks vertically (row-wise), while `np.hstack()` stacks horizontally (column-wise)!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Convenient Stacking Helpers: vstack & hstack",
        concept: "Stacking convenience helpers: np.vstack() vs np.hstack() and 1D behavior",
        simpleAnalogy: "Remembering axis numbers can be tricky. vstack and hstack are intuitive shortcuts: vstack stacks vertically (top to bottom like pancakes 🥞), while hstack stacks horizontally (left to right like books on a shelf 📚).",
        explanation: "• np.vstack([a, b]): Stacks arrays vertically (row-wise, adding rows).\n• np.hstack([a, b]): Stacks arrays horizontally (column-wise, adding columns).\n• 1D array behavior: vstack stacks two 1D arrays into a 2D matrix (shape (2, N)); hstack connects them into a longer 1D array (shape (2N,)).\n• For 2D matrices: vstack requires matching column counts; hstack requires matching row counts.",
        whyUseIt: "Provides concise, readable code for assembling datasets without explicitly calculating axis indices.",
        useCases: [
          "Quickly appending a header row or summary row to a table (vstack)",
          "Combining left and right stereo audio microphone channels (hstack)",
          "Assembling matrix blocks in scientific physics models",
        ],
      },
      partB: {
        title: "Vertical and Horizontal Stacking in Practice",
        concept: "Using np.vstack for rows and np.hstack for columns across 1D and 2D arrays",
        code: `import numpy as np

# 1D stacking behavior
a = np.array([1, 2])
b = np.array([3, 4])
print("1D vstack shape (row matrix):", np.vstack([a, b]).shape) # (2, 2)
print("1D hstack shape (concatenated):", np.hstack([a, b]).shape) # (4,)

# 2D matrix stacking behavior with np.zeros
mat_v = np.vstack([np.zeros((3, 4)), np.zeros((2, 4))])
print("2D vstack (3, 4) + (2, 4) shape:", mat_v.shape) # (5, 4)

mat_h = np.hstack([np.zeros((3, 2)), np.zeros((3, 5))])
print("2D hstack (3, 2) + (3, 5) shape:", mat_h.shape) # (3, 7)`,
        output: `1D vstack shape (row matrix): (2, 2)
1D hstack shape (concatenated): (4,)
2D vstack (3, 4) + (2, 4) shape: (5, 4)
2D hstack (3, 2) + (3, 5) shape: (3, 7)`,
        breakdown: "• For two 1D arrays [1, 2] and [3, 4]: vstack yields a 2D matrix (2, 2); hstack yields 1D shape (4,).\n• 'np.vstack([zeros((3, 4)), zeros((2, 4))])' forms shape (5, 4).\n• 'np.hstack([zeros((3, 2)), zeros((3, 5))])' forms shape (3, 7).",
      },
    },
    miniPractice: {
      question: 'What is the shape of np.vstack([np.array([1, 2]), np.array([3, 4])])?',
      options: ['(2, 2)', '(4,)', '(1, 4)', '(2, 1)'],
      correctIndex: 0,
      explanation: '`vstack` places the two 2-element arrays as rows, creating shape `(2, 2)`.',
    },
    monster: {
      name: 'Dual Gate Gargoyle',
      archetype: 'Bifurcated Stone Fiend',
      hp: 180,
      maxHp: 180,
      attack: 35,
      introDialogue: [
        'Vertical heights or horizontal spans! You cannot conquer both gates at once!',
      ],
      defeatDialogue: 'My dual gates... breached simultaneously...',
      color: '#60a5fa',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 175,
        reactionDelay: 0.3,
        attackFrequency: 2.1,
        dodgeChance: 0.25,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_vhstack_01', 'q_vhstack_02', 'q_vhstack_03', 'q_vhstack_04', 'q_vhstack_05'],
    rewardXp: 500,
  },

  // LEVEL 24: SPLITTING
  {
    id: 24,
    worldId: 6,
    worldTitle: 'World 6: Array Manipulation',
    title: 'The River of Cleaving: Splitting',
    subtitle: 'np.split() & np.array_split()',
    topic: 'manipulation',
    masteryCategory: 'Array Manipulation',
    levelType: 'exploration',
    environment: {
      name: 'River of Cleaving Valleys',
      type: 'valley',
      skyColor: '#0c4a6e',
      groundColor: '#083344',
      accentColor: '#06b6d4',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'The river splits the valley cleanly into separate territories.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`np.split()` divides an array into multiple sub-arrays along any axis!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Partitioning Arrays: np.split & np.array_split",
        concept: "Partitioning arrays: np.split() equal division vs np.array_split() unequal handling",
        simpleAnalogy: "Splitting is like slicing a loaf of bread: you can cut it into perfectly equal sandwich slices (np.split), or if the loaf doesn't divide evenly among your friends, you can make slightly different sized slices without breaking the knife (np.array_split).",
        explanation: "• np.split(arr, sections): Splits an array into equal subarrays. If it cannot divide equally, it raises a ValueError.\n• np.array_split(arr, sections): Safely splits arrays into near-equal sections without raising an error for non-divisible lengths.\n• Splitting 2D arrays: axis=0 splits along rows (top to bottom); axis=1 splits along columns (left to right).\n• Splitting a (6, 8) matrix with np.split(matrix, 2, axis=0) yields two (3, 8) submatrices.\n• Splitting a (6, 8) matrix with np.split(matrix, 4, axis=1) yields four (6, 2) submatrices.",
        whyUseIt: "Divides large datasets into train/validation/test partitions and distributes chunks across parallel CPU cores.",
        useCases: [
          "Splitting machine learning datasets into training and testing folds (K-Fold cross validation)",
          "Dividing video streams into equal 30-frame scene clips",
          "Chunking large matrix calculations for multiprocessing worker threads",
        ],
      },
      partB: {
        title: "Partitioning Data with split and array_split",
        concept: "Equal division requirements, safe array_split, and multi-axis splitting",
        code: `import numpy as np

# 1D split
arr = np.arange(10)
part1, part2 = np.split(arr, 2)
print("1D Part 1:", part1)

# 2D Matrix Splitting: shape (6, 8)
mat = np.zeros((6, 8))

# Split rows into 2 parts along axis=0: each is (3, 8)
sub_rows = np.split(mat, 2, axis=0)
print("axis=0 split sub-array shape:", sub_rows[0].shape)

# Split cols into 4 parts along axis=1: each is (6, 2)
sub_cols = np.split(mat, 4, axis=1)
print("axis=1 split sub-array shape:", sub_cols[0].shape)`,
        output: `1D Part 1: [0 1 2 3 4]
axis=0 split sub-array shape: (3, 8)
axis=1 split sub-array shape: (6, 2)`,
        breakdown: "• 'np.split(arange(6), 3)' creates 3 equal subarrays of length 2.\n• 'np.split(arange(10), 3)' raises ValueError because 10 is not divisible by 3.\n• 'np.array_split(arange(10), 3)' divides safely into chunks of sizes 4, 3, and 3.\n• Splitting (6, 8) with axis=0 (2 parts) yields (3, 8); axis=1 (4 parts) yields (6, 2).",
      },
    },
    miniPractice: {
      question: 'What does np.split(np.arange(6), 3) return?',
      options: [
        '[array([0, 1]), array([2, 3]), array([4, 5])]',
        '[array([0, 3]), array([1, 4]), array([2, 5])]',
        '[array([0, 1, 2]), array([3, 4, 5])]',
        'ValueError',
      ],
      correctIndex: 0,
      explanation: '6 elements divided into 3 equal parts = 2 elements per sub-array.',
    },
    monster: {
      name: 'Cleaving Stream Serpent',
      archetype: 'Aquatic River Serpent',
      hp: 180,
      maxHp: 180,
      attack: 35,
      introDialogue: [
        'SSSHHH! Can your arrays survive being cleaved into partitioned sections?',
      ],
      defeatDialogue: 'My sections... divided to completion...',
      color: '#06b6d4',
      spriteType: 'demon_beast',
      aiProfile: {
        movementSpeed: 190,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.3,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 130,
        personality: 'aggressive_beast',
      },
    },
    questionIds: ['q_split_01', 'q_split_02', 'q_split_03', 'q_split_04', 'q_split_05'],
    rewardXp: 510,
  },

  // LEVEL 25: SORTING
  {
    id: 25,
    worldId: 6,
    worldTitle: 'World 6: Array Manipulation',
    title: 'The Tournament Grounds: Sorting',
    subtitle: 'np.sort() vs np.argsort() for Ranking',
    topic: 'sorting',
    masteryCategory: 'Array Manipulation',
    levelType: 'exploration',
    environment: {
      name: 'Tournament Grounds of Honor',
      type: 'village',
      skyColor: '#1e1b4b',
      groundColor: '#7f1d1d',
      accentColor: '#f59e0b',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'At the tournament grounds, warriors are ranked by their tournament scores.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`np.sort()` returns the sorted values. But `np.argsort()` returns the INDICES that would sort the array, essential for ranking!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Sorting Values vs Ranking Indices",
        concept: "Ordering and ranking: np.sort(), np.argsort(), np.argmax(), and np.argmin()",
        simpleAnalogy: "Think of an Olympic sprint race: np.sort tells you the finishing times in order (9.8s, 9.9s, 10.1s). np.argsort tells you the lane numbers of who won Gold, Silver, and Bronze (Lane 4, Lane 2, Lane 6). np.argmax immediately identifies the champion's lane!",
        explanation: "• np.sort(arr): Returns a sorted copy of array values in ascending order.\n• np.sort(arr)[::-1]: Sorts an array in descending order (highest to lowest).\n• np.argsort(arr): Returns the INDICES that would sort the array, essential for ranking and indirect sorting.\n• np.argmax(arr): Returns the index of the maximum value in the array.\n• np.argmin(arr): Returns the index of the minimum value in the array.",
        whyUseIt: "Ranks candidates, sorts search results, and pinpoints winner positions across high-dimensional arrays.",
        useCases: [
          "Building video game leaderboards and finding top 3 scorers",
          "Finding the nearest enemy in spatial game AI using argmin on distance vectors",
          "Extracting top predicted class probabilities in machine learning classifiers",
        ],
      },
      partB: {
        title: "Sorting Values and Extracting Rank Indices",
        concept: "Using np.sort, descending order [::-1], argsort, argmax, and argmin",
        code: `import numpy as np

scores = np.array([30, 95, 12, 80])
players = np.array(["Hero", "Aria", "Goblin", "Ronin"])

# argsort returns indices in ascending order
sorted_indices = np.argsort(scores)
print("Sorted indices:", sorted_indices)
print("Sorted scores:", scores[sorted_indices])
print("Ranked players:", players[sorted_indices])`,
        output: `Sorted indices: [2 0 3 1]
Sorted scores: [12 30 80 95]
Ranked players: ['Goblin' 'Hero' 'Ronin' 'Aria']`,
        breakdown: "• 'np.sort([30, 10, 20])' yields [10, 20, 30].\n• 'np.argsort([30, 10, 20])' returns [1, 2, 0] (indices of ascending values).\n• 'np.argmax(arr)' returns the index of the largest number.\n• 'np.argmin([40, 10, 30])' returns index 1 (where 10 is located).",
      },
    },
    miniPractice: {
      question: 'What does np.argsort(np.array([40, 10, 20])) return?',
      options: ['[1 2 0]', '[10 20 40]', '[0 1 2]', '[2 1 0]'],
      correctIndex: 0,
      explanation: 'Index 1 (10) is smallest, index 2 (20) is middle, index 0 (40) is largest. Result: `[1 2 0]`.',
    },
    monster: {
      name: 'Tournament Champion Golem',
      archetype: 'Grand Arena Champion',
      hp: 185,
      maxHp: 185,
      attack: 36,
      introDialogue: [
        'Only the highest-ranked warriors survive the tournament! Can your argsort determine your rank?',
      ],
      defeatDialogue: 'My ranking... dropped to zero...',
      color: '#f59e0b',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 180,
        reactionDelay: 0.3,
        attackFrequency: 2.0,
        dodgeChance: 0.25,
        predictionStrength: 0.3,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_sort_01', 'q_sort_02', 'q_sort_03', 'q_sort_04', 'q_sort_05'],
    rewardXp: 530,
  },

  // =========================================================================
  // WORLD 7 — MEMORY AND STRUCTURE (LEVELS 26 - 28)
  // =========================================================================

  // LEVEL 26: COPY VS VIEW
  {
    id: 26,
    worldId: 7,
    worldTitle: 'World 7: Memory & Structure',
    title: 'The Hall of Mirrors: Copy vs View',
    subtitle: 'copy(), view(), base Attribute & Mutation Risks',
    topic: 'memory',
    masteryCategory: 'Copy vs View',
    levelType: 'exploration',
    environment: {
      name: 'Hall of Memory Mirrors',
      type: 'caves',
      skyColor: '#0f172a',
      groundColor: '#334155',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Look at the reflections in the glass. If you touch the glass, do you touch the object itself?',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'This is the crucial distinction between a View (which shares memory) and a Copy (which allocates independent memory)!',
        expression: 'serious',
      },
    ],
    theory: {
      partA: {
        title: "Shared Memory Views vs Independent Copies",
        concept: "Memory architecture: Shared views vs independent copies, and arr.base verification",
        simpleAnalogy: "A View is looking at yourself in a mirror: if you paint your nose red, the reflection has a red nose too because you share the same reality. A Copy is taking a printed photograph: drawing on the photograph has zero effect on your real face!",
        explanation: "• Slicing (arr[0:2]) creates a VIEW: it points to the exact same memory buffer as the original.\n• Mutating a view mutates the original array in-place (e.g. view[0] = 99 changes original[0] to 99).\n• arr.base: If an array is a view, arr.base points to the original owner; if it owns its memory, arr.base is None.\n• arr.copy(): Allocates a completely new independent buffer; modifying a copy NEVER affects the original.\n• Reshaping an array returns a view whenever memory is contiguous.",
        whyUseIt: "Prevents subtle data corruption bugs while maximizing performance by avoiding unnecessary memory duplication.",
        useCases: [
          "Creating safe snapshot copies of game state before simulation steps",
          "Modifying cropped image previews without corrupting raw photographic data",
          "Inspecting memory ownership in high-throughput data processing pipelines",
        ],
      },
      partB: {
        title: "Inspecting Memory Sharing and Mutation Safety",
        concept: "Shared buffer views, arr.base ownership checks, and copy() safety",
        code: `import numpy as np

orig = np.array([1, 2, 3, 4])

# Slice view shares memory!
view_arr = orig[:2]
view_arr[0] = 99
print("Original after view mutation:", orig) # [99 2 3 4]

# reshape() creates a VIEW when contiguous!
reshaped_view = orig.reshape(2, 2)
print("Is reshape a view (base is not None)?", reshaped_view.base is not None)

# Explicit copy creates independent memory!
copy_arr = orig.copy()
copy_arr[0] = 0
print("Original after copy mutation:", orig) # [99 2 3 4] (untouched!)`,
        output: `Original after view mutation: [99  2  3  4]
Is reshape a view (base is not None)? True
Original after copy mutation: [99  2  3  4]`,
        breakdown: "• Mutating a slice view 'view_arr[0] = 99' updates the original array element to 99.\n• 'arr.base is not None' confirms the array is a view sharing another array's memory.\n• For an original array created directly, 'arr.base' is None.\n• 'arr.copy()' creates a dedicated buffer with no memory sharing.",
      },
    },
    miniPractice: {
      question: 'What happens to the original array when you modify an element in a basic slice view?',
      options: ['The original array is modified in-place', 'The original array remains untouched', 'A copy is made on write', 'A ValueError is raised'],
      correctIndex: 0,
      explanation: 'Slices in NumPy share the same memory buffer as the original array; modifying the slice mutates the original.',
    },
    monster: {
      name: 'Memory Mirror Phantom',
      archetype: 'Evasive Memory Fiend',
      hp: 185,
      maxHp: 185,
      attack: 35,
      introDialogue: [
        'Strike me and you strike your own reflection! Can your mind distinguish copies from views?',
      ],
      defeatDialogue: 'My shared memory pointer... severed...',
      color: '#38bdf8',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 195,
        reactionDelay: 0.26,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.35,
        aggression: 0.7,
        preferredDistance: 140,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_copyview_01', 'q_copyview_02', 'q_copyview_03', 'q_copyview_04', 'q_copyview_05'],
    rewardXp: 540,
  },

  // LEVEL 27: TRANSPOSE
  {
    id: 27,
    worldId: 7,
    worldTitle: 'World 7: Memory & Structure',
    title: 'The Inversion Sanctum: Transpose',
    subtitle: 'arr.T & np.transpose() for 2D and Higher Dimensions',
    topic: 'transpose',
    masteryCategory: 'Transpose',
    levelType: 'exploration',
    environment: {
      name: 'Inversion Sanctum',
      type: 'ruins',
      skyColor: '#18181b',
      groundColor: '#3b0764',
      accentColor: '#c084fc',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In this sanctum, gravity flips and rows become columns.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`arr.T` and `np.transpose()` swap the axes of an array instantly without copying data!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Axis Inversion Mechanics",
        concept: "Matrix transposition: arr.T, (arr.T).T, and np.transpose() for higher dimensions",
        simpleAnalogy: "Transposing is like turning a spreadsheet or photo 90 degrees: what used to be rows reading downward now become columns reading across. In 3D space, it allows swapping any pair of spatial axes.",
        explanation: "• arr.T: Transposes a 2D matrix by swapping rows and columns (shape (M, N) becomes (N, M)).\n• Element (0, 0) remains unchanged at coordinate (0, 0).\n• Double transposition restores the original matrix: (arr.T).T == arr.\n• arr.T creates a zero-copy VIEW by swapping internal memory strides; it never copies raw data.\n• Higher dimensions: np.transpose(arr, axes) permutes axes (e.g. (2, 3, 4) with (1, 2, 0) becomes (3, 4, 2)).",
        whyUseIt: "Aligns matrix dimensions for matrix multiplication (@) and swaps image channel layouts (e.g. PyTorch channels-first vs TensorFlow channels-last).",
        useCases: [
          "Converting image tensors between (Height, Width, Channels) and (Channels, Height, Width)",
          "Transposing feature matrices for linear regression closed-form equations (X.T @ X)",
          "Rotating 2D spatial coordinate grids",
        ],
      },
      partB: {
        title: "Flipping Axes with arr.T and np.transpose()",
        concept: "Swapping dimensions without memory copies, double inversion, and multi-axis permutation",
        code: `import numpy as np

matrix = np.array([
  [1, 2, 3],
  [4, 5, 6]
]) # Shape (2, 3)

print("Original shape:", matrix.shape)
print("Transposed (arr.T):\n", matrix.T)
print("Transposed shape:", matrix.T.shape)`,
        output: `Original shape: (2, 3)
Transposed (arr.T):
 [[1 4]
 [2 5]
 [3 6]]
Transposed shape: (3, 2)`,
        breakdown: "• For shape (3, 7), 'arr.T' produces shape (7, 3).\n• Element (0, 0) remains identical between arr and arr.T.\n• '(arr.T).T' reproduces the original matrix arr.\n• 'np.transpose(arr, (1, 2, 0))' permutes a 3D tensor from (2, 3, 4) to (3, 4, 2).",
      },
    },
    miniPractice: {
      question: 'What is the shape of arr.T when arr has shape (4, 9)?',
      options: ['(9, 4)', '(4, 9)', '(36,)', '(1, 36)'],
      correctIndex: 0,
      explanation: 'Transposing swaps the axes: (4, 9) becomes (9, 4).',
    },
    monster: {
      name: 'Inversion Gravity Fiend',
      archetype: 'Gravitational Arbiter',
      hp: 185,
      maxHp: 185,
      attack: 36,
      introDialogue: [
        'Gravity inverts at my command! Can your matrix operations handle transposed reality?',
      ],
      defeatDialogue: 'My inverted axes... flipped back to zero...',
      color: '#c084fc',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 175,
        reactionDelay: 0.3,
        attackFrequency: 2.0,
        dodgeChance: 0.25,
        predictionStrength: 0.3,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_trans_01', 'q_trans_02', 'q_trans_03', 'q_trans_04', 'q_trans_05'],
    rewardXp: 550,
  },

  // LEVEL 28: ADVANCED RESHAPING
  {
    id: 28,
    worldId: 7,
    worldTitle: 'World 7: Memory & Structure',
    title: 'The Dimensional Squeeze: Advanced Reshaping',
    subtitle: 'np.squeeze(), Dimension Manipulation & Memory Order',
    topic: 'advanced_reshape',
    masteryCategory: 'Reshaping',
    levelType: 'exploration',
    environment: {
      name: 'Dimensional Squeeze Cavern',
      type: 'caves',
      skyColor: '#09090b',
      groundColor: '#172554',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Arrays often accumulate redundant length-1 dimensions during machine learning operations.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`np.squeeze()` strips away extraneous single-dimensional axes to restore clean tensors!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Stripping Redundant Dimensions & Advanced Unrolling",
        concept: "Dimension stripping: np.squeeze(), specific axis stripping, and flatten() vs ravel()",
        simpleAnalogy: "Imagine an empty shipping box that contains 1 shirt packaged inside an extra plastic sleeve inside another cardboard envelope: shape (1, 5, 1). np.squeeze strips away the redundant empty packaging, leaving just the 5 items in a clean 1D line!",
        explanation: "• np.squeeze(arr): Removes all single-dimensional entries (dimensions of size 1) from the shape.\n• Shape (1, 5, 1) squeezes down to 1D shape (5,).\n• np.squeeze(arr, axis=0) removes only the specified axis if its length is 1 (e.g. (1, 4, 5) becomes (4, 5)).\n• arr.flatten(): Always allocates and returns a 1D copy.\n• arr.ravel(): Returns a fast 1D view whenever contiguous, saving memory.\n• arr.reshape(-1, 2) on 10 elements automatically calculates 5 rows: shape (5, 2).",
        whyUseIt: "Cleans up singleton dimensions produced by machine learning model outputs, slices, and expand_dims.",
        useCases: [
          "Converting single-channel batch outputs from neural nets back into 1D audio or 2D images",
          "Stripping dummy batch dimensions (1, 28, 28) into (28, 28) before rendering",
          "Unrolling multi-dimensional matrices to compute 1D signal autocorrelations",
        ],
      },
      partB: {
        title: "Squeezing Singleton Axes and Flattening to 1D",
        concept: "Using np.squeeze(), axis targeting, ravel() vs flatten(), and -1 inference",
        code: `import numpy as np

# 1. np.squeeze with specific axis
tensor = np.zeros((1, 4, 5))
print("squeeze axis=0 shape:", np.squeeze(tensor, axis=0).shape) # (4, 5)

# 2. Reshape with -1 dimension inference
arr = np.arange(10) # 10 elements
reshaped = arr.reshape(-1, 2)
print("-1 Reshape shape (10 // 2):", reshaped.shape) # (5, 2)

# 3. flatten() (copy) vs ravel() (view)
mat = np.array([[9, 8], [7, 6]])
print("ravel() 1D view first element:", mat.ravel()[0]) # 9
print("ravel() shares memory with mat?", mat.ravel().base is not None)`,
        output: `squeeze axis=0 shape: (4, 5)
-1 Reshape shape (10 // 2): (5, 2)
ravel() 1D view first element: 9
ravel() shares memory with mat? True`,
        breakdown: "• 'np.squeeze()' reduces shape (1, 5, 1) to (5,).\n• 'np.squeeze(arr, axis=0)' on shape (1, 4, 5) produces (4, 5).\n• 'flatten()' always returns a fresh copy; 'ravel()' returns a view when memory is contiguous.\n• 'ravel()[0]' accesses the first element of the flattened view.",
      },
    },
    miniPractice: {
      question: 'What does np.squeeze() do to an array of shape (1, 8, 1)?',
      options: ['Reduces shape to (8,)', 'Reshapes to (1, 8)', 'Flattens to size 1', 'ValueError'],
      correctIndex: 0,
      explanation: 'All dimensions of size 1 are removed, reducing (1, 8, 1) to `(8,)`.',
    },
    monster: {
      name: 'Dimensional Compactor',
      archetype: 'Cavern Pressure Fiend',
      hp: 185,
      maxHp: 185,
      attack: 36,
      introDialogue: [
        'The walls contract around you! Squeeze your dimensions or be crushed into a point!',
      ],
      defeatDialogue: 'My pressure... decompressed into empty space...',
      color: '#38bdf8',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 170,
        reactionDelay: 0.32,
        attackFrequency: 2.1,
        dodgeChance: 0.2,
        predictionStrength: 0.3,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_advshape_01', 'q_advshape_02', 'q_advshape_03', 'q_advshape_04', 'q_advshape_05'],
    rewardXp: 560,
  },

  // =========================================================================
  // WORLD 8 — RANDOM NUMPY (LEVELS 29 - 30)
  // =========================================================================

  // LEVEL 29: RANDOM NUMBERS (default_rng)
  {
    id: 29,
    worldId: 8,
    worldTitle: 'World 8: Random NumPy',
    title: 'The Chaos Citadel: Random Numbers',
    subtitle: 'np.random.default_rng(), integers, standard_normal & Seeds',
    topic: 'random',
    masteryCategory: 'Random Numbers',
    levelType: 'exploration',
    environment: {
      name: 'Citadel of Digital Chaos',
      type: 'fortress',
      skyColor: '#18181b',
      groundColor: '#701a75',
      accentColor: '#f43f5e',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In the Chaos Citadel, randomness rules reality.',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'Modern NumPy uses `np.random.default_rng(seed)` for fast, statistically sound pseudo-random number generation!',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "Modern NumPy Random API",
        concept: "Modern random API: np.random.default_rng(seed), integers, random, and normal",
        simpleAnalogy: "Generating random numbers is like having a digital roulette wheel: you can roll whole numbers (like rolling dice), uniform percentages between 0% and 100%, or bell-curve test scores. Setting a seed is like recording the exact sequence so anyone can replay the same rolls!",
        explanation: "• Modern NumPy standard: Always use rng = np.random.default_rng(seed) (avoids legacy state issues).\n• rng.integers(low, high): Generates random integers where high is EXCLUSIVE by default (integers(1, 7) samples 1 to 6 inclusive, like a 6-sided die).\n• rng.random(size): Generates random floats in the half-open interval [0.0, 1.0).\n• rng.normal(loc=mean, scale=std, size): Generates numbers from a Gaussian bell curve.\n• Passing an integer seed (e.g. default_rng(42)) guarantees 100% reproducible results for scientific testing.",
        whyUseIt: "Drives procedural content generation, stochastic simulations, game mechanics, and neural net weight initialization.",
        useCases: [
          "Simulating dice rolls, critical hit chances, and enemy spawn locations in video games",
          "Initializing weights and biases in deep neural networks",
          "Generating reproducible synthetic test datasets for data validation",
        ],
      },
      partB: {
        title: "Generating Pseudo-Random Numbers with default_rng()",
        concept: "Setting seeds, sampling integers, uniform floats, and Gaussian normal distributions",
        code: `import numpy as np

# Initialize with seed for reproducibility
rng = np.random.default_rng(seed=42)

# 4 random integers between 1 and 10 (10 is exclusive!)
rand_ints = rng.integers(1, 11, size=4)
print("Random integers (1-10):", rand_ints)

# Gaussian normal distribution with explicit shape (4, 5)
gaussian_mat = rng.normal(loc=0.0, scale=1.0, size=(4, 5))
print("Gaussian array shape:", gaussian_mat.shape)`,
        output: `Random integers (1-10): [ 1  8  7  7]
Gaussian array shape: (4, 5)`,
        breakdown: "• 'rng = np.random.default_rng(42)' establishes a reproducible random generator.\n• 'rng.integers(1, 7)' generates numbers from 1 through 6 inclusive (7 is excluded).\n• 'rng.random()' produces floats in [0.0, 1.0).\n• 'rng.normal(loc=0.0, scale=1.0, size=(4, 5))' produces a 4x5 Gaussian matrix.",
      },
    },
    miniPractice: {
      question: 'What is the recommended modern NumPy function to instantiate a random generator?',
      options: ['np.random.default_rng()', 'np.random.rand()', 'np.random.random_generator()', 'np.math.random()'],
      correctIndex: 0,
      explanation: '`np.random.default_rng()` is the official modern generator API across modern NumPy.',
    },
    monster: {
      name: 'Chaos Nether Drake',
      archetype: 'Chaos Aerial Fiend',
      hp: 185,
      maxHp: 185,
      attack: 36,
      introDialogue: [
        'ROAAAR! You cannot predict stochastic chaos! My flight is completely non-deterministic!',
      ],
      defeatDialogue: 'My pseudo-random seed... reproduced and defeated...',
      color: '#f43f5e',
      spriteType: 'flying_demon',
      isFlying: true,
      aiProfile: {
        movementSpeed: 210,
        reactionDelay: 0.25,
        attackFrequency: 1.9,
        dodgeChance: 0.4,
        predictionStrength: 0.35,
        aggression: 0.75,
        preferredDistance: 190,
        personality: 'aerial_predator',
      },
    },
    questionIds: ['q_rand_01', 'q_rand_02', 'q_rand_03', 'q_rand_04', 'q_rand_05'],
    rewardXp: 570,
  },

  // LEVEL 30: RANDOM DATA PROBLEMS
  {
    id: 30,
    worldId: 8,
    worldTitle: 'World 8: Random NumPy',
    title: 'The Monte Carlo Casino: Random Data',
    subtitle: 'Shuffling, Sampling & Monte Carlo Simulations',
    topic: 'random',
    masteryCategory: 'Random Numbers',
    levelType: 'exploration',
    environment: {
      name: 'Monte Carlo Grand Arena',
      type: 'fortress',
      skyColor: '#1e1b4b',
      groundColor: '#450a0a',
      accentColor: '#fbbf24',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In the Grand Arena, fortunes are decided by probability and simulation.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`rng.shuffle()` permutes arrays in-place, and `rng.choice()` samples random items with or without replacement!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Shuffling and Random Sampling",
        concept: "Random data manipulation: rng.shuffle vs rng.permutation, choice sampling, and Monte Carlo",
        simpleAnalogy: "Imagine shuffling a deck of cards: rng.shuffle mixes the physical deck in your hands (in-place). rng.permutation photocopies the deck into a new shuffled deck while keeping your original deck in order. A Monte Carlo simulation deals that deck 10,000 times to calculate your true odds of winning!",
        explanation: "• rng.shuffle(arr): Modifies the array IN-PLACE, randomly permuting its contents (returns None).\n• rng.permutation(arr): Leaves the original array untouched and returns a NEW shuffled copy.\n• rng.choice(arr, size, replace=False): Selects random samples without replacement (guarantees no duplicates).\n• rng.standard_normal(size): Draws samples from standard normal distribution (mean=0, std=1); expected mean is ~0.0.\n• Simulating coin flips: rng.integers(0, 2, size=1000) simulates 1,000 flips where 1 is Heads and 0 is Tails.",
        whyUseIt: "Executes randomized algorithms, bootstrapped statistical testing, and Monte Carlo probability modeling.",
        useCases: [
          "Shuffling card decks and training batches in machine learning algorithms",
          "Drawing winning raffle tickets without replacement (replace=False)",
          "Estimating financial portfolio value-at-risk through 10,000 simulated market scenarios",
        ],
      },
      partB: {
        title: "Shuffling, Sampling Without Replacement, and Simulation",
        concept: "Contrasting shuffle() vs permutation(), sampling with choice(), and Monte Carlo flips",
        code: `import numpy as np

rng = np.random.default_rng(seed=10)

# Simulate 1,000 rolls of two 6-sided dice
die1 = rng.integers(1, 7, size=1000)
die2 = rng.integers(1, 7, size=1000)
totals = die1 + die2

# Probability of rolling a 7
prob_seven = (totals == 7).mean()
print("Probability of rolling 7:", np.round(prob_seven, 3))`,
        output: `Probability of rolling 7: 0.168`,
        breakdown: "• 'rng.shuffle(arr)' alters arr in-place; 'rng.permutation(arr)' returns a new shuffled copy.\n• 'rng.choice(arr, size=2, replace=False)' guarantees selected items contain no duplicates.\n• 'rng.integers(0, 2, size=1000)' models 1,000 coin tosses (0=Tails, 1=Heads).\n• Samples from 'rng.standard_normal(1000000)' have a sample mean of approximately 0.0.",
      },
    },
    miniPractice: {
      question: 'Which method permutes the elements of an array directly in-place?',
      options: ['rng.shuffle(arr)', 'rng.permutation(arr)', 'rng.sample(arr)', 'arr.scramble()'],
      correctIndex: 0,
      explanation: '`rng.shuffle(arr)` modifies the array in-place, whereas `rng.permutation(arr)` returns a copy.',
    },
    monster: {
      name: 'Monte Carlo Gambler Fiend',
      archetype: 'Probabilistic Sorcerer',
      hp: 185,
      maxHp: 185,
      attack: 36,
      introDialogue: [
        'Roll the dice, mortal! The odds are stacked against your survival!',
      ],
      defeatDialogue: 'The probability... converged to my defeat...',
      color: '#fbbf24',
      spriteType: 'fire_demon',
      aiProfile: {
        movementSpeed: 185,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.3,
        predictionStrength: 0.35,
        aggression: 0.75,
        preferredDistance: 140,
        personality: 'fire_sorcerer',
      },
    },
    questionIds: ['q_randdata_01', 'q_randdata_02', 'q_randdata_03', 'q_randdata_04', 'q_randdata_05'],
    rewardXp: 580,
  },

  // =========================================================================
  // WORLD 9 — LINEAR ALGEBRA (LEVELS 31 - 33)
  // =========================================================================

  // LEVEL 31: MATRIX OPERATIONS
  {
    id: 31,
    worldId: 9,
    worldTitle: 'World 9: Linear Algebra',
    title: 'The Hall of Vectors: Matrix Operations',
    subtitle: 'Element-Wise (*) vs Matrix Multiplication (@)',
    topic: 'linear_algebra',
    masteryCategory: 'Linear Algebra',
    levelType: 'exploration',
    environment: {
      name: 'Hall of Vectors & Matrices',
      type: 'fortress',
      skyColor: '#030712',
      groundColor: '#1e1b4b',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Step into the Hall of Vectors, where matrices represent geometric space transformations.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Never confuse `*` with `@`! `*` is element-wise multiplication. `@` is true linear algebraic matrix multiplication!',
        expression: 'serious',
      },
    ],
    theory: {
      partA: {
        title: "Hadamard Product vs Matrix Multiplication",
        concept: "Linear algebra foundation: Element-wise (*) vs Matrix multiplication (@ / np.matmul)",
        simpleAnalogy: "Multiplying numbers element-by-element (*) is like two parallel rows of dancers each holding hands with the partner across from them. Matrix multiplication (@) is a ballroom dance where each row travels across every column, multiplying and summing their products into an entirely new transformation matrix.",
        explanation: "• A * B: Performs element-wise multiplication (requires matching shapes or broadcasting).\n• A @ B (or np.matmul(A, B)): Performs true linear algebraic matrix multiplication.\n• Dimension rule for @: Matrix A of shape (M, K) can ONLY multiply Matrix B of shape (K, N) — inner dimensions K must match!\n• Resulting shape is always (M, N) (outer dimensions).\n• Multiplying by identity matrix: A @ np.eye(N) leaves matrix A completely unchanged.",
        whyUseIt: "Serves as the foundational mathematical engine behind 3D computer graphics rotations and deep learning neural network layers.",
        useCases: [
          "Transforming 3D object vertices through rotation and translation matrices in gaming",
          "Computing dense forward-pass layers in artificial neural networks (X @ W + b)",
          "Solving economic input-output models and graph adjacency matrices",
        ],
      },
      partB: {
        title: "Comparing Element-Wise (*) and Matrix Multiplication (@)",
        concept: "Inner dimension matching (M, K) @ (K, N), identity preservation, and np.matmul",
        code: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[2, 0], [1, 2]])

# Matrix Multiplication (@)
print("Matrix Multiply (@):\n", A @ B)

# Multiplying by Identity Matrix (np.eye) returns unchanged matrix:
I = np.eye(2)
print("A @ np.eye(2):\n", A @ I)

# Dimension rule: (2, 3) @ (3, 4) -> (2, 4)
M1 = np.ones((2, 3))
M2 = np.ones((3, 4))
print("(2, 3) @ (3, 4) result shape:", (M1 @ M2).shape)`,
        output: `Matrix Multiply (@):
 [[ 4  4]
 [10  8]]
A @ np.eye(2):
 [[1. 2.]
 [3. 4.]]
(2, 3) @ (3, 4) result shape: (2, 4)`,
        breakdown: "• 'A * B' multiplies corresponding slots; 'A @ B' computes matrix inner products.\n• Shape (2, 3) @ (3, 4) matches on inner dimension 3, producing shape (2, 4).\n• Shape (2, 5) @ (4, 2) raises a ValueError because inner dimensions 5 and 4 do not match.\n• 'A @ np.eye(2)' preserves matrix A unaltered; 'np.matmul([[1, 0], [0, 1]], [3, 4])' yields [3, 4].",
      },
    },
    miniPractice: {
      question: 'What is the dedicated infix operator for matrix multiplication in modern Python and NumPy?',
      options: ['@', '*', '^', 'dot() only'],
      correctIndex: 0,
      explanation: 'The `@` symbol was introduced in Python 3.5+ specifically for matrix multiplication.',
    },
    monster: {
      name: 'Matrix Golem Guardian',
      archetype: 'Linear Transformation Golem',
      hp: 185,
      maxHp: 185,
      attack: 38,
      introDialogue: [
        'I transform coordinate spaces! Let us see if your matrix multiplication can break my determinant!',
      ],
      defeatDialogue: 'My transformation matrix... inverted...',
      color: '#38bdf8',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 175,
        reactionDelay: 0.3,
        attackFrequency: 2.0,
        dodgeChance: 0.25,
        predictionStrength: 0.3,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_matops_01', 'q_matops_02', 'q_matops_03', 'q_matops_04', 'q_matops_05'],
    rewardXp: 590,
  },

  // LEVEL 32: NP.DOT AND NP.MATMUL
  {
    id: 32,
    worldId: 9,
    worldTitle: 'World 9: Linear Algebra',
    title: 'The Inner Sanctum: Dot Products',
    subtitle: 'np.dot() vs np.matmul() & Vector Projection',
    topic: 'linear_algebra',
    masteryCategory: 'Linear Algebra',
    levelType: 'exploration',
    environment: {
      name: 'Inner Sanctum of Dot Products',
      type: 'caves',
      skyColor: '#020617',
      groundColor: '#3b0764',
      accentColor: '#c084fc',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'The dot product measures alignment between two vectors in space.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'For 1D vectors, `np.dot(a, b)` computes the inner product: `sum(a * b)`. For 2D matrices, it behaves as matrix multiplication!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Dot Product Mechanics & Outer Products",
        concept: "Dot and outer products: np.dot(), orthogonal vectors (dot=0), scalar dot, and np.outer()",
        simpleAnalogy: "If you buy 3 apples at $2 each and 4 bananas at $1 each, the dot product computes the total cash spent: (3*2) + (4*1) = $10. In geometry, if two arrows point at a 90-degree right angle (orthogonal), their dot product is exactly 0!",
        explanation: "• np.dot(a, b): For 1D vectors, computes the inner scalar dot product: sum(a * b).\n• Orthogonal vectors: Vectors pointing at 90 degrees (e.g. [1, 0] and [0, 1]) have a dot product of exactly 0.\n• Scalar dot product: np.dot(scalar, vector) multiplies every element (np.dot(5, [2, 3]) evaluates to [10, 15]).\n• np.outer(a, b): Computes the outer product: length M vector and length N vector produce an (M, N) matrix.\n• np.vdot(a, b): Dedicated vector dot product that flattens arrays and takes the complex conjugate of the first argument.",
        whyUseIt: "Calculates projections, cosine similarity in search engines, and spatial orientations in 3D lighting engines.",
        useCases: [
          "Calculating surface reflection angles in 3D video game lighting shaders",
          "Computing cosine similarity between text embedding vectors in AI search",
          "Computing total portfolio revenue from unit sales and price vectors",
        ],
      },
      partB: {
        title: "Inner Dot Products and Outer Matrix Construction",
        concept: "Computing np.dot(), orthogonal tests, scalar scaling, and np.outer() grids",
        code: `import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Inner dot product (scalar)
dot_prod = np.dot(a, b)
print("Dot product a · b:", dot_prod)

# Outer product matrix: shape (len(u), len(v))
u = np.array([1, 2])
v = np.array([3, 4, 5])
outer_mat = np.outer(u, v)
print("Outer product shape (2, 3):\n", outer_mat.shape)`,
        output: `Dot product a · b: 32
Outer product shape (2, 3): (2, 3)`,
        breakdown: "• 'np.dot([1, 2, 3], [4, 5, 6])' calculates (1*4) + (2*5) + (3*6) = 4 + 10 + 18 = 32.\n• Orthogonal vectors [1, 0] and [0, 1] produce a dot product of 0.\n• 'np.dot(5, [2, 3])' scales to [10, 15].\n• 'np.outer([1, 2], [3, 4, 5])' produces shape (2, 3) with all pairwise products.",
      },
    },
    miniPractice: {
      question: 'What is np.dot([2, 3], [4, 5])?',
      options: ['23', '20', '[8 15]', '14'],
      correctIndex: 0,
      explanation: '2*4 + 3*5 = 8 + 15 = 23.',
    },
    monster: {
      name: 'Orthogonal Spectral Shade',
      archetype: 'Geometric Shade Fiend',
      hp: 185,
      maxHp: 185,
      attack: 38,
      introDialogue: [
        'My movements are orthogonal to your perception! Can your dot product track my trajectory?',
      ],
      defeatDialogue: 'My vector projection... reduced to zero...',
      color: '#c084fc',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 195,
        reactionDelay: 0.26,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.35,
        aggression: 0.7,
        preferredDistance: 140,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_dot_01', 'q_dot_02', 'q_dot_03', 'q_dot_04', 'q_dot_05'],
    rewardXp: 600,
  },

  // LEVEL 33: LINEAR ALGEBRA (np.linalg)
  {
    id: 33,
    worldId: 9,
    worldTitle: 'World 9: Linear Algebra',
    title: 'The Throne of LAPACK: np.linalg',
    subtitle: 'Determinants, Inverses, Eigenvalues & Linear System Solvers',
    topic: 'linear_algebra',
    masteryCategory: 'Linear Algebra',
    levelType: 'exploration',
    environment: {
      name: 'Throne of LAPACK',
      type: 'fortress',
      skyColor: '#09090b',
      groundColor: '#450a0a',
      accentColor: '#dc2626',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'You have entered the inner sanctum of linear algebra: the `np.linalg` submodule.',
        expression: 'serious',
      },
      {
        speaker: 'Aria',
        text: 'Here, we solve systems of linear equations, invert non-singular matrices, and extract eigenvalues!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Advanced Matrix Algebra via np.linalg",
        concept: "Advanced linear algebra: np.linalg submodule, solve(Ax=b), det, inv, and norm",
        simpleAnalogy: "Linear algebra is the ultimate mathematical master key: instead of guessing unknown variables in a complex system of equations, np.linalg solves all variables simultaneously in a fraction of a millisecond.",
        explanation: "• np.linalg: Dedicated submodule for determinants, inversions, norms, and system solvers.\n• np.linalg.solve(A, b): Directly solves the matrix linear equation Ax = b for vector x.\n• np.linalg.det(A): Computes matrix determinant (det of identity matrix np.eye(N) is always 1.0).\n• Singular matrices: When det(A) == 0, matrix A has no inverse (singular matrix) and cannot be inverted.\n• np.linalg.norm(v): Computes vector Euclidean length/magnitude (e.g. norm([3, 4]) is sqrt(3^2 + 4^2) = 5.0).",
        whyUseIt: "Solves simultaneous equations in physics engines, electrical circuits, and aerospace navigation systems.",
        useCases: [
          "Calculating GPS satellite position triangulation from distance signals",
          "Simulating structural stresses and forces in mechanical engineering",
          "Solving linear regression coefficients analytically via normal equations",
        ],
      },
      partB: {
        title: "Solving Linear Systems with np.linalg",
        concept: "Using np.linalg.solve, det(), inv(), and computing vector norm()",
        code: `import numpy as np

# System:
# 3x + y = 9
# x + 2y = 8
A = np.array([[3, 1], [1, 2]])
b = np.array([9, 8])

# Solve for [x, y]
solution = np.linalg.solve(A, b)
print("Solution [x, y]:", solution)
print("Determinant of A:", np.round(np.linalg.det(A), 2))

# Determinant of Identity Matrix np.eye(4) is always 1.0!
print("det(np.eye(4)):", np.linalg.det(np.eye(4)))`,
        output: `Solution [x, y]: [2. 3.]
Determinant of A: 5.0
det(np.eye(4)): 1.0`,
        breakdown: "• 'np.linalg.solve(A, b)' computes exact solution vector x for Ax = b.\n• 'np.linalg.det(np.eye(4))' evaluates to 1.0.\n• When determinant is 0, the matrix is singular and has no inverse.\n• 'np.linalg.norm(np.array([3, 4]))' calculates Euclidean length: 5.0.",
      },
    },
    miniPractice: {
      question: 'Which submodule in NumPy provides matrix determinants, inversions, and eigenvalue solvers?',
      options: ['np.linalg', 'np.matrix', 'np.algebra', 'np.math.linear'],
      correctIndex: 0,
      explanation: '`np.linalg` is the dedicated linear algebra package in NumPy.',
    },
    monster: {
      name: 'Eigen Sovereign MALAKOR Vanguard',
      archetype: 'High Linear Overlord',
      hp: 190,
      maxHp: 190,
      attack: 38,
      introDialogue: [
        'Bow before the eigenvalues of destruction! Can your linear equations solve my defense?',
      ],
      defeatDialogue: 'My determinant collapsed to zero...',
      color: '#dc2626',
      spriteType: 'elite_demon',
      aiProfile: {
        movementSpeed: 190,
        reactionDelay: 0.28,
        attackFrequency: 1.9,
        dodgeChance: 0.35,
        predictionStrength: 0.35,
        aggression: 0.8,
        preferredDistance: 130,
        personality: 'elite_tactician',
      },
    },
    questionIds: ['q_linalg_01', 'q_linalg_02', 'q_linalg_03', 'q_linalg_04', 'q_linalg_05'],
    rewardXp: 620,
  },

  // =========================================================================
  // WORLD 10 — REAL DATA HANDLING (LEVELS 34 - 36)
  // =========================================================================

  // LEVEL 34: NAN
  {
    id: 34,
    worldId: 10,
    worldTitle: 'World 10: Real Data Handling',
    title: 'The Void Cavern: NaN Handling',
    subtitle: 'np.nan, np.isnan(), np.nanmean(), np.nanmax(), np.nanmin()',
    topic: 'nan_handling',
    masteryCategory: 'NaN & Missing Data',
    levelType: 'exploration',
    environment: {
      name: 'Cavern of Missing Signals',
      type: 'caves',
      skyColor: '#09090b',
      groundColor: '#1e293b',
      accentColor: '#fb7185',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In real-world data science, datasets are rarely clean and complete.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Sensors drop signals, producing `NaN` (Not a Number). Standard math functions propagate NaN into everything they touch!',
        expression: 'serious',
      },
    ],
    theory: {
      partA: {
        title: "The Nature of NaN (Not a Number)",
        concept: "Missing values: np.nan, 0.0/0.0, isnan(), and NaN-safe functions (nanmean, nansum)",
        simpleAnalogy: "Imagine an electronic weather sensor that temporarily loses signal during a thunderstorm: the recorded temperature isn't 0 degrees (which would be freezing) — it is an empty blank spot called NaN (Not a Number). Normal math fails on blanks, but NaN-safe tools ignore them cleanly.",
        explanation: "• np.nan represents missing, undefined, or unrecorded numerical data (floating point type).\n• In floating point math, 0.0 / 0.0 evaluates to nan.\n• Contamination: Standard aggregations return nan if ANY element is nan (e.g. np.mean([10, 20, np.nan]) -> nan).\n• NaN-safe functions: np.nanmean(), np.nansum(), np.nanmax(), np.nanmin() ignore NaNs and aggregate only valid numbers.\n• np.isnan(arr): Returns a boolean mask marking True where NaNs exist.",
        whyUseIt: "Prevents data pipelines from crashing or returning corrupted results when sensor readings drop.",
        useCases: [
          "Calculating average weather temperatures despite intermittent station sensor dropouts",
          "Handling survey responses where optional questions were left blank",
          "Preprocessing medical patient data with missing laboratory tests",
        ],
      },
      partB: {
        title: "Handling NaN and Utilizing NaN-Safe Functions",
        concept: "Contrasting standard vs nan-safe functions (nanmean, nansum) and detecting isnan",
        code: `import numpy as np

readings = np.array([24.5, 26.0, np.nan, 25.5])

# Standard mean propagates NaN!
print("Standard mean():", np.mean(readings))

# nanmean safely ignores the NaN!
print("nanmean():", np.nanmean(readings))
print("nanmax():", np.nanmax(readings))`,
        output: `Standard mean(): nan
nanmean(): 25.333333333333332
nanmax(): 26.0`,
        breakdown: "• 'np.mean([10, 20, np.nan])' is contaminated and evaluates to nan.\n• 'np.nanmean([10, 20, np.nan])' ignores the missing value and calculates (10+20)/2 = 15.0.\n• 'np.nansum([5, np.nan, 15])' evaluates to 20.0.\n• '0.0 / 0.0' yields nan; 'np.isnan([1.0, np.nan, 3.0])' yields [False, True, False].",
      },
    },
    miniPractice: {
      question: 'What does np.nanmean(np.array([10, 20, np.nan])) evaluate to?',
      options: ['15.0', 'nan', '10.0', '30.0'],
      correctIndex: 0,
      explanation: '`np.nanmean` ignores the NaN and computes (10 + 20) / 2 = 15.0.',
    },
    monster: {
      name: 'Corrupted Signal Specter',
      archetype: 'Signal Corruption Phantom',
      hp: 185,
      maxHp: 185,
      attack: 38,
      introDialogue: [
        'I corrupt your data streams with NaN! Can your statistics survive my missing signals?',
      ],
      defeatDialogue: 'My corruption... ignored by your nan-safe calculations...',
      color: '#fb7185',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 195,
        reactionDelay: 0.28,
        attackFrequency: 2.0,
        dodgeChance: 0.35,
        predictionStrength: 0.3,
        aggression: 0.7,
        preferredDistance: 140,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_nan_01', 'q_nan_02', 'q_nan_03', 'q_nan_04', 'q_nan_05'],
    rewardXp: 630,
  },

  // LEVEL 35: MISSING DATA CLEANING
  {
    id: 35,
    worldId: 10,
    worldTitle: 'World 10: Real Data Handling',
    title: 'The Restoration Sanctum: Missing Data',
    subtitle: 'np.isnan() Detection, Imputation & Masking',
    topic: 'missing_data',
    masteryCategory: 'NaN & Missing Data',
    levelType: 'exploration',
    environment: {
      name: 'Sanctum of Data Restoration',
      type: 'village',
      skyColor: '#0f172a',
      groundColor: '#334155',
      accentColor: '#34d399',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In this restoration sanctum, broken data fragments are repaired.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Remember: `np.nan == np.nan` evaluates to False! Always use `np.isnan(arr)` to detect and replace missing values!',
        expression: 'serious',
      },
    ],
    theory: {
      partA: {
        title: "Detecting and Imputing Missing Values",
        concept: "Missing data handling: IEEE 754 nan!=nan, counting NaNs, and mean imputation",
        simpleAnalogy: "If a mosaic artwork has a few missing tiles, you don't throw away the artwork: you find where the holes are, calculate the average tile color, and patch the missing spots so the mosaic is complete and ready for display.",
        explanation: "• IEEE 754 standard: np.nan is NEVER equal to anything, including itself! (np.nan == np.nan evaluates to FALSE). Always use np.isnan().\n• Counting NaNs: np.isnan(arr).sum() counts how many NaN entries exist in an array.\n• Extracting valid numbers: arr[~np.isnan(arr)] extracts only valid numbers using bitwise NOT (~).\n• In-place zeroing: arr[np.isnan(arr)] = 0 replaces all NaNs with 0.\n• Mean imputation: arr[np.isnan(arr)] = np.nanmean(arr) replaces all NaNs with the average of valid entries.",
        whyUseIt: "Restores incomplete datasets into clean, fully-populated arrays required by machine learning algorithms.",
        useCases: [
          "Imputing missing patient biometrics with demographic cohort averages",
          "Replacing dropped audio transmission frames with interpolated signal averages",
          "Counting missing values across database columns for quality reports",
        ],
      },
      partB: {
        title: "Detecting and Imputing Missing Data",
        concept: "IEEE 754 equality rules, counting NaNs with .sum(), and mean imputation",
        code: `import numpy as np

data = np.array([10.0, 20.0, np.nan, 40.0])

# 1. Compute safe median of valid values
safe_median = np.nanmedian(data)

# 2. Impute missing values in-place
data[np.isnan(data)] = safe_median
print("Imputed clean dataset:", data)`,
        output: `Imputed clean dataset: [10. 20. 20. 40.]`,
        breakdown: "• 'np.nan == np.nan' is always False by IEEE 754 specification.\n• 'np.isnan(arr).sum()' counts the total number of missing entries.\n• 'arr[~np.isnan(arr)]' extracts all non-NaN values.\n• 'arr[np.isnan(arr)] = np.nanmean(arr)' imputes missing entries with the valid sample mean.",
      },
    },
    miniPractice: {
      question: 'Why does np.nan == np.nan evaluate to False?',
      options: [
        'By IEEE 754 standard, NaN is never equal to anything, including itself',
        'It is a bug in NumPy',
        'Because np.nan is a string',
        'It evaluates to True',
      ],
      correctIndex: 0,
      explanation: 'Under IEEE 754 floating point standard, `NaN != NaN`. Therefore, you must use `np.isnan(arr)`.',
    },
    monster: {
      name: 'Corrupted Golem Vanguard',
      archetype: 'Corrupted Monolith Fiend',
      hp: 185,
      maxHp: 185,
      attack: 38,
      introDialogue: [
        'My armor is riddled with missing voids! Can your imputation clean my assault?',
      ],
      defeatDialogue: 'My missing fragments... imputed and sealed...',
      color: '#34d399',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 175,
        reactionDelay: 0.3,
        attackFrequency: 2.0,
        dodgeChance: 0.25,
        predictionStrength: 0.3,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_miss_01', 'q_miss_02', 'q_miss_03', 'q_miss_04', 'q_miss_05'],
    rewardXp: 640,
  },

  // LEVEL 36: REAL DATASET PROCESSING
  {
    id: 36,
    worldId: 10,
    worldTitle: 'World 10: Real Data Handling',
    title: 'The Observation Observatory: Real Datasets',
    subtitle: 'Student Analytics, Weather Sensors & Sales Revenue Metrics',
    topic: 'real_datasets',
    masteryCategory: 'Real Dataset Processing',
    levelType: 'exploration',
    environment: {
      name: 'Observatory of Reality',
      type: 'village',
      skyColor: '#0c4a6e',
      groundColor: '#075985',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Look through the great telescope at the real world below.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Student grade analytics, weather sensor stations, sports statistics, and sales revenue—you now hold the power to process them all with NumPy!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "End-to-End Real World Data Processing",
        concept: "Real datasets: Z-score normalization, Min-Max scaling, percentiles, and sample counts",
        simpleAnalogy: "Raw sensor data from the real world comes with varying units and ranges: temperature might be 20 to 30 degrees, while atmospheric pressure is 100,000 Pascals! Standardizing features puts all measurements onto a fair, uniform scale so models don't get misled by raw numbers.",
        explanation: "• Number of samples: For an (N, D) dataset matrix, dataset.shape[0] gives the sample count (rows).\n• Z-score standardization: Scales data to mean 0 and std 1: (x - x.mean()) / x.std().\n• Min-Max scaling: Compresses values into the interval [0, 1]: (x - x.min()) / (x.max() - x.min()).\n• np.percentile(readings, p): Calculates the p-th percentile threshold (e.g. 95th percentile marks top 5% extreme readings).\n• np.nanmax(temps): Finds maximum value while safely ignoring missing sensor data.",
        whyUseIt: "Prepares raw telemetry and tabular data for machine learning algorithms that require normalized features.",
        useCases: [
          "Standardizing patient blood pressure and heart rate features before logistic regression",
          "Scaling image pixel values from [0, 255] to [0, 1] for convolutional neural nets",
          "Detecting 99th percentile server response latency spikes in cloud infrastructure",
        ],
      },
      partB: {
        title: "End-to-End Dataset Feature Scaling and Percentiles",
        concept: "Implementing Z-score, Min-Max scaling, np.percentile, and sample count inspection",
        code: `import numpy as np

# Columns: [Station_ID, Temp_C, Humidity_%, Rainfall_mm]
data = np.array([
  [1, 28.5, 65.0, 0.0],
  [2, 32.1, 70.0, 12.5],
  [3, np.nan, 80.0, 5.0],
  [4, 29.4, 60.0, 0.0]
])

print("Number of samples (rows):", data.shape[0])
print("Number of features (columns):", data.shape[1])

# Extract temperature column and compute nan-safe max
temps = data[:, 1]
max_temp = np.nanmax(temps)
print("Peak Temperature Recorded:", max_temp)`,
        output: `Number of samples (rows): 4
Number of features (columns): 4
Peak Temperature Recorded: 32.1`,
        breakdown: "• 'dataset.shape[0]' returns the row count (number of samples N).\n• '(x - x.mean()) / x.std()' scales features to zero-mean unit-variance.\n• '(x - x.min()) / (x.max() - x.min())' normalizes values into the [0, 1] range.\n• 'np.percentile(readings, 95)' computes the 95th percentile threshold.",
      },
    },
    miniPractice: {
      question: 'How do you extract column index 2 across all rows in a dataset matrix?',
      options: ['data[:, 2]', 'data[2, :]', 'data[2]', 'data[:, :]'],
      correctIndex: 0,
      explanation: '`data[:, 2]` selects all rows (`:`) and column index `2`.',
    },
    monster: {
      name: 'Observatory Data Leviathan',
      archetype: 'Titan of Real Datasets',
      hp: 190,
      maxHp: 190,
      attack: 38,
      introDialogue: [
        'I embody the chaotic torrents of real-world information! Can your data pipelines tame my storm?',
      ],
      defeatDialogue: 'My chaotic torrent... structured into clean arrays...',
      color: '#38bdf8',
      spriteType: 'elite_demon',
      aiProfile: {
        movementSpeed: 190,
        reactionDelay: 0.28,
        attackFrequency: 1.9,
        dodgeChance: 0.35,
        predictionStrength: 0.35,
        aggression: 0.8,
        preferredDistance: 140,
        personality: 'elite_tactician',
      },
    },
    questionIds: ['q_dataset_01', 'q_dataset_02', 'q_dataset_03', 'q_dataset_04', 'q_dataset_05'],
    rewardXp: 660,
  },

  // =========================================================================
  // WORLD 11 — NUMPY PERFORMANCE (LEVELS 37 - 38)
  // =========================================================================

  // LEVEL 37: VECTORIZATION
  {
    id: 37,
    worldId: 11,
    worldTitle: 'World 11: NumPy Performance',
    title: 'The Warp Engine: Vectorization',
    subtitle: 'Why C Loops & SIMD Instructions Crush Python For-Loops',
    topic: 'performance',
    masteryCategory: 'Vectorization & Performance',
    levelType: 'exploration',
    environment: {
      name: 'Warp Engine Accelerator',
      type: 'fortress',
      skyColor: '#030712',
      groundColor: '#1e1b4b',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Step into the Warp Accelerator! Here we examine why NumPy achieves near C-level speeds.',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'Python for-loops must check types and look up methods on every single iteration. NumPy executes compiled C loops with hardware SIMD vector registers!',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "The Power of Vectorization",
        concept: "Performance mechanics: Vectorization, SIMD registers, pre-compiled C loops, and np.vectorize()",
        simpleAnalogy: "A Python for-loop is like an inspector who opens every box, inspects the paperwork, checks the serial number, and stamps it one by one. Vectorization is like a massive hydraulic stamping press that stamps 100,000 boxes simultaneously in a single mechanical stroke.",
        explanation: "• Python for-loops incur severe overhead: dynamic type checking, object boxing/unboxing, and interpreter dispatch on every single iteration.\n• Vectorization shifts loops into pre-compiled C routines that execute at hardware speed.\n• SIMD (Single Instruction Multiple Data): Modern CPU registers process 4, 8, or 16 numbers in a single clock cycle.\n• np.arange(1000000) + 1 runs 10x to 50x faster than list comprehension [x + 1 for x in range(1000000)].\n• np.vectorize(func): Helper that converts a Python scalar function into an array-capable ufunc interface.",
        whyUseIt: "Unlocks the full mathematical speed of modern multi-core CPU hardware without writing C extensions.",
        useCases: [
          "Physics particle engines updating 100,000 particle positions per frame",
          "High-frequency algorithmic trading systems processing real-time market order books",
          "Real-time audio synthesis and spatial audio filtering",
        ],
      },
      partB: {
        title: "Benchmarking Vectorization Against Python Loops",
        concept: "SIMD hardware acceleration, loop overhead elimination, and np.vectorize()",
        code: `import numpy as np

arr = np.arange(1_000_000)

# Vectorized: executes instantly via SIMD C-loop
result = arr * 2
print("Calculated 1,000,000 numbers instantly! First 3:", result[:3])`,
        output: `Calculated 1,000,000 numbers instantly! First 3: [0 2 4]`,
        breakdown: "• Vectorization delegates execution to pre-compiled C loops with hardware SIMD registers.\n• 'np.arange(1000000) + 1' executes 10x-50x faster than Python list comprehensions.\n• Python loops slow down due to interpreter type checking and boxing/unboxing.\n• 'np.vectorize(func)' wraps scalar logic into a convenient vectorized function.",
      },
    },
    miniPractice: {
      question: 'Why is vectorization faster than an equivalent Python for-loop?',
      options: [
        'It pushes execution into pre-compiled C loops and leverages CPU SIMD registers',
        'It creates multiple threads automatically in the cloud',
        'It skips floating-point division',
        'It compresses memory into zip files',
      ],
      correctIndex: 0,
      explanation: 'Pre-compiled C loops with SIMD hardware parallelism eliminate Python bytecode interpreter overhead.',
    },
    monster: {
      name: 'SIMD Acceleration Fiend',
      archetype: 'Supersonic Vector Fiend',
      hp: 190,
      maxHp: 190,
      attack: 40,
      introDialogue: [
        'My velocity accelerates beyond standard interpreter loops! Can your reaction time match SIMD speeds?',
      ],
      defeatDialogue: 'Overclocked... by your vectorized precision...',
      color: '#38bdf8',
      spriteType: 'shadow_demon',
      aiProfile: {
        movementSpeed: 215,
        reactionDelay: 0.22,
        attackFrequency: 1.8,
        dodgeChance: 0.45,
        predictionStrength: 0.4,
        aggression: 0.8,
        preferredDistance: 130,
        personality: 'elusive_shadow',
      },
    },
    questionIds: ['q_vec_01', 'q_vec_02', 'q_vec_03', 'q_vec_04', 'q_vec_05'],
    rewardXp: 680,
  },

  // LEVEL 38: PYTHON LISTS VS NUMPY
  {
    id: 38,
    worldId: 11,
    worldTitle: 'World 11: NumPy Performance',
    title: 'The Memory Vaults: Lists vs NumPy',
    subtitle: 'Pointer Overhead, Contiguous RAM & Cache Locality',
    topic: 'performance',
    masteryCategory: 'Vectorization & Performance',
    levelType: 'exploration',
    environment: {
      name: 'Memory Vaults of Silicon',
      type: 'caves',
      skyColor: '#09090b',
      groundColor: '#172554',
      accentColor: '#60a5fa',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Look at how silicon memory is laid out in these vaults.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: 'Standard Python lists store scattered pointers across the RAM heap. NumPy stores raw numbers side-by-side in contiguous blocks, maximizing CPU L1/L2 cache hits!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Memory Architecture: Lists vs ndarrays",
        concept: "Memory architecture: Pointer indirection vs contiguous raw bytes, itemsize, and cache locality",
        simpleAnalogy: "A Python list of integers is like a Rolodex of street addresses: to read a number, the CPU must travel to that address in RAM, which causes constant memory delays. A NumPy array is an egg carton: all numbers sit contiguous side-by-side, so the CPU loads the entire carton into its ultra-fast L1 cache in a single fetch!",
        explanation: "• Python lists store memory POINTERS to heap integer objects; NumPy stores contiguous raw numbers without pointer indirection.\n• A float64 element consumes exactly 8 bytes of raw memory (64 bits / 8).\n• CPU Cache Locality: Contiguous memory blocks load into ultra-fast L1/L2 CPU cache lines, eliminating memory cache misses.\n• arr.itemsize: Returns the memory footprint of 1 element in bytes (e.g. 8 for float64).\n• arr.nbytes: Returns total memory consumed by all elements (size * itemsize).",
        whyUseIt: "Slashes application RAM usage by up to 80% and maximizes CPU throughput via cache line saturation.",
        useCases: [
          "Optimizing mobile applications to prevent operating system out-of-memory kills",
          "Running machine learning inference on resource-constrained embedded edge devices",
          "High-performance computing clusters processing multi-terabyte scientific arrays",
        ],
      },
      partB: {
        title: "Contrasting Memory Footprints and Cache Locality",
        concept: "Pointer overhead vs contiguous raw bytes, itemsize, and nbytes calculations",
        code: `import numpy as np

# NumPy contiguous array: int64 has itemsize = 8 bytes
arr = np.arange(1000, dtype=np.int64)
print("Bytes per element (itemsize):", arr.itemsize) # 8 bytes
print("Total elements (size):", arr.size) # 1000
print("Total bytes (nbytes = size * itemsize):", arr.nbytes) # 8,000 bytes!`,
        output: `Bytes per element (itemsize): 8
Total elements (size): 1000
Total bytes (nbytes = size * itemsize): 8000`,
        breakdown: "• Python lists store heap pointers with heavy object header overhead.\n• NumPy stores raw contiguous bytes, loading into CPU L1/L2 cache lines with zero pointer indirection.\n• Each float64 consumes 8 bytes; int32 consumes 4 bytes.\n• 'arr.itemsize' reports bytes per element; 'arr.nbytes' reports total allocated memory.",
      },
    },
    miniPractice: {
      question: 'What is the primary memory difference between Python lists and NumPy arrays?',
      options: [
        'Python lists store pointers to heap integer objects; NumPy stores contiguous raw 8-byte numbers',
        'Python lists are compressed; NumPy is uncompressed',
        'NumPy arrays are stored on disk; Python lists in RAM',
        'There is no memory difference',
      ],
      correctIndex: 0,
      explanation: 'Python lists suffer from pointer indirection and object headers; NumPy packs raw bytes contiguously.',
    },
    monster: {
      name: 'Cache Memory Overlord',
      archetype: 'Silicon Core Titan',
      hp: 190,
      maxHp: 190,
      attack: 40,
      introDialogue: [
        'Cache misses cannot breach my core! Prove you understand silicon memory!',
      ],
      defeatDialogue: 'My cache lines... invalidated...',
      color: '#60a5fa',
      spriteType: 'armored_demon',
      aiProfile: {
        movementSpeed: 180,
        reactionDelay: 0.28,
        attackFrequency: 1.9,
        dodgeChance: 0.3,
        predictionStrength: 0.35,
        aggression: 0.75,
        preferredDistance: 130,
        personality: 'stalwart_armored',
      },
    },
    questionIds: ['q_perf_01', 'q_perf_02', 'q_perf_03', 'q_perf_04', 'q_perf_05'],
    rewardXp: 700,
  },

  // =========================================================================
  // WORLD 12 — ADVANCED NUMPY & FINAL MASTERY (LEVELS 39 - 42)
  // =========================================================================

  // LEVEL 39: ADVANCED & FANCY INDEXING
  {
    id: 39,
    worldId: 12,
    worldTitle: 'World 12: Advanced NumPy',
    title: 'The Dimensional Spires: Fancy Indexing',
    subtitle: 'Integer Array Indexing & Multi-Axis Extraction',
    topic: 'advanced',
    masteryCategory: 'Advanced NumPy',
    levelType: 'exploration',
    environment: {
      name: 'Dimensional Spires of Transcendence',
      type: 'celestial',
      skyColor: '#030712',
      groundColor: '#312e81',
      accentColor: '#a855f7',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Welcome to World 12: The pinnacle of the NumPy Kingdom!',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'Fancy Indexing allows passing lists or arrays of integer coordinates to extract arbitrary subsets in any order!',
        expression: 'normal',
      },
    ],
    theory: {
      partA: {
        title: "Fancy Integer Array Indexing",
        concept: "Fancy indexing: Integer array indexing, multi-axis selection, and copy allocation",
        simpleAnalogy: "Basic slicing is like reading a contiguous chapter of a book (pages 10 to 20). Fancy indexing is having an index card with non-consecutive page numbers [42, 7, 19]: you jump directly to those specific pages and photocopy them into a brand-new booklet!",
        explanation: "• Passing an array or list of integer indices arr[[0, 2]] extracts elements from those exact positions in that order.\n• CRITICAL DIFFERENCE: Basic slicing returns a VIEW; fancy indexing ALWAYS allocates and returns a NEW COPY!\n• Multi-axis fancy indexing: For matrix [[10, 20], [30, 40]], matrix[[0, 1], [1, 0]] pairs row 0 with col 1 (20) and row 1 with col 0 (30), returning [20, 30].\n• In-place modification: arr[[1, 3]] = 0 updates elements at indices 1 and 3 simultaneously in-place.\n• Indices can be repeated (e.g. arr[[0, 0, 1]] duplicates the first element twice).",
        whyUseIt: "Extracts non-contiguous coordinates and reorders datasets arbitrarily in a single vectorized step.",
        useCases: [
          "Shuffling rows according to custom permutation indices",
          "Extracting specific landmark coordinates in computer vision facial tracking",
          "Selecting specific non-consecutive sensor channels for time-series analysis",
        ],
      },
      partB: {
        title: "Extracting Non-Contiguous Data with Fancy Indexing",
        concept: "Integer array indexing, pairwise 2D coordinates, copy behavior, and in-place updates",
        code: `import numpy as np

arr = np.array([10, 20, 30, 40, 50])

# Extract elements at indices 4, 0, 2 in that exact order!
subset = arr[[4, 0, 2]]
print("Extracted subset:", subset)

# Modifying subset does NOT mutate arr (it is a copy!)
subset[0] = 999
print("Original untouched:", arr[4])`,
        output: `Extracted subset: [50 10 30]
Original untouched: 50`,
        breakdown: "• 'arr[[0, 2]]' on [10, 20, 30, 40] extracts [10, 30].\n• Fancy indexing ALWAYS allocates and returns a new copy, never a shared memory view.\n• 'matrix[[0, 1], [1, 0]]' extracts coordinates (0, 1) and (1, 0), returning [20, 30].\n• 'arr[[1, 3]] = 0' modifies the specified indices in-place.",
      },
    },
    miniPractice: {
      question: 'Does fancy integer indexing with an array of indices return a view or a copy?',
      options: ['Always a copy', 'Always a view', 'A view if elements are adjacent', 'Depends on dtype'],
      correctIndex: 0,
      explanation: 'Unlike basic slicing which returns views, fancy indexing always creates and returns a copy.',
    },
    monster: {
      name: 'Spire Arch-Sorcerer',
      archetype: 'Transcendent Spellcaster',
      hp: 195,
      maxHp: 195,
      attack: 42,
      introDialogue: [
        'I pluck coordinates from across time and space! Can your fancy indexing target my reality?',
      ],
      defeatDialogue: 'My coordinates... targeted and shattered...',
      color: '#a855f7',
      spriteType: 'fire_demon',
      aiProfile: {
        movementSpeed: 195,
        reactionDelay: 0.25,
        attackFrequency: 1.8,
        dodgeChance: 0.4,
        predictionStrength: 0.4,
        aggression: 0.8,
        preferredDistance: 150,
        personality: 'fire_sorcerer',
      },
    },
    questionIds: ['q_advidx_01', 'q_advidx_02', 'q_advidx_03', 'q_advidx_04', 'q_advidx_05'],
    rewardXp: 750,
  },

  // LEVEL 40: DIMENSION MANIPULATION (newaxis & expand_dims)
  {
    id: 40,
    worldId: 12,
    worldTitle: 'World 12: Advanced NumPy',
    title: 'The Cosmic Nexus: Dimension Expansion',
    subtitle: 'np.newaxis, np.expand_dims() & np.swapaxes()',
    topic: 'advanced',
    masteryCategory: 'Advanced NumPy',
    levelType: 'exploration',
    environment: {
      name: 'Cosmic Nexus of Axes',
      type: 'celestial',
      skyColor: '#020617',
      groundColor: '#1e1b4b',
      accentColor: '#38bdf8',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'In the Cosmic Nexus, new dimensions are created from pure space.',
        expression: 'normal',
      },
      {
        speaker: 'Aria',
        text: '`np.newaxis` and `np.expand_dims()` add length-1 dimensions to make arrays compatible for broadcasting!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "Inserting Axes for Broadcasting Compatibility",
        concept: "Dimension expansion: np.newaxis, np.expand_dims(), atleast_2d(), and atleast_3d()",
        simpleAnalogy: "Imagine a 1D strip of 3 numbers. To multiply it against a 2D matrix, you need to declare whether it stands vertically as a column or lays flat as a row. Dimension expansion inserts that missing axis of orientation without duplicating any data.",
        explanation: "• arr[:, np.newaxis]: Inserts a new dimension of size 1, transforming a 1D array of shape (5,) into a 2D column vector of shape (5, 1).\n• arr[np.newaxis, :]: Transforms shape (5,) into a 2D row vector of shape (1, 5).\n• np.expand_dims(arr, axis=0): Inserts a singleton axis at position 0 (e.g. shape (3, 4) becomes (1, 3, 4)).\n• np.expand_dims(arr, axis=-1): Inserts a trailing dimension (e.g. shape (5, 6) becomes (5, 6, 1)).\n• np.atleast_2d(arr): Guarantees array has at least 2 dimensions (shape (3,) becomes (1, 3)).\n• np.atleast_3d(arr): Guarantees array has at least 3 dimensions (shape (2,) becomes (1, 2, 1)).",
        whyUseIt: "Prepares tensors with required batch and channel dimensions for neural network architectures.",
        useCases: [
          "Adding batch and channel dimensions to single images before feeding to PyTorch/TensorFlow (1, 1, 28, 28)",
          "Aligning 1D vectors for outer-product matrix broadcasting",
          "Formatting arrays for matrix multiplication pipelines",
        ],
      },
      partB: {
        title: "Inserting Singleton Dimensions for Tensor Compatibility",
        concept: "Using np.newaxis, np.expand_dims(), atleast_2d(), and atleast_3d()",
        code: `import numpy as np

arr = np.zeros((3, 4)) # size: 12
print("expand_dims axis=0 shape:", np.expand_dims(arr, axis=0).shape) # (1, 3, 4)

arr2 = np.zeros((5, 6))
print("expand_dims axis=-1 shape:", np.expand_dims(arr2, axis=-1).shape) # (5, 6, 1)

# atleast_3d on 1D vector:
v = np.array([1, 2])
print("atleast_3d shape:", np.atleast_3d(v).shape) # (1, 2, 1)`,
        output: `expand_dims axis=0 shape: (1, 3, 4)
expand_dims axis=-1 shape: (5, 6, 1)
atleast_3d shape: (1, 2, 1)`,
        breakdown: "• 'arr[:, np.newaxis]' transforms shape (5,) into column vector (5, 1).\n• 'np.expand_dims(arr, axis=0)' turns shape (3, 4) into (1, 3, 4).\n• 'np.expand_dims(arr, axis=-1)' on shape (5, 6) turns into (5, 6, 1).\n• 'np.atleast_2d([1, 2, 3]).shape' returns (1, 3); 'np.atleast_3d([1, 2]).shape' returns (1, 2, 1).",
      },
    },
    miniPractice: {
      question: 'What is the shape of np.expand_dims(arr, axis=0) when arr has shape (4, 5)?',
      options: ['(1, 4, 5)', '(4, 1, 5)', '(4, 5, 1)', '(5, 4)'],
      correctIndex: 0,
      explanation: '`axis=0` inserts the new length-1 dimension at index 0, producing `(1, 4, 5)`.',
    },
    monster: {
      name: 'Cosmic Nexus Sovereign',
      archetype: 'Transcendent Dimensional Entity',
      hp: 195,
      maxHp: 195,
      attack: 42,
      introDialogue: [
        'I expand dimensions into infinity! Can your mind navigate new axes?',
      ],
      defeatDialogue: 'My new axes... collapsed into the void...',
      color: '#38bdf8',
      spriteType: 'elite_demon',
      aiProfile: {
        movementSpeed: 195,
        reactionDelay: 0.25,
        attackFrequency: 1.8,
        dodgeChance: 0.35,
        predictionStrength: 0.4,
        aggression: 0.8,
        preferredDistance: 140,
        personality: 'elite_tactician',
      },
    },
    questionIds: ['q_dim_01', 'q_dim_02', 'q_dim_03', 'q_dim_04', 'q_dim_05'],
    rewardXp: 800,
  },

  // LEVEL 41: NUMERICAL ALGORITHMS (clip, unique, cumsum)
  {
    id: 41,
    worldId: 12,
    worldTitle: 'World 12: Advanced NumPy',
    title: 'The Algorithm Core: Numerical Utilities',
    subtitle: 'np.clip(), np.unique(), np.cumsum() & np.diff()',
    topic: 'advanced',
    masteryCategory: 'Advanced NumPy',
    levelType: 'exploration',
    environment: {
      name: 'Algorithm Core of the Sovereigns',
      type: 'celestial',
      skyColor: '#09090b',
      groundColor: '#450a0a',
      accentColor: '#f59e0b',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'We are steps away from the Final NumPy Guardian!',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'Master these advanced numerical algorithms: `np.clip()` to clamp values, `np.unique()` to extract sorted sets, and `np.cumsum()` for cumulative trends!',
        expression: 'serious',
      },
    ],
    theory: {
      partA: {
        title: "Essential Mathematical Utilities",
        concept: "Numerical utilities: np.clip, np.unique, np.cumsum, np.diff, and np.interp",
        simpleAnalogy: "Numerical utilities are the precision Swiss Army Knife 🇨🇭 of NumPy: you can trim extreme values (clip), discover unique items (unique), track a running score accumulator (cumsum), measure step-by-step changes (diff), and estimate values between points (interp).",
        explanation: "• np.clip(arr, min_val, max_val): Clamps values outside the interval to the boundary limits (e.g. clip([2, 7, 15], 5, 10) -> [5, 7, 10]).\n• np.unique(arr): Returns sorted unique elements with duplicates removed (e.g. unique([3, 1, 2, 3, 1]) -> [1, 2, 3]).\n• np.cumsum(arr): Calculates cumulative running sum: [1, 2, 3, 4] -> [1, 3, 6, 10].\n• np.diff(arr): Computes differences between adjacent elements: diff([1, 3, 7, 10]) -> [2, 4, 3].\n• np.interp(x, xp, fp): Performs 1D linear interpolation; np.interp(2.5, [1, 3], [10, 30]) evaluates to 25.0.",
        whyUseIt: "Replaces dozens of lines of manual algorithmic loops with optimized, single-line C-speed operations.",
        useCases: [
          "Audio and video signal clipping to prevent digital audio distortion and blown highlights",
          "Finding unique categorical class IDs in survey and machine learning datasets",
          "Interpolating missing sensor telemetry points between known GPS fixes",
        ],
      },
      partB: {
        title: "Essential Algorithmic Utilities in Action",
        concept: "Clamping with clip(), extracting unique sets, cumulative sum, diff(), and interpolation",
        code: `import numpy as np

# 1. Clamping outliers with clip
vals = np.array([2, 8, 15, -3])
print("Clipped [0, 10]:", np.clip(vals, 0, 10))

# 2. Extract unique sorted classes
labels = np.array([3, 1, 2, 3, 1])
print("Unique classes:", np.unique(labels))

# 3. Cumulative sum of returns
steps = np.array([1, 2, 3, 4])
print("Cumulative sum:", np.cumsum(steps))`,
        output: `Clipped [0, 10]: [ 2  8 10  0]
Unique classes: [1 2 3]
Cumulative sum: [ 1  3  6 10]`,
        breakdown: "• 'np.clip([2, 7, 15], 5, 10)' clamps out-of-bounds numbers to boundaries: [5, 7, 10].\n• 'np.unique([3, 1, 2, 3, 1])' returns sorted unique values: [1, 2, 3].\n• 'np.cumsum([1, 2, 3, 4])' calculates running totals: [1, 3, 6, 10].\n• 'np.diff([1, 3, 7, 10])' yields consecutive differences: [2, 4, 3].\n• 'np.interp(2.5, [1, 3], [10, 30])' linearly interpolates to 25.0.",
      },
    },
    miniPractice: {
      question: 'What does np.clip(np.array([4, 12, -2]), 0, 10) return?',
      options: ['[ 4 10  0]', '[ 4 12 -2]', '[ 0 10  0]', '[10 10 10]'],
      correctIndex: 0,
      explanation: 'Values below 0 are clamped to 0 (-2 -> 0), and values above 10 are clamped to 10 (12 -> 10): `[4 10 0]`.',
    },
    monster: {
      name: 'Algorithm Arch-Demon',
      archetype: 'Grand Algorithm Fiend',
      hp: 195,
      maxHp: 195,
      attack: 42,
      introDialogue: [
        'My algorithms clamp your life force! Stand before the gate of the Final Guardian!',
      ],
      defeatDialogue: 'My algorithms... cleared for the Guardian...',
      color: '#f59e0b',
      spriteType: 'elite_demon',
      aiProfile: {
        movementSpeed: 195,
        reactionDelay: 0.25,
        attackFrequency: 1.8,
        dodgeChance: 0.4,
        predictionStrength: 0.4,
        aggression: 0.8,
        preferredDistance: 130,
        personality: 'elite_tactician',
      },
    },
    questionIds: ['q_algo_01', 'q_algo_02', 'q_algo_03', 'q_algo_04', 'q_algo_05'],
    rewardXp: 850,
  },

  // LEVEL 42: THE FINAL NUMPY GUARDIAN (CULMINATION BOSS)
  {
    id: 42,
    worldId: 12,
    worldTitle: 'World 12: Advanced NumPy',
    title: 'The Throne of Numerical Transcendence: NUMPY GUARDIAN',
    subtitle: 'The Grand Final Battle: Complete Synthesis of NumPy Zero-to-Hero',
    topic: 'mastery',
    masteryCategory: 'Advanced NumPy',
    levelType: 'boss_phases',
    minions: [
      {
        name: 'Void Guardian Minion',
        hp: 60,
        maxHp: 60,
        attack: 16,
        color: '#ef4444',
        spriteType: 'flying_demon',
        isFlying: true,
      },
    ],
    environment: {
      name: 'Throne of the Final NumPy Guardian',
      type: 'celestial',
      skyColor: '#09090b',
      groundColor: '#450a0a',
      accentColor: '#dc2626',
    },
    ariaIntro: [
      {
        speaker: 'Aria',
        text: 'Traveler... you have arrived at the final summit of our journey.',
        expression: 'serious',
      },
      {
        speaker: 'Aria',
        text: 'Before you stands the Final NumPy Guardian: Malakor in his Transcendent Form.',
        expression: 'excited',
      },
      {
        speaker: 'Aria',
        text: 'This battle tests your complete knowledge from World 1 to World 12: shapes, slicing, broadcasting, axes, linear algebra, and data science pipelines. I believe in you!',
        expression: 'excited',
      },
    ],
    theory: {
      partA: {
        title: "The Pinnacle of NumPy Mastery",
        concept: "Grand synthesis: Reshaping, boolean filtering, broadcasting, dot products, and NaN handling",
        simpleAnalogy: "You stand at the summit of NumPy mastery: like an architect who has mastered every tool from the foundation blueprint to the structural steel and final finishes, you now seamlessly synthesize multidimensional array creation, broadcasting, linear algebra, and data pipelines into a single master workflow.",
        explanation: "• Reshaping & filtering: np.arange(12).reshape(3, 4) followed by grid[grid % 2 == 0].sum() sums all even values (yielding 30).\n• Cross-dimensional broadcasting: Array A (4, 1) and Array B (1, 5) broadcast to shape (4, 5); (A + B).size equals 20.\n• Linear algebra & NaN integration: np.dot([2, 3], [4, 5]) (which is 23) + np.nanmean([10, np.nan, 20]) (which is 15.0) evaluates to 38.0.\n• Normalization architecture: Normalizing an (M, N) matrix requires subtracting a mean vector of shape (N,).\n• Identity & Determinant: np.linalg.det(np.eye(4)) equals 1.0; fancy indexing arr[[0, 2]] extracts [10, 30].",
        whyUseIt: "Demonstrates complete, end-to-end fluency across the entire Python scientific computing stack.",
        useCases: [
          "Architecting state-of-the-art machine learning algorithms and neural network libraries from scratch",
          "Processing terabyte-scale scientific astronomical, climate, and genomic datasets",
          "Designing high-speed quantitative trading and mathematical physics simulations",
        ],
      },
      partB: {
        title: "The Grand Culmination Master Pipeline",
        concept: "Synthesizing multi-dimensional broadcasting, filtering, linear algebra, and NaN handling",
        code: `import numpy as np

# 1. Instantiate, reshape, and filter
grid = np.arange(12).reshape(3, 4)
even_sum = grid[grid % 2 == 0].sum()

# 2. Linear dot product and nan-safe average
dot_res = np.dot([2, 3], [4, 5])
safe_mean = np.nanmean([10, np.nan, 20])

# 3. Broadcasting size and identity matrix determinant
A = np.zeros((4, 1))
B = np.zeros((1, 5))
broadcast_size = (A + B).size # 4 * 5 = 20
eye_det = np.linalg.det(np.eye(4)) # 1.0

print("Even Sum:", even_sum)
print("Dot + NanMean:", dot_res + safe_mean)
print("Broadcast size (4, 1) + (1, 5):", broadcast_size)
print("Identity np.eye(4) determinant:", eye_det)`,
        output: `Even Sum: 30
Dot + NanMean: 38.0
Broadcast size (4, 1) + (1, 5): 20
Identity np.eye(4) determinant: 1.0`,
        breakdown: "• 'grid = np.arange(12).reshape(3, 4)' filtered by 'grid[grid % 2 == 0].sum()' produces 30.\n• Broadcasting (4, 1) with (1, 5) creates 20 elements (4 * 5 = 20).\n• 'np.dot([2, 3], [4, 5])' (23) + 'np.nanmean([10, np.nan, 20])' (15.0) produces 38.0.\n• 'np.linalg.det(np.eye(4))' produces 1.0; 'np.clip([2, 7, 15], 5, 10)' yields [5, 7, 10].",
      },
    },
    miniPractice: {
      question: 'What is the sum of all elements in np.ones((2, 3)) * 5?',
      options: ['30.0', '25.0', '10.0', '15.0'],
      correctIndex: 0,
      explanation: 'A 2x3 array has 6 elements. Each element is 1.0 * 5 = 5.0. 6 * 5.0 = 30.0.',
    },
    monster: {
      name: 'TRANSCENDENT NUMPY GUARDIAN',
      archetype: 'Supreme Demonic Sovereign',
      hp: 350,
      maxHp: 350,
      attack: 45,
      introDialogue: [
        'MORTAL! You have traversed all 12 Worlds of the NumPy Kingdom!',
        'Now face the complete synthesis of numerical reality! Stand before the NUMPY GUARDIAN!',
      ],
      defeatDialogue: 'MAGNIFICENT... You have mastered all dimensions! You are the TRUE NUMPY MASTER!',
      color: '#facc15',
      spriteType: 'guardian_malakor',
      aiProfile: {
        movementSpeed: 215,
        reactionDelay: 0.2,
        attackFrequency: 1.6,
        dodgeChance: 0.45,
        predictionStrength: 0.5,
        aggression: 0.9,
        preferredDistance: 130,
        personality: 'guardian_god',
      },
    },
    questionIds: [
      'q_guardian_01',
      'q_guardian_02',
      'q_guardian_03',
      'q_bcast_boss_01',
      'q_bcast_boss_02',
      'q_bool_02',
      'q_linalg_02',
      'q_nan_02',
      'q_advidx_01',
      'q_algo_01',
    ],
    rewardXp: 2000,
    unlockedSkill: {
      name: 'NumPy Sovereign Mastery',
      description: 'Command all dimensions, arrays, and vectorized operations across the cosmos!',
      icon: 'Crown',
    },
  },
];
