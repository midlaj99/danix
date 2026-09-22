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
        title: 'What is NumPy & Why Does It Exist?',
        concept: 'Contiguous C Arrays & Vectorized SIMD',
        explanation:
          'NumPy (Numerical Python) is the foundational scientific library in Python. Standard Python lists store pointers to individual heap objects, which incurs massive overhead. NumPy provides the ndarray (N-Dimensional Array), which stores homogenous primitive data in contiguous blocks of memory, executing calculations up to 50x faster via C-loops and CPU SIMD vectorization.',
        whyUseIt:
          'Standard Python loops are slow for scientific calculations. NumPy processes millions of numbers instantaneously without writing explicit for-loops.',
        useCases: [
          'Machine Learning & Deep Learning (PyTorch, TensorFlow core foundation)',
          'Data Science & Analytics (Pandas is built directly on NumPy ndarrays)',
          'Computer Vision & Image Processing (OpenCV matrices are NumPy arrays)',
          'High-frequency quantitative trading and physical scientific simulations',
        ],
      },
      partB: {
        title: 'The Universal Convention: import numpy as np',
        concept: 'Module alias and first array creation',
        code: `import numpy as np

# Standard Python list multiplication duplicates the sequence
py_list = [1, 2, 3]
print("Python list * 2:", py_list * 2)

# NumPy array multiplication performs vectorized element-wise math!
np_arr = np.array([1, 2, 3])
print("NumPy array * 2:", np_arr * 2)`,
        output: `Python list * 2: [1, 2, 3, 1, 2, 3]
NumPy array * 2: [2 4 6]`,
        breakdown:
          '1. `import numpy as np` is the universal convention.\n2. `[1, 2, 3] * 2` duplicates a Python list into 6 elements.\n3. `np_arr * 2` multiplies each individual number in-place at native C speed!',
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
        title: 'Building Multi-Dimensional Structures',
        concept: '1D vectors, 2D grids, and 3D tensors',
        explanation:
          'A 1D array represents a single line or list of numbers. A 2D array represents a matrix of rows and columns (like an Excel sheet, chessboard, or grayscale image). A 3D array is a stack of 2D matrices (like a color RGB image with height, width, and color channels).',
        whyUseIt:
          'Real data is multi-dimensional: tabular records, geospatial grids, audio spectrograms, and image pixels.',
        useCases: [
          'Tabular feature data: 2D array (samples, features)',
          'Grayscale image: 2D array (height, width)',
          'Color image: 3D array (height, width, 3 channels)',
          'Video stream: 4D array (frames, height, width, channels)',
        ],
      },
      partB: {
        title: 'Creating 1D, 2D, and 3D Arrays',
        concept: 'np.array() with nested lists',
        code: `import numpy as np

# 1D Vector
v = np.array([10, 20, 30])

# 2D Matrix (2 rows, 3 columns)
m = np.array([[1, 2, 3], [4, 5, 6]])

# 3D Tensor (2 blocks, 2 rows, 2 columns)
t = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
print("1D ndim:", v.ndim, "| 2D ndim:", m.ndim, "| 3D ndim:", t.ndim)`,
        output: `1D ndim: 1 | 2D ndim: 2 | 3D ndim: 3`,
        breakdown:
          '- Count the outer square brackets: `[` is 1D, `[[` is 2D, `[[[` is 3D.\n- Modern NumPy requires rectangular rows; irregular ragged lists raise a ValueError.',
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
        title: 'Inspecting Array Geometry & Memory',
        concept: 'Core inspection attributes',
        explanation:
          'NumPy arrays carry metadata attributes: `arr.ndim` (number of axes), `arr.shape` (tuple containing length of each dimension), `arr.size` (total number of elements), `arr.itemsize` (bytes per individual element), and `arr.nbytes` (total bytes in RAM).',
        whyUseIt:
          'Understanding shapes and sizes is essential before training machine learning models or verifying matrix operations.',
        useCases: [
          'Checking tensor compatibility before neural network layers',
          'Debugging image channel layout (H, W, C) vs (C, H, W)',
          'Estimating RAM usage for massive scientific datasets',
        ],
      },
      partB: {
        title: 'Inspecting Array Attributes in Action',
        concept: 'Shape and memory calculations',
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
        breakdown:
          '- `matrix.shape`: (2, 3) = 2 rows, 3 columns.\n- `matrix.size`: 2 * 3 = 6 elements.\n- `matrix.itemsize`: int32 is 4 bytes.\n- `matrix.nbytes`: 6 elements * 4 bytes = 24 bytes total.',
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
        title: 'Homogeneous Memory Architecture',
        concept: 'Precision control and memory economy',
        explanation:
          'Unlike Python lists which can mix strings, floats, and objects, NumPy arrays enforce a single data type across all elements: int8, int32, int64, float32, float64, uint8, or bool. This strict homogeneity enables zero-pointer overhead and lightning CPU memory caching.',
        whyUseIt:
          'Using the right dtype (such as uint8 for images or float32 for AI weights) saves gigabytes of RAM and boosts processing speed.',
        useCases: [
          'Computer Vision: uint8 (0 to 255 per pixel channel)',
          'Deep Learning inference: float16 or float32 for GPU tensor cores',
          'Boolean masks: bool_ (1 byte per boolean flag)',
        ],
      },
      partB: {
        title: 'Inspecting and Converting Types with astype()',
        concept: 'Type casting without in-place mutation',
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
        breakdown:
          '- `arr.dtype` inspects the element type.\n- `astype(new_type)` creates a new array converted to the requested type.\n- Converting float to int truncates toward zero (1.9 becomes 1).',
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
        title: 'Coordinate Navigation in Arrays',
        concept: '0-based indexing and negative coordinates',
        explanation:
          'NumPy uses 0-based indexing. In multi-dimensional arrays, you access elements directly using comma syntax: `arr[row, col]` instead of the slower chained Python syntax `arr[row][col]`. Negative indices count backward from the end (`arr[-1]` is the last element).',
        whyUseIt:
          'Comma indexing is faster and allows advanced multi-axis selection in a single operation.',
        useCases: [
          'Locating pixel values at coordinate (y, x) in an image',
          'Extracting specific sensor values at index -1 (most recent reading)',
        ],
      },
      partB: {
        title: 'Multi-Axis Indexing Syntax',
        concept: 'arr[row, col] and arr[-1]',
        code: `import numpy as np

matrix = np.array([
  [10, 20, 30],
  [40, 50, 60]
])

print("Row 0, Col 2:", matrix[0, 2])
print("Row 1, Last Col:", matrix[1, -1])

# In-place element mutation
matrix[0, 0] = 99
print("Mutated matrix:\n", matrix)`,
        output: `Row 0, Col 2: 30
Row 1, Last Col: 60
Mutated matrix:
 [[99 20 30]
 [40 50 60]]`,
        breakdown:
          '- `matrix[0, 2]` picks row 0, column 2 (value 30).\n- `matrix[1, -1]` picks row 1, last column (value 60).\n- NumPy arrays are mutable in-place.',
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
        title: 'Slicing Sub-Arrays Without Copying',
        concept: 'start:stop:step and 2D slicing',
        explanation:
          'Slicing extracts contiguous sections of arrays: `arr[start:stop:step]`. In 2D, slice rows and columns simultaneously: `arr[row_slice, col_slice]`. A colon alone `:` means select all elements along that axis. In NumPy, basic slicing creates a view, avoiding memory copies.',
        whyUseIt:
          'Crucial for cropping images, splitting training/test datasets, and extracting feature columns.',
        useCases: [
          'Extracting a column feature: `matrix[:, 0]`',
          'Cropping a region of interest in an image: `image[100:300, 150:400]`',
          'Reversing an array: `arr[::-1]`',
        ],
      },
      partB: {
        title: '2D Slicing Examples',
        concept: 'Row and column slice combinations',
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
        breakdown:
          '- `matrix[:, 1]` selects column 1.\n- `matrix[0:2, 1:3]` extracts a 2x2 sub-block.\n- `matrix[::-1, :]` reverses the order of rows.',
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
        title: 'Dimension Transformation Without Duplication',
        concept: 'Preserving total element size during reshape',
        explanation:
          'An array with 12 elements can be reshaped into (3, 4), (4, 3), (2, 6), (6, 2), (1, 12), or (2, 2, 3). Passing `-1` tells NumPy to automatically calculate that dimension. `flatten()` returns a deep copy, while `ravel()` returns a view.',
        whyUseIt:
          'Essential before feeding tabular data into neural networks or converting flat data streams into 2D matrices.',
        useCases: [
          'Flattening a 28x28 image to a 784-element vector',
          'Unrolling weights and gradients in deep learning',
        ],
      },
      partB: {
        title: 'Using reshape() with the -1 Dimension',
        concept: 'Automatic dimension inference',
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
        breakdown:
          '- Total size is 6. `reshape(2, 3)` creates 2 rows of 3 columns.\n- `reshape(-1, 2)` automatically deduces 3 rows.',
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
        title: 'Pre-Allocating Arrays',
        concept: 'Instant array creation routines',
        explanation:
          'Rather than building arrays manually, NumPy provides optimized allocation routines: `np.zeros(shape)` creates arrays filled with 0.0, `np.ones(shape)` fills with 1.0, `np.full(shape, value)` fills with a constant, and `np.eye(N)` builds an N x N identity matrix with 1s on the diagonal.',
        whyUseIt:
          'Pre-allocating memory prevents dynamic resizing overhead and memory fragmentation in performance loops.',
        useCases: [
          'Initializing weight tensors in neural networks',
          'Creating image mask canvases filled with zeros',
          'Setting up coordinate identity transformation matrices',
        ],
      },
      partB: {
        title: 'Special Creation Functions in Action',
        concept: 'zeros, ones, full, and eye syntax',
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
        breakdown:
          '- `np.zeros` and `np.ones` default to float64 unless `dtype` is given.\n- `np.eye(N)` creates a square diagonal identity matrix.',
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
        title: 'Step-Based vs Sample-Based Sequences',
        concept: 'arange vs linspace',
        explanation:
          '`np.arange(start, stop, step)` generates numbers by taking fixed steps; the stop value is excluded. `np.linspace(start, stop, num)` generates a specified number of samples evenly distributed across the interval; the stop value is INCLUDED by default.',
        whyUseIt:
          'Floating-point steps in arange can suffer from floating-point accumulation errors. linspace guarantees exact sample counts for mathematical plots and simulations.',
        useCases: [
          'Plotting mathematical sine curves: `x = np.linspace(0, 2*np.pi, 100)`',
          'Integer loops and indices: `np.arange(0, 50, 5)`',
        ],
      },
      partB: {
        title: 'Comparing arange and linspace',
        concept: 'Syntax and output differences',
        code: `import numpy as np

# arange: specifies step size (stop is excluded!)
r = np.arange(0, 10, 2)
print("arange(0, 10, 2):", r)

# linspace: specifies sample count (stop is INCLUDED!)
l = np.linspace(0, 1, 5)
print("linspace(0, 1, 5):", l)`,
        output: `arange(0, 10, 2): [0 2 4 6 8]
linspace(0, 1, 5): [0.   0.25 0.5  0.75 1.  ]`,
        breakdown:
          '- `arange(0, 10, 2)` stops before 10.\n- `linspace(0, 1, 5)` divides [0, 1] into 4 equal segments, producing 5 points.',
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
        title: 'Element-Wise Numerical Processing',
        concept: 'Parallel vector arithmetic',
        explanation:
          'When two arrays of matching shape undergo arithmetic, operations happen element-by-element in parallel. `a + b` adds `a[i]` and `b[i]`. `a ** 2` squares every element. Division `/` always returns float values.',
        whyUseIt:
          'Replaces cumbersome nested loops with clean, readable, hardware-accelerated code.',
        useCases: [
          'Calculating Euclidean distances',
          'Applying discount percentages across inventory prices',
        ],
      },
      partB: {
        title: 'Vector Arithmetic in Action',
        concept: 'Element-wise operators',
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
        breakdown:
          '- Every operation applies to corresponding elements: 10*1=10, 20*2=40, 30*3=90.',
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
        title: 'Universal Function Machinery',
        concept: 'High-performance mathematical mappings',
        explanation:
          'A ufunc (universal function) is a function that operates on ndarrays in an element-by-element fashion. NumPy provides dozens of ufuncs implemented in compiled C: trigonometry (`sin`, `cos`), exponentials (`exp`, `log`), roots (`sqrt`), and rounding (`round`, `floor`, `ceil`).',
        whyUseIt:
          'Executing `np.sqrt(arr)` on 1 million numbers takes a few milliseconds, whereas `math.sqrt` inside a Python loop takes over a second.',
        useCases: [
          'Signal processing and audio frequencies with `sin` and `cos`',
          'Logistic sigmoid and softmax activation functions in neural networks with `exp`',
        ],
      },
      partB: {
        title: 'Common Universal Functions',
        concept: 'Mathematical transformations',
        code: `import numpy as np

arr = np.array([-4, 9, 16])

print("Absolute value:", np.abs(arr))
print("Square root (valid for >= 0):", np.sqrt(np.array([4, 9, 16])))
print("Rounded values:", np.round(np.array([1.25, 2.75, 3.5])))`,
        output: `Absolute value: [ 4  9 16]
Square root (valid for >= 0): [2. 3. 4.]
Rounded values: [1. 3. 4.]`,
        breakdown:
          '- ufuncs produce float arrays where appropriate.\n- Invalid operations (like square root of negative numbers) produce `nan` with a warning.',
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
        title: 'Statistical Reductions',
        concept: 'Collapsing arrays into statistical metrics',
        explanation:
          'Aggregation operations compute summary statistics over array elements: `sum()`, `min()`, `max()`, `mean()` (average), `median()`, `std()` (standard deviation), and `var()` (variance). When called without an axis, they reduce the entire array to a single scalar.',
        whyUseIt:
          'Essential for exploratory data analysis, dataset summaries, loss calculation, and metrics evaluation.',
        useCases: [
          'Calculating total quarterly revenue',
          'Finding average patient age and age spread in medical clinical trials',
        ],
      },
      partB: {
        title: 'Aggregation Methods in Action',
        concept: 'Summary statistics',
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
        breakdown:
          '- `data.sum()`: 10+20+30+40+50 = 150.\n- `data.mean()`: 150 / 5 = 30.0.',
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
        title: 'The Geometry of Axes',
        concept: 'Direction of aggregation along dimensions',
        explanation:
          'In a 2D matrix: axis=0 points DOWNWARDS along rows (collapsing rows into column summaries). axis=1 points HORIZONTALLY across columns (collapsing columns into row summaries). In 3D arrays, axis=0 collapses blocks/slices, axis=1 collapses rows, and axis=2 collapses columns.',
        whyUseIt:
          'Crucial for feature-wise normalization (e.g. mean per column) vs sample-wise normalization (e.g. total score per student).',
        useCases: [
          'Calculating mean test scores per subject: `scores.mean(axis=0)`',
          'Calculating total marks for each student: `scores.sum(axis=1)`',
        ],
      },
      partB: {
        title: 'Visualizing Axis 0 vs Axis 1',
        concept: 'Down columns vs across rows',
        code: `import numpy as np

matrix = np.array([
  [10, 20],
  [30, 40]
])

print("axis=0 (down columns):", matrix.sum(axis=0))
print("axis=1 (across rows):", matrix.sum(axis=1))`,
        output: `axis=0 (down columns): [40 60]
axis=1 (across rows): [30 70]`,
        breakdown:
          '- `axis=0`: [10+30, 20+40] = [40, 60] (one result per column).\n- `axis=1`: [10+20, 30+40] = [30, 70] (one result per row).',
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
        title: 'Element-Wise Truth Testing',
        concept: 'Vectorized comparisons and masks',
        explanation:
          'When you apply comparison operators like `arr > 10`, NumPy evaluates every number independently, returning an array of Booleans (`[True, False, ...]`). `np.all()` checks if all elements are True; `np.any()` checks if at least one is True.',
        whyUseIt:
          'Eliminates Python loops and if-statements, allowing instantaneous filtering of millions of numbers.',
        useCases: [
          'Checking if any sensor temperature exceeded a safety limit: `np.any(temps > 100)`',
          'Verifying all transactions are valid: `np.all(balances >= 0)`',
        ],
      },
      partB: {
        title: 'Comparisons in Action',
        concept: 'Boolean mask generation',
        code: `import numpy as np

arr = np.array([5, 12, 18, 3])

mask = arr > 10
print("Boolean mask:", mask)
print("Are ALL elements > 0?", np.all(arr > 0))
print("Is ANY element > 15?", np.any(arr > 15))`,
        output: `Boolean mask: [False  True  True False]
Are ALL elements > 0? True
Is ANY element > 15? True`,
        breakdown:
          '- `arr > 10` returns boolean array `[False, True, True, False]`.\n- `np.all` and `np.any` evaluate the boolean array to single truth values.',
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
        title: 'Filtering Arrays via Boolean Masks',
        concept: 'Extracting data matching conditions',
        explanation:
          'Boolean indexing extracts elements where a boolean mask is True: `arr[arr > 5]`. To combine conditions, you must use bitwise operators `&` (AND), `|` (OR), and `~` (NOT), and wrap each condition in parentheses: `arr[(arr > 5) & (arr < 10)]`.',
        whyUseIt:
          'Python `and`/`or` keywords evaluate whole-object truth, which fails on arrays. Bitwise `&` and `|` operate element-by-element.',
        useCases: [
          'Filtering sensor data above a critical temperature threshold',
          'Selecting active users with purchase frequency > 0 and account age > 30',
        ],
      },
      partB: {
        title: 'Boolean Indexing with Multiple Conditions',
        concept: 'Bitwise logical masking',
        code: `import numpy as np

scores = np.array([45, 88, 92, 59, 78])

# Extract passing scores >= 60
passing = scores[scores >= 60]
print("Passing scores:", passing)

# Extract scores between 70 and 90
honors = scores[(scores >= 70) & (scores <= 90)]
print("Honors scores:", honors)`,
        output: `Passing scores: [88 92 78]
Honors scores: [88 78]`,
        breakdown:
          '- `scores >= 60` produces booleans `[False, True, True, False, True]`.\n- `scores[mask]` filters the array to `[88, 92, 78]`.',
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
        title: 'Vectorized Conditional Selection',
        concept: 'Ternary transformation and index recovery',
        explanation:
          '`np.where(condition, x, y)` returns elements chosen from x or y depending on condition. If given condition alone, `np.where(condition)` returns coordinate tuples of indices where the condition was True.',
        whyUseIt:
          'Enables instant data transformations, capping outliers, and creating label columns without slow Python loops.',
        useCases: [
          'Binary classification: `np.where(probs >= 0.5, 1, 0)`',
          'Replacing negative values with 0: `np.where(arr < 0, 0, arr)`',
          'Finding coordinate indices of target objects in a matrix',
        ],
      },
      partB: {
        title: 'np.where() in Practice',
        concept: 'Ternary replacement vs index recovery',
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
        breakdown:
          '- `np.where(cond, "Pass", "Fail")` produces element-wise string labels.\n- `np.where(cond)` returns index coordinates `[0, 3]`.',
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
        title: 'Practical Data Processing Pipelines',
        concept: 'Chaining masks, reductions, and substitutions',
        explanation:
          'Real data processing tasks combine operations: filtering outliers, computing conditional averages, counting qualifying records using `(mask).sum()`, and standardizing values.',
        whyUseIt:
          'Forms the core data engineering skillset required for Pandas, machine learning feature pipelines, and business intelligence.',
        useCases: [
          'Calculating churn rates and thresholding customer risk',
          'Detecting anomalous sensor spikes and replacing them with median thresholds',
        ],
      },
      partB: {
        title: 'Data Processing Case Study',
        concept: 'Student grade analytics',
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
        breakdown:
          '- `(marks >= 80).sum()` treats True as 1 and False as 0, yielding 3 students.\n- `marks[marks >= 50].mean()` filters then computes the mean average.',
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
        title: 'What is Broadcasting?',
        concept: 'Stretching dimensions of size 1',
        explanation:
          'Broadcasting describes how NumPy treats arrays with different shapes during arithmetic operations. Subject to certain constraints, the smaller array is "broadcast" across the larger array so that they have compatible shapes.',
        whyUseIt:
          'Enables vector arithmetic between matrices and row/column vectors with zero extra memory copying overhead.',
        useCases: [
          'Centering data: subtracting the column mean vector from every row in a matrix',
          'Scaling image color channels by RGB multipliers',
        ],
      },
      partB: {
        title: 'Broadcasting in Action',
        concept: 'Matrix + Row vector',
        code: `import numpy as np

matrix = np.array([
  [1, 2, 3],
  [4, 5, 6]
]) # Shape (2, 3)

row = np.array([10, 20, 30]) # Shape (3,)

# The row broadcasts downwards across both rows!
print("Broadcasted sum:\n", matrix + row)`,
        output: `Broadcasted sum:
 [[11 22 33]
 [14 25 36]]`,
        breakdown:
          '- `matrix` has shape (2, 3). `row` has shape (3,).\n- `row` stretches along the rows, adding [10, 20, 30] to both rows without allocating memory.',
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
        title: 'The Two Rules of Broadcasting',
        concept: 'Right-to-left trailing dimension alignment',
        explanation:
          'When operating on two arrays, NumPy compares shapes element-wise starting with trailing (rightmost) dimensions. Two dimensions are compatible when: 1. They are equal, OR 2. One of them is 1. If neither condition is met, NumPy raises ValueError: operands could not be broadcast together.',
        whyUseIt:
          'Mastering these rules prevents unexpected ValueError crashes when manipulating high-dimensional arrays.',
        useCases: [
          'Broadcasting batch predictions (N, 1) against target labels (N, K)',
          'Outer product generation by aligning (N, 1) with (1, M)',
        ],
      },
      partB: {
        title: 'Broadcasting Compatibility Examples',
        concept: 'Valid vs invalid shapes',
        code: `import numpy as np

# Compatible: (4, 1) and (1, 5) -> Result: (4, 5)
a = np.ones((4, 1))
b = np.ones((1, 5))
print("Broadcasted shape (4, 1) + (1, 5):", (a + b).shape)

# Incompatible: (4, 3) and (4, 2)
# Trailing dimensions 3 and 2 do not match and neither is 1 -> ValueError!`,
        output: `Broadcasted shape (4, 1) + (1, 5): (4, 5)`,
        breakdown:
          '- Dimension 1: 1 stretches to 5.\n- Dimension 0: 1 stretches to 4.\n- Result is (4, 5).',
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
        title: 'Synthesis of Broadcasting Architecture',
        concept: 'Multi-stage dataset normalization',
        explanation:
          'Real-world broadcasting problems involve multi-step calculations: calculating per-column means with `axis=0`, subtracting them from 2D data arrays, and scaling by standard deviation vectors.',
        whyUseIt:
          'Broadcasting is the backbone of feature engineering, image data augmentation, and loss function calculation.',
        useCases: [
          'Z-score normalization: `(X - X.mean(axis=0)) / X.std(axis=0)`',
          'Pairwise distance matrices in clustering algorithms',
        ],
      },
      partB: {
        title: 'Pairwise Distance Matrix via Broadcasting',
        concept: '(N, 1) - (1, N) outer subtraction',
        code: `import numpy as np

points = np.array([2, 5, 10]) # Shape (3,)

# Reshape into (3, 1) and (1, 3) to compute all pairwise differences!
diff_matrix = points.reshape(3, 1) - points.reshape(1, 3)
print("Pairwise differences:\n", diff_matrix)`,
        output: `Pairwise differences:
 [[ 0 -3 -8]
 [ 3  0 -5]
 [ 8  5  0]]`,
        breakdown:
          '- (3, 1) minus (1, 3) broadcasts into a 3x3 difference table.',
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
        title: 'Joining Arrays Along Existing Axes',
        concept: 'np.concatenate syntax',
        explanation:
          '`np.concatenate([arr1, arr2, ...], axis=0)` joins arrays along the specified axis. All input arrays must have identical shapes except in the dimension corresponding to axis.',
        whyUseIt:
          'Essential for merging batches of training data or appending newly received sensor readings.',
        useCases: [
          'Combining training batches: `np.concatenate([batch1, batch2], axis=0)`',
          'Merging feature tables horizontally: `np.concatenate([features, labels], axis=1)`',
        ],
      },
      partB: {
        title: 'Concatenating Along Axis 0 and Axis 1',
        concept: 'Row-wise vs column-wise concatenation',
        code: `import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

# axis=0: joins vertically (rows: 2+2=4)
print("axis=0 shape:", np.concatenate([a, b], axis=0).shape)

# axis=1: joins horizontally (cols: 2+2=4)
print("axis=1 shape:", np.concatenate([a, b], axis=1).shape)`,
        output: `axis=0 shape: (4, 2)
axis=1 shape: (2, 4)`,
        breakdown:
          '- `axis=0` adds rows: (2+2, 2) = (4, 2).\n- `axis=1` adds columns: (2, 2+2) = (2, 4).',
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
        title: 'Stacking Arrays into New Dimensions',
        concept: 'np.stack creating new axes',
        explanation:
          'While `np.concatenate` keeps the number of dimensions constant, `np.stack([a, b], axis=0)` stacks arrays along a brand new axis. If `a` and `b` have shape (4,), `np.stack([a, b], axis=0)` has shape (2, 4), and with `axis=1` it has shape (4, 2).',
        whyUseIt:
          'Crucial for stacking individual 2D image channels (R, G, B) into a 3D color tensor.',
        useCases: [
          'Stacking R, G, B color channels into an RGB image: `np.stack([r, g, b], axis=-1)`',
          'Stacking audio microphone channel recordings',
        ],
      },
      partB: {
        title: 'stack() vs concatenate()',
        concept: 'Dimension increase comparison',
        code: `import numpy as np

x = np.array([1, 2, 3])
y = np.array([4, 5, 6])

# concatenate keeps 1D: shape (6,)
print("concatenate shape:", np.concatenate([x, y]).shape)

# stack creates a NEW axis: shape (2, 3)
print("stack axis=0 shape:", np.stack([x, y], axis=0).shape)
print("stack axis=1 shape:", np.stack([x, y], axis=1).shape)`,
        output: `concatenate shape: (6,)
stack axis=0 shape: (2, 3)
stack axis=1 shape: (3, 2)`,
        breakdown:
          '- `np.stack` turns two 1D arrays into a 2D matrix.\n- `axis=0` gives shape (2, 3); `axis=1` gives shape (3, 2).',
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
        title: 'Convenient Stacking Helpers',
        concept: 'vstack and hstack semantics',
        explanation:
          '`np.vstack` stacks arrays vertically (along rows, equivalent to concatenate along axis=0 for 2D). `np.hstack` stacks arrays horizontally (along columns, equivalent to concatenate along axis=1 for 2D).',
        whyUseIt:
          'More intuitive and less error-prone than remembering explicit axis numbers for common 2D operations.',
        useCases: [
          'Appending new sample rows to a dataset with `np.vstack`',
          'Appending new feature columns to existing records with `np.hstack`',
        ],
      },
      partB: {
        title: 'vstack vs hstack in Practice',
        concept: 'Vertical vs horizontal merging',
        code: `import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print("vstack (rows):\n", np.vstack([a, b]))
print("hstack (columns):", np.hstack([a, b]))`,
        output: `vstack (rows):
 [[1 2 3]
 [4 5 6]]
hstack (columns): [1 2 3 4 5 6]`,
        breakdown:
          '- `np.vstack([a, b])` converts 1D arrays into rows of a 2D matrix `(2, 3)`.\n- `np.hstack([a, b])` joins 1D arrays into a single long vector `(6,)`.',
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
        title: 'Partitioning Arrays',
        concept: 'np.split and np.array_split',
        explanation:
          '`np.split(arr, sections, axis=0)` divides an array into equal sections. If the array cannot be divided equally, `np.split` raises a ValueError. Use `np.array_split()` if you need to handle unequal divisions gracefully.',
        whyUseIt:
          'Essential for splitting datasets into train/validation/test folds for cross-validation.',
        useCases: [
          'K-Fold cross validation dataset splitting',
          'Splitting an RGB image into separate color channel arrays',
        ],
      },
      partB: {
        title: 'Splitting Arrays in Practice',
        concept: 'Equal and unequal splits',
        code: `import numpy as np

arr = np.arange(10) # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Equal split into 2 sub-arrays of 5 elements
part1, part2 = np.split(arr, 2)
print("Part 1:", part1)
print("Part 2:", part2)

# Unequal split into 3 sub-arrays using array_split
parts = np.array_split(arr, 3)
print("Unequal split sizes:", [len(p) for p in parts])`,
        output: `Part 1: [0 1 2 3 4]
Part 2: [5 6 7 8 9]
Unequal split sizes: [4, 3, 3]`,
        breakdown:
          '- `np.split(arr, 2)` divides 10 elements into two groups of 5.\n- `np.array_split(arr, 3)` divides into 4, 3, 3 without raising an error.',
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
        title: 'Sorting Values vs Ranking Indices',
        concept: 'np.sort vs np.argsort',
        explanation:
          '`np.sort(arr)` returns a sorted copy of the array. `np.argsort(arr)` returns the integer indices that would sort the array in ascending order. Using argsort allows you to sort multiple related arrays simultaneously.',
        whyUseIt:
          'Vital for ranking records, finding top-K recommendations, and sorting parallel arrays.',
        useCases: [
          'Finding indices of top 5 highest confidence predictions: `np.argsort(probs)[-5:]`',
          'Sorting patient names by patient test scores',
        ],
      },
      partB: {
        title: 'Sorting and argsort() in Action',
        concept: 'Parallel array sorting with argsort',
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
        breakdown:
          '- Index 2 (12) is smallest, index 1 (95) is largest.\n- `players[sorted_indices]` ranks the player names according to score!',
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
        title: 'Shared Memory Views vs Independent Copies',
        concept: 'View memory aliasing and .base attribute',
        explanation:
          'In NumPy, basic slicing produces a VIEW: modifying elements in the slice modifies the original array! If you want an independent duplicate, you must explicitly call `arr.copy()`. An array has `.base` pointing to the parent array if it is a view; if it owns its memory, `.base` is None.',
        whyUseIt:
          'Understanding views prevents catastrophic accidental data corruption bugs where mutating a sub-slice ruins your original training data.',
        useCases: [
          'Ensuring training data remains pristine by creating deep copies before augmentation',
          'Inspecting `.base` to debug memory leaks',
        ],
      },
      partB: {
        title: 'Mutation Demonstration: View vs Copy',
        concept: 'Accidental mutation and base inspection',
        code: `import numpy as np

orig = np.array([1, 2, 3])

# Slice view shares memory!
view_arr = orig[:2]
view_arr[0] = 99
print("Original after view mutation:", orig) # [99 2 3]

# Explicit copy creates independent memory!
copy_arr = orig.copy()
copy_arr[0] = 0
print("Original after copy mutation:", orig) # [99 2 3] (untouched!)
print("Is view_arr a view?", view_arr.base is not None)`,
        output: `Original after view mutation: [99  2  3]
Original after copy mutation: [99  2  3]
Is view_arr a view? True`,
        breakdown:
          '- Modifying `view_arr` directly changed `orig`.\n- `copy_arr.copy()` prevented mutation of `orig`.\n- `view_arr.base` confirms memory ownership.',
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
        title: 'Axis Inversion Mechanics',
        concept: 'arr.T and multidimensional permutation',
        explanation:
          'Transposing an array swaps its axes. For a 2D matrix, `arr.T` flips rows into columns (shape (M, N) becomes (N, M)). For 3D+ tensors, `np.transpose(arr, axes)` allows arbitrary permutation of dimensions.',
        whyUseIt:
          'Crucial before matrix multiplications (where inner dimensions must match) and converting image layouts between (Channels, Height, Width) and (Height, Width, Channels).',
        useCases: [
          'Linear algebra matrix multiplication: `A @ B.T`',
          'Converting PyTorch image tensors (C, H, W) to matplotlib format (H, W, C)',
        ],
      },
      partB: {
        title: 'Transposition Examples',
        concept: '2D and 3D transpose',
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
        breakdown:
          '- Rows become columns: row [1, 2, 3] becomes column 0.',
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
        title: 'Stripping Redundant Dimensions',
        concept: 'np.squeeze semantics',
        explanation:
          '`np.squeeze(arr)` removes all dimensions of length 1. For instance, an array of shape (1, 5, 1) is compressed down to shape (5,). You can also specify an exact axis to squeeze.',
        whyUseIt:
          'Essential when deep learning neural network layers output single-batch tensors of shape (1, 10) and you need a clean 1D array of shape (10,).',
        useCases: [
          'Cleaning batch outputs from computer vision object detection models',
          'Preparing single-sample feature vectors for scikit-learn models',
        ],
      },
      partB: {
        title: 'np.squeeze() in Action',
        concept: 'Shape compression',
        code: `import numpy as np

arr = np.array([[[10], [20], [30]]])
print("Original shape:", arr.shape) # (1, 3, 1)

squeezed = np.squeeze(arr)
print("Squeezed shape:", squeezed.shape) # (3,)
print("Squeezed values:", squeezed)`,
        output: `Original shape: (1, 3, 1)
Squeezed shape: (3,)
Squeezed values: [10 20 30]`,
        breakdown:
          '- Both length-1 axes are removed, leaving a clean 1D array.',
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
        title: 'Modern NumPy Random API',
        concept: 'default_rng and reproducibility via seed',
        explanation:
          'Since NumPy 1.17, `default_rng()` is the official, superior random generator utilizing the PCG64 algorithm. Key methods include: `rng.integers(low, high, size)` (uniform random integers), `rng.random(size)` (floats in [0.0, 1.0)), and `rng.standard_normal(size)` (Gaussian bell curve). Setting a seed ensures 100% reproducible results.',
        whyUseIt:
          'Essential for scientific reproducibility, weight initialization in AI, and stochastic simulations.',
        useCases: [
          'Initializing neural network weights from Gaussian normal distribution',
          'Simulating dice, games, and probabilistic Monte Carlo risk models',
        ],
      },
      partB: {
        title: 'Using default_rng in Practice',
        concept: 'Generating integers and floats with a seed',
        code: `import numpy as np

# Initialize with seed for reproducibility
rng = np.random.default_rng(seed=42)

# 4 random integers between 1 and 10 (10 is exclusive!)
rand_ints = rng.integers(1, 11, size=4)
print("Random integers (1-10):", rand_ints)

# 3 random floats in [0.0, 1.0)
rand_floats = rng.random(3)
print("Random floats:", np.round(rand_floats, 2))`,
        output: `Random integers (1-10): [ 1  8  7  7]
Random floats: [0.44 0.12 0.3 ]`,
        breakdown:
          '- `seed=42` guarantees the exact same random sequence every single run.\n- `rng.integers(1, 11)` includes 1 up to 10.',
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
        title: 'Shuffling and Random Sampling',
        concept: 'Permutation and choice selection',
        explanation:
          '`rng.shuffle(arr)` modifies an array in-place by randomly permuting along its first axis. `rng.choice(a, size, replace)` selects random samples from an array, allowing sampling with replacement (bootstrap) or without replacement (lottery).',
        whyUseIt:
          'Crucial for shuffling dataset rows before training epochs and conducting Monte Carlo simulations.',
        useCases: [
          'Shuffling training batches in machine learning',
          'Simulating thousands of coin flips or dice rolls for probability modeling',
        ],
      },
      partB: {
        title: 'Simulating Dice Rolls in Practice',
        concept: 'Monte Carlo dice simulation',
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
        breakdown:
          '- Theoretical probability of rolling 7 is 6/36 ≈ 0.167.\n- The 1,000-roll simulation yields 0.168, demonstrating the Law of Large Numbers.',
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
        title: 'Hadamard Product vs Matrix Multiplication',
        concept: '* vs @ in Python 3.5+',
        explanation:
          '`A * B` multiplies matching elements (Hadamard product). `A @ B` (or `np.matmul(A, B)`) calculates true matrix multiplication, where row vectors of A dot-multiply column vectors of B. For `A @ B` to be valid, the column count of A must match the row count of B.',
        whyUseIt:
          'Matrix multiplication is the universal fundamental mathematical operation of artificial neural networks, 3D graphics rendering, and physics simulations.',
        useCases: [
          'Linear neural network forward pass: `Output = X @ W + bias`',
          '3D rotational coordinate transformations',
        ],
      },
      partB: {
        title: 'Comparing * and @',
        concept: 'Output differences',
        code: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[2, 0], [1, 2]])

# Element-wise (*)
print("Element-wise (*):\n", A * B)

# Matrix Multiplication (@)
# Row 0 of A [1, 2] dot Col 0 of B [2, 1] = 1*2 + 2*1 = 4!
print("Matrix Multiply (@):\n", A @ B)`,
        output: `Element-wise (*):
 [[2 0]
 [3 8]]
Matrix Multiply (@):
 [[ 4  4]
 [10  8]]`,
        breakdown:
          '- `*` computes 1*2=2, 2*0=0, etc.\n- `@` computes row-dot-column products.',
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
        title: 'Dot Product Mechanics',
        concept: 'Inner product and vector projection',
        explanation:
          'For two 1D vectors of equal length, the dot product is the sum of the products of their corresponding components: `a · b = a[0]*b[0] + a[1]*b[1] + ...`. If the vectors are orthogonal (perpendicular), their dot product is 0. If they point in identical directions, the dot product is maximized.',
        whyUseIt:
          'Fundamental for calculating cosine similarity, measuring vector alignment, and projection.',
        useCases: [
          'Cosine similarity in natural language processing (text embeddings)',
          'Lighting and specular reflection in 3D game engines',
        ],
      },
      partB: {
        title: 'Computing Dot Products',
        concept: '1D dot product calculation',
        code: `import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
dot_prod = np.dot(a, b)
print("Dot product a · b:", dot_prod)`,
        output: `Dot product a · b: 32`,
        breakdown:
          '- Sum of products: 4 + 10 + 18 = 32.',
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
        title: 'Advanced Matrix Algebra via np.linalg',
        concept: 'det, inv, solve, and eig',
        explanation:
          '`np.linalg` provides optimized LAPACK linear algebra routines: `np.linalg.det(A)` computes matrix determinants; `np.linalg.inv(A)` computes matrix inverses (for non-singular matrices where det != 0); `np.linalg.solve(A, b)` solves linear equations `Ax = b`; and `np.linalg.eig(A)` extracts eigenvalues and eigenvectors.',
        whyUseIt:
          'Solves physics differential equations, Principal Component Analysis (PCA) dimensionality reduction, and linear regressions.',
        useCases: [
          'PCA dimensionality reduction using eigenvectors of covariance matrices',
          'Solving circuit loop currents and structural beam load balances',
        ],
      },
      partB: {
        title: 'Solving a Linear System: Ax = b',
        concept: 'np.linalg.solve',
        code: `import numpy as np

# System:
# 3x + y = 9
# x + 2y = 8
A = np.array([[3, 1], [1, 2]])
b = np.array([9, 8])

# Solve for [x, y]
solution = np.linalg.solve(A, b)
print("Solution [x, y]:", solution)
print("Determinant of A:", np.round(np.linalg.det(A), 2))`,
        output: `Solution [x, y]: [2. 3.]
Determinant of A: 5.0`,
        breakdown:
          '- Solution: x = 2.0, y = 3.0.\n- Determinant is 3*2 - 1*1 = 5.0, confirming matrix is non-singular.',
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
        title: 'The Nature of NaN (Not a Number)',
        concept: 'IEEE 754 NaN propagation and nan-safe functions',
        explanation:
          '`np.nan` represents missing or undefined floating-point numbers. Standard functions like `np.mean()` return `nan` if even a single value is missing. To safely calculate statistics while skipping NaNs, use nan-safe functions: `np.nanmean()`, `np.nanmax()`, `np.nanmin()`, and `np.nansum()`.',
        whyUseIt:
          'Prevents corrupted calculations in production data science pipelines with intermittent missing records.',
        useCases: [
          'Calculating safe averages from weather station temperature streams with dropped packets',
          'Medical patient metrics where certain laboratory tests were not conducted',
        ],
      },
      partB: {
        title: 'Standard vs NaN-Safe Functions',
        concept: 'Propagation vs safe reduction',
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
        breakdown:
          '- `np.mean()` is poisoned by `np.nan`.\n- `np.nanmean()` ignores the missing value and calculates (24.5+26.0+25.5)/3.',
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
        title: 'Detecting and Imputing Missing Values',
        concept: 'np.isnan and mean imputation',
        explanation:
          'Under the IEEE 754 standard, `NaN != NaN`. To find NaNs, you must call `np.isnan(arr)`. You can then filter them out using boolean inversion `arr[~np.isnan(arr)]` or impute them in-place: `arr[np.isnan(arr)] = replacement_value`.',
        whyUseIt:
          'Most machine learning algorithms cannot train on data containing NaNs; cleaning or imputing missing features is a mandatory pre-processing step.',
        useCases: [
          'Replacing missing sensor temperatures with the dataset mean or median',
          'Filtering invalid corrupted image pixels',
        ],
      },
      partB: {
        title: 'Missing Data Imputation in Practice',
        concept: 'Mean imputation pipeline',
        code: `import numpy as np

data = np.array([10.0, 20.0, np.nan, 40.0])

# 1. Compute safe median of valid values
safe_median = np.nanmedian(data)

# 2. Impute missing values in-place
data[np.isnan(data)] = safe_median
print("Imputed clean dataset:", data)`,
        output: `Imputed clean dataset: [10. 20. 20. 40.]`,
        breakdown:
          '- `np.isnan(data)` detects the NaN.\n- Replacing it with the median restores data completeness.',
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
        title: 'End-to-End Real World Data Processing',
        concept: 'Synthesis of multiple array concepts',
        explanation:
          'Real datasets require multi-step NumPy mastery: loading rectangular matrix records, isolating feature columns via slicing, handling missing sensor noise with nan-safe reductions, applying conditional masks, and computing aggregated summaries.',
        whyUseIt:
          'This is the exact skillset data scientists, ML engineers, and quantitative researchers use every single day.',
        useCases: [
          'Analyzing city-wide temperature anomaly trends',
          'Computing student GPA rankings and pass percentages across hundreds of cohorts',
        ],
      },
      partB: {
        title: 'Weather Station Case Study',
        concept: 'Real-world data cleaning and analytics',
        code: `import numpy as np

# Columns: [Station_ID, Temp_C, Humidity_%, Rainfall_mm]
data = np.array([
  [1, 28.5, 65.0, 0.0],
  [2, 32.1, 70.0, 12.5],
  [3, np.nan, 80.0, 5.0],
  [4, 29.4, 60.0, 0.0]
])

# Extract temperature column
temps = data[:, 1]
max_temp = np.nanmax(temps)
avg_humidity = data[:, 2].mean()

print("Peak Temperature Recorded:", max_temp)
print("Average Humidity (%):", avg_humidity)`,
        output: `Peak Temperature Recorded: 32.1
Average Humidity (%): 68.75`,
        breakdown:
          '- `data[:, 1]` slices the temperature column.\n- `np.nanmax()` safely extracts the maximum valid reading despite missing station 3 data.',
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
        title: 'The Power of Vectorization',
        concept: 'SIMD hardware vector units and compiled loops',
        explanation:
          'In standard Python, executing `for x in my_list: x * 2` requires the Python interpreter to inspect each object, unbox its value, perform type checks, and allocate a new integer object. NumPy vectorization delegates the entire loop to pre-compiled C routines that load multiple numbers into CPU SIMD (Single Instruction, Multiple Data) registers simultaneously.',
        whyUseIt:
          'Transforms code that would take minutes in pure Python into operations taking fractions of a second.',
        useCases: [
          'Processing billions of scientific sensor readings in milliseconds',
          'Real-time video frame filters at 60+ FPS in Python',
        ],
      },
      partB: {
        title: 'Benchmark: For-Loop vs Vectorization',
        concept: '50x speed comparison',
        code: `import numpy as np

arr = np.arange(1_000_000)

# Vectorized: executes instantly via SIMD C-loop
result = arr * 2
print("Calculated 1,000,000 numbers instantly! First 3:", result[:3])`,
        output: `Calculated 1,000,000 numbers instantly! First 3: [0 2 4]`,
        breakdown:
          '- 1 million numbers processed in a few milliseconds without writing any explicit Python loops.',
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
        title: 'Memory Architecture: Lists vs ndarrays',
        concept: 'Pointer indirection vs contiguous raw buffers',
        explanation:
          'A Python list of integers stores an array of 8-byte pointers, where each pointer refers to a 28-byte PyObject on the heap (36 bytes total per number!). A NumPy int64 array stores raw 8-byte numbers packed contiguously. When the CPU reads memory, it fetches entire cache lines, meaning contiguous NumPy data causes near zero cache misses.',
        whyUseIt:
          'Reduces memory footprint by 75%+ and drastically accelerates data throughput.',
        useCases: [
          'Storing massive geospatial rasters and satellite imagery in RAM',
          'Deploying lightweight machine learning microservices on edge devices',
        ],
      },
      partB: {
        title: 'Memory Footprint Comparison',
        concept: 'Contiguous memory layout',
        code: `import numpy as np

# NumPy contiguous array: exactly 8 bytes per int64
arr = np.arange(1000, dtype=np.int64)
print("NumPy array total bytes (nbytes):", arr.nbytes) # exactly 8,000 bytes!`,
        output: `NumPy array total bytes (nbytes): 8000`,
        breakdown:
          '- Exactly 8,000 bytes in memory, compared to ~36,000+ bytes for a standard Python list of 1,000 integers.',
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
        title: 'Fancy Integer Array Indexing',
        concept: 'Arbitrary index extraction and copy behavior',
        explanation:
          'Fancy indexing refers to passing arrays or lists of integers to target specific elements: `arr[[0, 3, 1]]`. Unlike basic slices which return memory views, fancy integer indexing ALWAYS creates and returns a brand new COPY of the data.',
        whyUseIt:
          'Allows reordering elements, sampling random minibatches, and indexing non-contiguous multi-dimensional coordinates.',
        useCases: [
          'Selecting mini-batches by random index arrays in machine learning',
          'Reordering image color channels or permutation layers',
        ],
      },
      partB: {
        title: 'Fancy Indexing in Action',
        concept: 'Extracting in custom order',
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
        breakdown:
          '- Indices `[4, 0, 2]` produce `[50, 10, 30]`.\n- Modifying the result leaves the original array untouched.',
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
        title: 'Inserting Axes for Broadcasting Compatibility',
        concept: 'np.newaxis and expand_dims',
        explanation:
          'When two arrays cannot broadcast because one lacks a dimension, `np.newaxis` (or `np.expand_dims(arr, axis)`) inserts a new axis of length 1. For example, converting a 1D vector `(N,)` into a 2D column vector `(N, 1)` via `arr[:, np.newaxis]`.',
        whyUseIt:
          'Essential before performing outer subtraction, matrix multiplications, and batch tensor operations in deep learning.',
        useCases: [
          'Converting 1D audio sample into batch tensor format `(1, Samples)`',
          'Enabling pairwise difference matrices via `A[:, np.newaxis] - B[np.newaxis, :]`',
        ],
      },
      partB: {
        title: 'Expanding Dimensions in Practice',
        concept: 'Column vector conversion',
        code: `import numpy as np

v = np.array([1, 2, 3]) # Shape (3,)
print("Original 1D shape:", v.shape)

# Transform into 2D column vector (3, 1)
col = v[:, np.newaxis]
print("Column vector shape:", col.shape)

# Transform into 2D row vector (1, 3) using expand_dims
row = np.expand_dims(v, axis=0)
print("Row vector shape:", row.shape)`,
        output: `Original 1D shape: (3,)
Column vector shape: (3, 1)
Row vector shape: (1, 3)`,
        breakdown:
          '- `v[:, np.newaxis]` creates shape `(3, 1)`.\n- `np.expand_dims(v, axis=0)` creates shape `(1, 3)`.',
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
        title: 'Essential Mathematical Utilities',
        concept: 'clip, unique, cumsum, and diff',
        explanation:
          '`np.clip(arr, a_min, a_max)` clamps elements within a specified numerical range. `np.unique(arr)` finds sorted unique elements. `np.cumsum(arr)` computes running cumulative sums. `np.diff(arr)` computes discrete differences between consecutive elements.',
        whyUseIt:
          'Prevents gradient explosions in neural networks (gradient clipping), extracts vocabulary tokens, and computes financial cumulative wealth.',
        useCases: [
          'Gradient clipping: `np.clip(gradients, -1.0, 1.0)`',
          'Finding distinct class labels in machine learning targets: `np.unique(labels)`',
          'Calculating cumulative portfolio returns: `np.cumsum(returns)`',
        ],
      },
      partB: {
        title: 'Advanced Utilities in Action',
        concept: 'Clamping, uniqueness, and cumulative sums',
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
        breakdown:
          '- `clip` bounds numbers between 0 and 10.\n- `unique` returns sorted set `[1, 2, 3]`.\n- `cumsum` yields running totals `[1, 3, 6, 10]`.',
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
        title: 'The Pinnacle of NumPy Mastery',
        concept: 'Full curriculum synthesis and real-world fluency',
        explanation:
          'A true NumPy Master chains all foundational and advanced concepts effortlessly: pre-allocating data, slicing multidimensional windows, broadcasting matrix operations, managing missing data with nan-safe routines, and optimizing memory contiguity.',
        whyUseIt:
          'You are now equipped to build production machine learning systems, scientific simulations, and high-performance numerical engines in Python.',
        useCases: [
          'End-to-end Machine Learning data pre-processing and feature pipelines',
          'Real-time computer vision feature engineering and matrix math',
        ],
      },
      partB: {
        title: 'The Master Pipeline',
        concept: 'Reshape, Mask, Sum & Linear Algebra Synthesis',
        code: `import numpy as np

# 1. Instantiate, reshape, and filter
grid = np.arange(12).reshape(3, 4)
even_sum = grid[grid % 2 == 0].sum()

# 2. Linear dot product and nan-safe average
dot_res = np.dot([2, 3], [4, 5])
safe_mean = np.nanmean([10, np.nan, 20])

print("Grid:\n", grid)
print("Even Sum:", even_sum)
print("Dot + NanMean:", dot_res + safe_mean)`,
        output: `Grid:
 [[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]
Even Sum: 30
Dot + NanMean: 38.0`,
        breakdown:
          '- Full synthesis: 0+2+4+6+8+10 = 30. Dot product = 23. Nanmean = 15. Total = 38.0.',
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
