import { Question } from '../types/curriculum';

export const QUESTION_BANK: Record<string, Question> = {
  // ==========================================
  // WORLD 1: FOUNDATIONS (LEVELS 1 - 4)
  // ==========================================

  // Level 1: What is NumPy?
  'q_arr_01': {
    id: 'q_arr_01',
    topic: 'arrays',
    difficulty: 1,
    type: 'multiple_choice',
    question: 'How do you conventionally import NumPy in Python?',
    options: ['import numpy as np', 'include numpy', 'import numpy.all as np', 'from numpy import everything'],
    correctAnswer: 'import numpy as np',
    hint: 'Aria whispers: In Python, we alias the module with a standard two-letter abbreviation.',
    explanation: '`import numpy as np` is the universally adopted standard convention across data science and scientific computing.',
    requiredConcepts: ['numpy-import']
  },
  'q_arr_02': {
    id: 'q_arr_02',
    topic: 'arrays',
    difficulty: 1,
    type: 'predict_output',
    question: 'What is the output of the following code?',
    codeSnippet: 'import numpy as np\narr = np.array([10, 20, 30])\nprint(type(arr))',
    options: ["<class 'numpy.ndarray'>", "<class 'list'>", "<class 'array'>", "<class 'tuple'>"],
    correctAnswer: "<class 'numpy.ndarray'>",
    hint: 'Aria whispers: The core data structure of NumPy is an N-dimensional array.',
    explanation: 'NumPy array objects are instances of `numpy.ndarray` (N-Dimensional Array).',
    requiredConcepts: ['numpy-array', 'ndarray']
  },
  'q_arr_03': {
    id: 'q_arr_03',
    topic: 'arrays',
    difficulty: 1,
    type: 'predict_output',
    question: 'What does multiplying a NumPy array by a scalar evaluate to?',
    codeSnippet: 'import numpy as np\narr = np.array([1, 2, 3]) * 2\nprint(arr)',
    options: ['[2 4 6]', '[1, 2, 3, 1, 2, 3]', '[2, 2, 2]', 'Error: cannot multiply array'],
    correctAnswer: '[2 4 6]',
    hint: 'Aria whispers: Unlike standard Python lists which duplicate on multiplication, NumPy arrays perform vectorized element-wise math!',
    explanation: 'NumPy arrays support vectorized arithmetic: `[1, 2, 3] * 2` multiplies each individual element by 2, resulting in `[2 4 6]`.',
    requiredConcepts: ['numpy-array', 'vectorization']
  },
  'q_arr_04': {
    id: 'q_arr_04',
    topic: 'arrays',
    difficulty: 2,
    type: 'predict_output',
    question: 'What happens when you pass mixed types into np.array()?',
    codeSnippet: 'import numpy as np\narr = np.array([1, 2, "three"])\nprint(arr)',
    options: ["['1' '2' 'three']", "[1 2 'three']", "TypeError: inconsistent types", "[1 2 0]"],
    correctAnswer: "['1' '2' 'three']",
    hint: 'Aria whispers: All elements in a NumPy array must share the exact same data type (homogeneity).',
    explanation: 'NumPy arrays are homogeneous. If you supply mixed types, NumPy upcasts all elements to a common compatible type (strings in this case).',
    requiredConcepts: ['numpy-array', 'dtype']
  },
  'q_arr_05': {
    id: 'q_arr_05',
    topic: 'arrays',
    difficulty: 1,
    type: 'predict_output',
    question: 'What is the result of multiplying a Python list [1, 2] * 2 versus a NumPy array np.array([1, 2]) * 2?',
    options: [
      'List duplicates elements [1, 2, 1, 2], array multiplies numbers [2 4]',
      'Both multiply numbers to [2, 4]',
      'Both duplicate elements to [1, 2, 1, 2]',
      'Array gives an error without a loop'
    ],
    correctAnswer: 'List duplicates elements [1, 2, 1, 2], array multiplies numbers [2 4]',
    hint: 'Aria whispers: Python lists treat * as sequence repetition, whereas NumPy arrays perform vectorized numerical computation.',
    explanation: 'Python lists repeat: `[1, 2] * 2 == [1, 2, 1, 2]`. NumPy ndarrays perform SIMD element-wise arithmetic: `np.array([1, 2]) * 2 == [2 4]`.',
    requiredConcepts: ['numpy-array', 'vectorization']
  },
  'q_arr_06': {
    id: 'q_arr_06',
    topic: 'arrays',
    difficulty: 2,
    type: 'multiple_choice',
    question: 'Why does NumPy operate significantly faster than standard Python lists?',
    options: [
      'Contiguous C memory blocks and CPU vectorization',
      'Python lists are stored on cloud servers',
      'NumPy converts all numbers to hexadecimal strings',
      'NumPy skips floating point validation'
    ],
    correctAnswer: 'Contiguous C memory blocks and CPU vectorization',
    hint: 'Aria whispers: Hardware cache locality and C-level vectorized SIMD loops power NumPy.',
    explanation: 'NumPy stores elements in continuous blocks of raw memory without pointer indirection, allowing CPU SIMD vector units to process them at native speed.',
    requiredConcepts: ['numpy-array', 'performance']
  },

  // Level 2: Creating Arrays
  'q_create_arr_01': {
    id: 'q_create_arr_01',
    topic: 'creation',
    difficulty: 1,
    type: 'predict_output',
    question: 'What array is created by passing a nested 2D list into np.array()?',
    codeSnippet: 'import numpy as np\narr = np.array([[1, 2], [3, 4]])\nprint(arr.ndim)',
    options: ['2', '1', '4', '(2, 2)'],
    correctAnswer: '2',
    hint: 'Aria whispers: A list of lists creates a 2D matrix (2 dimensions: rows and columns).',
    explanation: 'A nested list of lists corresponds to a 2-dimensional ndarray (`ndim = 2`).',
    requiredConcepts: ['array-creation', '2d-array']
  },
  'q_create_arr_02': {
    id: 'q_create_arr_02',
    topic: 'creation',
    difficulty: 2,
    type: 'shape_prediction',
    question: 'What is the shape of this 3D array?',
    codeSnippet: 'import numpy as np\narr = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]], [[9, 10], [11, 12]]])\nprint(arr.shape)',
    options: ['(3, 2, 2)', '(2, 3, 2)', '(2, 2, 3)', '(12,)'],
    correctAnswer: '(3, 2, 2)',
    hint: 'Aria whispers: Count outer blocks (3), then rows inside each block (2), then columns (2).',
    explanation: 'There are 3 matrices, each with 2 rows and 2 columns, yielding shape `(3, 2, 2)`.',
    requiredConcepts: ['3d-array', 'shape']
  },
  'q_create_arr_03': {
    id: 'q_create_arr_03',
    topic: 'creation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What happens when sublists have uneven lengths in np.array() in modern NumPy?',
    codeSnippet: 'import numpy as np\narr = np.array([[1, 2], [3, 4, 5]])',
    options: [
      'ValueError: setting an array element with a sequence',
      'It automatically fills missing values with 0',
      'It creates a ragged 2D matrix of shape (2, 3)',
      'It flattens both lists into [1 2 3 4 5]'
    ],
    correctAnswer: 'ValueError: setting an array element with a sequence',
    hint: 'Aria whispers: NumPy requires rectangular grids; ragged nested sequences raise a ValueError in modern versions.',
    explanation: 'In modern NumPy (1.24+), creating arrays from ragged nested sequences without specifying dtype=object raises a ValueError.',
    requiredConcepts: ['array-creation', 'ragged-array']
  },
  'q_create_arr_04': {
    id: 'q_create_arr_04',
    topic: 'creation',
    difficulty: 2,
    type: 'code_fill',
    question: 'Which argument specifies creating an array from a tuple sequence?',
    codeSnippet: 'import numpy as np\narr = np.array((10, 20, 30))\nprint(arr[0])',
    options: ['10', '(10,)', 'Error: must be a list', 'None'],
    correctAnswer: '10',
    hint: 'Aria whispers: np.array() accepts any sequence, including tuples.',
    explanation: '`np.array()` converts any iterable sequence (such as tuples or ranges) into an ndarray.',
    requiredConcepts: ['array-creation', 'tuples']
  },
  'q_create_arr_05': {
    id: 'q_create_arr_05',
    topic: 'creation',
    difficulty: 1,
    type: 'predict_output',
    question: 'What is the length (len) of a 2D array with shape (4, 3)?',
    codeSnippet: 'import numpy as np\narr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]])\nprint(len(arr))',
    options: ['4', '3', '12', '2'],
    correctAnswer: '4',
    hint: 'Aria whispers: len() on an ndarray returns the size of the first axis (number of rows).',
    explanation: '`len(arr)` returns the length of the leading dimension (axis 0), which is 4.',
    requiredConcepts: ['len', 'axis0']
  },

  // Level 3: Array Attributes
  'q_shape_01': {
    id: 'q_shape_01',
    topic: 'shape',
    difficulty: 1,
    type: 'shape_prediction',
    question: 'What is the shape of this 2D array?',
    codeSnippet: 'import numpy as np\narr = np.array([[1, 2, 3], [4, 5, 6]])\nprint(arr.shape)',
    options: ['(2, 3)', '(3, 2)', '(6,)', '(2,)'],
    correctAnswer: '(2, 3)',
    hint: 'Aria whispers: Shape is represented as (rows, columns). Count the outer rows first, then inner columns.',
    explanation: '`arr` has 2 rows and 3 columns, so its shape tuple is `(2, 3)`.',
    requiredConcepts: ['shape', 'dimensions']
  },
  'q_shape_02': {
    id: 'q_shape_02',
    topic: 'shape',
    difficulty: 1,
    type: 'predict_output',
    question: 'What attribute tells you the number of array dimensions in NumPy?',
    codeSnippet: 'import numpy as np\narr = np.array([[1, 2], [3, 4]])\nprint(arr.ndim)',
    options: ['2', '(2, 2)', '4', '1'],
    correctAnswer: '2',
    hint: 'Aria whispers: `ndim` stands for number of dimensions (axes).',
    explanation: '`arr.ndim` returns the integer count of dimensions. Since this is a 2D matrix, `ndim` is 2.',
    requiredConcepts: ['ndim', 'dimensions']
  },
  'q_shape_03': {
    id: 'q_shape_03',
    topic: 'shape',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr.size return for an array with shape (3, 4)?',
    options: ['12', '7', '(3, 4)', '3'],
    correctAnswer: '12',
    hint: 'Aria whispers: `size` is the total count of elements inside the array.',
    explanation: '`arr.size` is the product of all shape dimensions: 3 * 4 = 12 total elements.',
    requiredConcepts: ['size', 'shape']
  },
  'q_shape_04': {
    id: 'q_shape_04',
    topic: 'shape',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr.itemsize represent for an array of 64-bit floats (float64)?',
    codeSnippet: 'import numpy as np\narr = np.array([1.0, 2.0, 3.0], dtype=np.float64)\nprint(arr.itemsize)',
    options: ['8', '64', '3', '24'],
    correctAnswer: '8',
    hint: 'Aria whispers: itemsize returns the length of one array element in bytes (64 bits / 8 bits per byte).',
    explanation: '64 bits = 8 bytes. `arr.itemsize` returns the byte size of each individual element in memory.',
    requiredConcepts: ['itemsize', 'memory']
  },
  'q_shape_05': {
    id: 'q_shape_05',
    topic: 'shape',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the total number of bytes (nbytes) consumed by an int32 array with shape (2, 5)?',
    options: ['40', '10', '20', '80'],
    correctAnswer: '40',
    hint: 'Aria whispers: nbytes = size * itemsize. An int32 takes 4 bytes. Total elements = 10.',
    explanation: '2 rows * 5 cols = 10 elements. 10 * 4 bytes = 40 bytes total (`arr.nbytes`).',
    requiredConcepts: ['nbytes', 'memory']
  },

  // Level 4: Data Types & astype()
  'q_dtype_01': {
    id: 'q_dtype_01',
    topic: 'dtype',
    difficulty: 1,
    type: 'predict_output',
    question: 'What is the default integer dtype created on 64-bit systems when passing standard integer lists?',
    codeSnippet: 'import numpy as np\narr = np.array([1, 2, 3])\nprint("int" in str(arr.dtype))',
    options: ['True', 'False', 'Error', 'None'],
    correctAnswer: 'True',
    hint: 'Aria whispers: NumPy assigns either int32 or int64 by default depending on OS architecture.',
    explanation: 'NumPy defaults integer values to standard architecture signed integers (`int32` on Windows/32-bit, `int64` on 64-bit Unix).',
    requiredConcepts: ['dtype', 'integers']
  },
  'q_dtype_02': {
    id: 'q_dtype_02',
    topic: 'dtype',
    difficulty: 2,
    type: 'predict_output',
    question: 'What happens when converting a float array with decimals to integers using astype(int)?',
    codeSnippet: 'import numpy as np\narr = np.array([1.8, 2.2, 3.9])\nprint(arr.astype(int))',
    options: ['[1 2 3]', '[2 2 4]', '[1.0 2.0 3.0]', 'TypeError: cannot convert'],
    correctAnswer: '[1 2 3]',
    hint: 'Aria whispers: astype(int) truncates the decimal portion toward zero, it does not round!',
    explanation: '`astype(int)` truncates fractional values directly: 1.8 -> 1, 2.2 -> 2, 3.9 -> 3.',
    requiredConcepts: ['astype', 'truncation']
  },
  'q_dtype_03': {
    id: 'q_dtype_03',
    topic: 'dtype',
    difficulty: 2,
    type: 'predict_output',
    question: 'Does astype() modify the original array in place or return a new array copy?',
    codeSnippet: 'import numpy as np\nx = np.array([1.5, 2.5])\ny = x.astype(int)\nprint(x.dtype)',
    options: ['float64', 'int32', 'int64', 'object'],
    correctAnswer: 'float64',
    hint: 'Aria whispers: astype() returns a brand new converted copy; original array x remains unchanged!',
    explanation: '`astype()` produces a new array with the converted data type, leaving the source array intact.',
    requiredConcepts: ['astype', 'copy']
  },
  'q_dtype_04': {
    id: 'q_dtype_04',
    topic: 'dtype',
    difficulty: 2,
    type: 'code_fill',
    question: 'Which dtype is best suited for RGB image pixel values ranging strictly from 0 to 255?',
    options: ['np.uint8', 'np.float64', 'np.int64', 'np.bool_'],
    correctAnswer: 'np.uint8',
    hint: 'Aria whispers: An unsigned 8-bit integer holds values from 0 to 255.',
    explanation: '`np.uint8` (unsigned 8-bit integer) exactly represents pixel intensity values [0, 255] with minimal memory footprint.',
    requiredConcepts: ['uint8', 'image-processing']
  },
  'q_dtype_05': {
    id: 'q_dtype_05',
    topic: 'dtype',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the boolean array created by np.array([0, 1, 5, 0]).astype(bool)?',
    codeSnippet: 'import numpy as np\narr = np.array([0, 1, 5, 0]).astype(bool)\nprint(arr)',
    options: ['[False  True  True False]', '[False  True False False]', '[True True True True]', 'Error'],
    correctAnswer: '[False  True  True False]',
    hint: 'Aria whispers: In Python and NumPy, zero is False and all non-zero numbers evaluate to True.',
    explanation: 'Zero values map to `False`, while any non-zero value (like 1 or 5) casts to `True`.',
    requiredConcepts: ['astype', 'boolean-casting']
  },

  // ==========================================
  // WORLD 2: ARRAY CONTROL (LEVELS 5 - 9)
  // ==========================================

  // Level 5: Indexing
  'q_idx_01': {
    id: 'q_idx_01',
    topic: 'indexing',
    difficulty: 1,
    type: 'predict_output',
    question: 'What does arr[-1] return for a 1D array?',
    codeSnippet: 'import numpy as np\narr = np.array([10, 20, 30, 40])\nprint(arr[-1])',
    options: ['40', '10', '-1', 'IndexError'],
    correctAnswer: '40',
    hint: 'Aria whispers: Negative indexing starts from the end of the array (-1 is the last element).',
    explanation: '`arr[-1]` accesses the last element of the sequence, which is 40.',
    requiredConcepts: ['indexing', 'negative-indexing']
  },
  'q_idx_02': {
    id: 'q_idx_02',
    topic: 'indexing',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the output of matrix[1, 2]?',
    codeSnippet: 'import numpy as np\nmatrix = np.array([[1, 2, 3], [4, 5, 6]])\nprint(matrix[1, 2])',
    options: ['6', '5', '3', '2'],
    correctAnswer: '6',
    hint: 'Aria whispers: Row index 1 is the second row, column index 2 is the third column.',
    explanation: 'Row 1 contains `[4, 5, 6]`. At column index 2, the value is 6.',
    requiredConcepts: ['indexing', '2d-indexing']
  },
  'q_idx_03': {
    id: 'q_idx_03',
    topic: 'indexing',
    difficulty: 2,
    type: 'predict_output',
    question: 'In a 3D array of shape (2, 3, 4), which expression extracts the value at block 0, row 1, col 2?',
    options: ['arr[0, 1, 2]', 'arr[0][1][2] only', 'arr(0, 1, 2)', 'arr[0; 1; 2]'],
    correctAnswer: 'arr[0, 1, 2]',
    hint: 'Aria whispers: Comma-separated indices allow direct multi-dimensional coordinate access.',
    explanation: '`arr[0, 1, 2]` is the standard NumPy comma syntax for multi-dimensional coordinate indexing.',
    requiredConcepts: ['3d-indexing']
  },
  'q_idx_04': {
    id: 'q_idx_04',
    topic: 'indexing',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the result of mutating an indexed element in a 2D array?',
    codeSnippet: 'import numpy as np\narr = np.array([[10, 20], [30, 40]])\narr[0, 1] = 99\nprint(arr[0, 1])',
    options: ['99', '20', 'Error: ndarray is immutable', '10'],
    correctAnswer: '99',
    hint: 'Aria whispers: NumPy arrays are mutable by default.',
    explanation: 'Individual elements in a NumPy array can be reassigned directly in-place using index assignment.',
    requiredConcepts: ['indexing', 'mutation']
  },
  'q_idx_05': {
    id: 'q_idx_05',
    topic: 'indexing',
    difficulty: 3,
    type: 'find_error',
    question: 'What error occurs when accessing an index outside array bounds?',
    codeSnippet: 'import numpy as np\narr = np.array([1, 2, 3])\nprint(arr[5])',
    options: ['IndexError: index 5 is out of bounds', 'None: returns None', 'ValueError: empty value', 'KeyError: 5'],
    correctAnswer: 'IndexError: index 5 is out of bounds',
    hint: 'Aria whispers: Out-of-bounds indexing raises an IndexError in NumPy.',
    explanation: 'Indexing beyond the valid axis range raises `IndexError: index is out of bounds for axis with size`.',
    requiredConcepts: ['indexing', 'exceptions']
  },

  // Level 6: Slicing
  'q_slice_01': {
    id: 'q_slice_01',
    topic: 'slicing',
    difficulty: 2,
    type: 'predict_output',
    question: 'What slice extracts the middle two elements of [10, 20, 30, 40]?',
    codeSnippet: 'import numpy as np\narr = np.array([10, 20, 30, 40])\nprint(arr[1:3])',
    options: ['[20 30]', '[10 20]', '[20 30 40]', '[30 40]'],
    correctAnswer: '[20 30]',
    hint: 'Aria whispers: arr[start:stop] includes start (1) up to but excluding stop (3).',
    explanation: 'Index 1 is 20, index 2 is 30, and index 3 is excluded. So `arr[1:3]` is `[20 30]`.',
    requiredConcepts: ['slicing', '1d-slicing']
  },
  'q_slice_02': {
    id: 'q_slice_02',
    topic: 'slicing',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr[:, 1] extract from a 2D matrix?',
    codeSnippet: 'import numpy as np\nmatrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])\nprint(matrix[:, 1])',
    options: ['[2 5 8]', '[4 5 6]', '[1 2 3]', '[2 3]'],
    correctAnswer: '[2 5 8]',
    hint: 'Aria whispers: The colon `:` selects all rows, while 1 selects column index 1.',
    explanation: '`matrix[:, 1]` selects column 1 across every single row: `[2, 5, 8]`.',
    requiredConcepts: ['2d-slicing', 'column-extraction']
  },
  'q_slice_03': {
    id: 'q_slice_03',
    topic: 'slicing',
    difficulty: 2,
    type: 'predict_output',
    question: 'How do you reverse a 1D NumPy array using slice step syntax?',
    codeSnippet: 'import numpy as np\narr = np.array([1, 2, 3, 4])\nprint(arr[::-1])',
    options: ['[4 3 2 1]', '[1 2 3 4]', 'Error: step cannot be negative', '[-1 -2 -3 -4]'],
    correctAnswer: '[4 3 2 1]',
    hint: 'Aria whispers: A step of -1 traverses the array in reverse order.',
    explanation: '`[::-1]` steps backward through the entire array, reversing its sequence in O(1) time view.',
    requiredConcepts: ['slicing', 'step']
  },
  'q_slice_04': {
    id: 'q_slice_04',
    topic: 'slicing',
    difficulty: 3,
    type: 'predict_output',
    question: 'What submatrix is produced by matrix[0:2, 1:3]?',
    codeSnippet: 'import numpy as np\nm = np.array([[10, 20, 30], [40, 50, 60], [70, 80, 90]])\nprint(m[0:2, 1:3])',
    options: ['[[20 30]\n [50 60]]', '[[10 20]\n [40 50]]', '[[50 60]\n [80 90]]', '[20 30 50 60]'],
    correctAnswer: '[[20 30]\n [50 60]]',
    hint: 'Aria whispers: Rows 0 and 1; columns 1 and 2.',
    explanation: 'Rows 0:2 picks the first two rows. Columns 1:3 picks the second and third columns: `[[20, 30], [50, 60]]`.',
    requiredConcepts: ['2d-slicing', 'submatrix']
  },
  'q_slice_05': {
    id: 'q_slice_05',
    topic: 'slicing',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr[::2] extract from np.array([0, 1, 2, 3, 4, 5])?',
    options: ['[0 2 4]', '[1 3 5]', '[0 1]', '[2 4]'],
    correctAnswer: '[0 2 4]',
    hint: 'Aria whispers: Step 2 selects every second element starting at index 0.',
    explanation: '`::2` begins at index 0 and takes every second element: `0, 2, 4`.',
    requiredConcepts: ['slicing', 'step']
  },

  // Level 7: Reshaping
  'q_reshape_01': {
    id: 'q_reshape_01',
    topic: 'reshape',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the shape of arr.reshape(-1, 2) when arr contains 10 elements?',
    options: ['(5, 2)', '(2, 5)', '(10, 2)', 'ValueError'],
    correctAnswer: '(5, 2)',
    hint: 'Aria whispers: -1 tells NumPy to automatically calculate that dimension: 10 / 2 = 5 rows.',
    explanation: 'NumPy automatically computes the missing dimension: 10 total elements divided by 2 columns = 5 rows (`shape = (5, 2)`).',
    requiredConcepts: ['reshape', 'auto-dimension']
  },
  'q_reshape_02': {
    id: 'q_reshape_02',
    topic: 'reshape',
    difficulty: 2,
    type: 'find_error',
    question: 'Which reshape on an array of 12 elements will raise a ValueError?',
    options: ['arr.reshape(5, 2)', 'arr.reshape(3, 4)', 'arr.reshape(2, 6)', 'arr.reshape(12, 1)'],
    correctAnswer: 'arr.reshape(5, 2)',
    hint: 'Aria whispers: 5 * 2 = 10, which cannot accommodate 12 elements!',
    explanation: 'The product of the new shape must exactly equal the array size. 5 * 2 = 10 != 12, causing a `ValueError`.',
    requiredConcepts: ['reshape', 'size-preservation']
  },
  'q_reshape_03': {
    id: 'q_reshape_03',
    topic: 'reshape',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr.flatten() return compared to arr.ravel()?',
    options: [
      'flatten() always returns a copy; ravel() returns a view whenever possible',
      'flatten() returns a 2D matrix; ravel() returns a 1D vector',
      'ravel() deletes negative numbers',
      'Both always return copies'
    ],
    correctAnswer: 'flatten() always returns a copy; ravel() returns a view whenever possible',
    hint: 'Aria whispers: ravel() is memory-efficient because it avoids allocating new memory when data is contiguous.',
    explanation: '`flatten()` guarantees an allocated deep copy of the data, whereas `ravel()` returns a memory view whenever possible.',
    requiredConcepts: ['flatten', 'ravel', 'memory-view']
  },
  'q_reshape_04': {
    id: 'q_reshape_04',
    topic: 'reshape',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the shape of np.arange(24).reshape(2, 3, 4)?',
    options: ['(2, 3, 4)', '(4, 3, 2)', '(24,)', '(6, 4)'],
    correctAnswer: '(2, 3, 4)',
    hint: 'Aria whispers: 2 * 3 * 4 = 24 elements.',
    explanation: '2 * 3 * 4 = 24 elements, matching the total count from `np.arange(24)`.',
    requiredConcepts: ['reshape', '3d-shape']
  },

  // Level 8: Creating Special Arrays
  'q_spec_01': {
    id: 'q_spec_01',
    topic: 'creation',
    difficulty: 1,
    type: 'predict_output',
    question: 'What does np.zeros((2, 3)) create?',
    options: ['A 2-row, 3-column array of 0.0 floats', 'A 1D array with [0, 0, 0, 0, 0, 0]', 'An array of integer 0s', 'An empty list'],
    correctAnswer: 'A 2-row, 3-column array of 0.0 floats',
    hint: 'Aria whispers: By default, np.zeros() uses float64 dtype.',
    explanation: '`np.zeros((2, 3))` creates a 2x3 matrix filled with float 0.0 values.',
    requiredConcepts: ['np.zeros', 'array-creation']
  },
  'q_spec_02': {
    id: 'q_spec_02',
    topic: 'creation',
    difficulty: 1,
    type: 'predict_output',
    question: 'What array is created by np.ones(3, dtype=int)?',
    options: ['[1 1 1]', '[1. 1. 1.]', '[0 0 0]', '[[1, 1, 1]]'],
    correctAnswer: '[1 1 1]',
    hint: 'Aria whispers: Specifying dtype=int produces integer ones without decimals.',
    explanation: '`np.ones(3, dtype=int)` creates a 1D array of 3 integers: `[1 1 1]`.',
    requiredConcepts: ['np.ones', 'dtype']
  },
  'q_spec_03': {
    id: 'q_spec_03',
    topic: 'creation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.full((2, 2), 7) produce?',
    options: ['[[7 7]\n [7 7]]', '[[7. 7.]\n [7. 7.]]', '[7 7 7 7]', '[[0 7]\n [7 0]]'],
    correctAnswer: '[[7 7]\n [7 7]]',
    hint: 'Aria whispers: np.full(shape, fill_value) fills the entire matrix with fill_value.',
    explanation: '`np.full((2, 2), 7)` instantiates a 2x2 matrix with all values initialized to 7.',
    requiredConcepts: ['np.full']
  },
  'q_spec_04': {
    id: 'q_spec_04',
    topic: 'creation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is np.eye(3)?',
    options: [
      'A 3x3 identity matrix with 1.0 along the main diagonal and 0.0 elsewhere',
      'A 3-element array of ones',
      'A random 3x3 matrix',
      'An inverted 3D tensor'
    ],
    correctAnswer: 'A 3x3 identity matrix with 1.0 along the main diagonal and 0.0 elsewhere',
    hint: 'Aria whispers: eye(N) builds the N x N identity matrix.',
    explanation: '`np.eye(N)` constructs a square identity matrix with 1s on the main diagonal.',
    requiredConcepts: ['np.eye', 'identity-matrix']
  },

  // Level 9: Ranges (arange vs linspace)
  'q_range_01': {
    id: 'q_range_01',
    topic: 'ranges',
    difficulty: 1,
    type: 'predict_output',
    question: 'What does np.arange(1, 5) return?',
    options: ['[1 2 3 4]', '[1 2 3 4 5]', '[0 1 2 3 4]', '[1 3 5]'],
    correctAnswer: '[1 2 3 4]',
    hint: 'Aria whispers: Just like Python range(), np.arange(start, stop) excludes the stop value!',
    explanation: '`np.arange(1, 5)` generates integers from 1 up to 4 inclusive; 5 is excluded.',
    requiredConcepts: ['arange', 'ranges']
  },
  'q_range_02': {
    id: 'q_range_02',
    topic: 'ranges',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.linspace(0, 1, 5) produce?',
    options: ['[0.   0.25 0.5  0.75 1.  ]', '[0.  0.2 0.4 0.6 0.8]', '[0 1 2 3 4]', '[0. 0.5 1.]'],
    correctAnswer: '[0.   0.25 0.5  0.75 1.  ]',
    hint: 'Aria whispers: linspace specifies the number of points (5) and includes both start and stop!',
    explanation: '`np.linspace(start, stop, num=5)` generates 5 evenly spaced intervals between 0 and 1 inclusive.',
    requiredConcepts: ['linspace', 'samples']
  },
  'q_range_03': {
    id: 'q_range_03',
    topic: 'ranges',
    difficulty: 2,
    type: 'multiple_choice',
    question: 'When should you choose linspace over arange?',
    options: [
      'When you know the exact number of evenly spaced samples needed, especially with non-integers',
      'When you only want integer step counts',
      'When you want to exclude both start and stop points',
      'linspace is only used for integers'
    ],
    correctAnswer: 'When you know the exact number of evenly spaced samples needed, especially with non-integers',
    hint: 'Aria whispers: Floating-point steps in arange can lead to rounding surprises; linspace avoids this completely.',
    explanation: '`linspace` avoids floating-point precision accumulation issues by calculating steps based on requested sample count.',
    requiredConcepts: ['linspace', 'arange']
  },

  // ==========================================
  // WORLD 3: ARRAY POWER (LEVELS 10 - 13)
  // ==========================================

  // Level 10: Arithmetic Operations
  'q_arith_01': {
    id: 'q_arith_01',
    topic: 'math',
    difficulty: 1,
    type: 'predict_output',
    question: 'What is the result of adding two arrays: np.array([1, 2]) + np.array([10, 20])?',
    options: ['[11 22]', '[1 2 10 20]', '[[1, 2], [10, 20]]', '[10 40]'],
    correctAnswer: '[11 22]',
    hint: 'Aria whispers: NumPy performs element-wise addition: 1+10, 2+20.',
    explanation: 'Arithmetic operators on equal-shaped arrays execute element-wise: `1+10=11`, `2+20=22`.',
    requiredConcepts: ['elementwise', 'addition']
  },
  'q_arith_02': {
    id: 'q_arith_02',
    topic: 'math',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.array([2, 3, 4]) ** 2 evaluate to?',
    options: ['[ 4  9 16]', '[4 6 8]', 'TypeError', '[2 9 16]'],
    correctAnswer: '[ 4  9 16]',
    hint: 'Aria whispers: The ** operator raises every element to the specified power.',
    explanation: 'Exponentiation is vectorized: 2^2=4, 3^2=9, 4^2=16 -> `[4 9 16]`.',
    requiredConcepts: ['power', 'vectorized-math']
  },
  'q_arith_03': {
    id: 'q_arith_03',
    topic: 'math',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the remainder when calculating np.array([10, 15, 20]) % 6?',
    options: ['[4 3 2]', '[1 3 2]', '[0 3 2]', '[4 3 0]'],
    correctAnswer: '[4 3 2]',
    hint: 'Aria whispers: 10 % 6 = 4, 15 % 6 = 3, 20 % 6 = 2.',
    explanation: 'The modulo operator `%` calculates element-wise remainders: `[4, 3, 2]`.',
    requiredConcepts: ['modulo', 'math']
  },

  // Level 11: Universal Functions (ufuncs)
  'q_ufunc_01': {
    id: 'q_ufunc_01',
    topic: 'math',
    difficulty: 1,
    type: 'predict_output',
    question: 'What does np.sqrt(np.array([4, 9, 16])) return?',
    options: ['[2. 3. 4.]', '[2 3 4]', '[16 81 256]', '[1.414 3. 4.]'],
    correctAnswer: '[2. 3. 4.]',
    hint: 'Aria whispers: np.sqrt computes the element-wise square root as floating-point numbers.',
    explanation: '`np.sqrt()` evaluates the square root of each number, returning floats `[2. 3. 4.]`.',
    requiredConcepts: ['sqrt', 'ufunc']
  },
  'q_ufunc_02': {
    id: 'q_ufunc_02',
    topic: 'math',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.abs(np.array([-5, 0, 7])) return?',
    options: ['[5 0 7]', '[-5  0  7]', '[5 5 7]', '12'],
    correctAnswer: '[5 0 7]',
    hint: 'Aria whispers: Absolute value converts negative numbers to positive.',
    explanation: '`np.abs()` computes element-wise absolute magnitude: `|-5|=5`, `|0|=0`, `|7|=7`.',
    requiredConcepts: ['abs', 'ufunc']
  },
  'q_ufunc_03': {
    id: 'q_ufunc_03',
    topic: 'math',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.round(np.array([1.2, 2.7, 3.5])) return?',
    options: ['[1. 3. 4.]', '[1. 2. 3.]', '[2. 3. 4.]', '[1 3 4]'],
    correctAnswer: '[1. 3. 4.]',
    hint: 'Aria whispers: Standard rounding rounds to the nearest integer.',
    explanation: '`np.round()` rounds values to the nearest integer: 1.2 -> 1.0, 2.7 -> 3.0, 3.5 -> 4.0.',
    requiredConcepts: ['round', 'ufunc']
  },

  // Level 12: Aggregation
  'q_agg_01': {
    id: 'q_agg_01',
    topic: 'aggregation',
    difficulty: 1,
    type: 'predict_output',
    question: 'What does arr.sum() calculate for arr = np.array([10, 20, 30])?',
    options: ['60', '30', '10', '[10 20 30]'],
    correctAnswer: '60',
    hint: 'Aria whispers: 10 + 20 + 30 = 60.',
    explanation: '`arr.sum()` aggregates the sum of all elements in the array.',
    requiredConcepts: ['sum', 'aggregation']
  },
  'q_agg_02': {
    id: 'q_agg_02',
    topic: 'aggregation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr.mean() compute for arr = np.array([2, 4, 6])?',
    options: ['4.0', '12.0', '6.0', '2.0'],
    correctAnswer: '4.0',
    hint: 'Aria whispers: (2 + 4 + 6) / 3 = 4.0.',
    explanation: 'Sum is 12; count is 3; arithmetic mean is 4.0.',
    requiredConcepts: ['mean', 'aggregation']
  },
  'q_agg_03': {
    id: 'q_agg_03',
    topic: 'aggregation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.median() calculate for np.array([1, 10, 2, 9, 3])?',
    options: ['3.0', '5.0', '2.0', '10.0'],
    correctAnswer: '3.0',
    hint: 'Aria whispers: Sort the array first [1, 2, 3, 9, 10]; the middle value is 3.',
    explanation: 'Sorted values: `[1, 2, 3, 9, 10]`. The middle element is 3.0.',
    requiredConcepts: ['median', 'aggregation']
  },
  'q_agg_04': {
    id: 'q_agg_04',
    topic: 'aggregation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr.std() represent for an array?',
    options: ['Standard deviation of the values', 'Standard total distance', 'Sum divided by size squared', 'Sorted standard median'],
    correctAnswer: 'Standard deviation of the values',
    hint: 'Aria whispers: std measures the spread/dispersion of the distribution.',
    explanation: '`arr.std()` calculates the population standard deviation of elements in the array.',
    requiredConcepts: ['std', 'statistics']
  },

  // Level 13: AXIS Mastery
  'q_axis_01': {
    id: 'q_axis_01',
    topic: 'axis',
    difficulty: 2,
    type: 'predict_output',
    question: 'In a 2D array, what does matrix.sum(axis=0) sum along?',
    codeSnippet: 'import numpy as np\nm = np.array([[1, 2], [3, 4]])\nprint(m.sum(axis=0))',
    options: ['[4 6]', '[3 7]', '10', '[1 2 3 4]'],
    correctAnswer: '[4 6]',
    hint: 'Aria whispers: axis=0 collapses rows downwards, producing column totals (1+3=4, 2+4=6).',
    explanation: '`axis=0` operates downwards through the rows, collapsing them into column sums `[1+3, 2+4] = [4, 6]`.',
    requiredConcepts: ['axis0', 'aggregation']
  },
  'q_axis_02': {
    id: 'q_axis_02',
    topic: 'axis',
    difficulty: 2,
    type: 'predict_output',
    question: 'In a 2D array, what does matrix.sum(axis=1) sum along?',
    codeSnippet: 'import numpy as np\nm = np.array([[1, 2], [3, 4]])\nprint(m.sum(axis=1))',
    options: ['[3 7]', '[4 6]', '10', '[2 6]'],
    correctAnswer: '[3 7]',
    hint: 'Aria whispers: axis=1 collapses columns horizontally across each row (1+2=3, 3+4=7).',
    explanation: '`axis=1` aggregates horizontally across columns, yielding row sums `[1+2, 3+4] = [3, 7]`.',
    requiredConcepts: ['axis1', 'aggregation']
  },
  'q_axis_03': {
    id: 'q_axis_03',
    topic: 'axis',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'If a matrix has shape (5, 8), what is the shape of matrix.mean(axis=0)?',
    options: ['(8,)', '(5,)', '(5, 1)', 'scalar'],
    correctAnswer: '(8,)',
    hint: 'Aria whispers: Axis 0 collapses the 5 rows, leaving the 8 column means.',
    explanation: 'Averaging along axis 0 collapses dimension 0 (5), leaving a 1D array of 8 column means: `(8,)`.',
    requiredConcepts: ['axis-shape', 'mean']
  },

  // ==========================================
  // WORLD 4: SMART ARRAYS (LEVELS 14 - 17)
  // ==========================================

  // Level 14: Comparisons
  'q_comp_01': {
    id: 'q_comp_01',
    topic: 'comparisons',
    difficulty: 1,
    type: 'predict_output',
    question: 'What does arr > 5 evaluate to on arr = np.array([2, 5, 8])?',
    options: ['[False False  True]', '[True False True]', '[8]', 'True'],
    correctAnswer: '[False False  True]',
    hint: 'Aria whispers: Comparison operators execute element-wise, producing a boolean mask.',
    explanation: '2 > 5 is False, 5 > 5 is False, 8 > 5 is True -> `[False False True]`.',
    requiredConcepts: ['comparisons', 'boolean-mask']
  },
  'q_comp_02': {
    id: 'q_comp_02',
    topic: 'comparisons',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.all(arr > 0) return for arr = np.array([1, 2, -1])?',
    options: ['False', 'True', '[True True False]', 'Error'],
    correctAnswer: 'False',
    hint: 'Aria whispers: np.all checks if EVERY element evaluates to True.',
    explanation: 'Because `-1 > 0` is False, not all elements satisfy the condition, so `np.all()` returns `False`.',
    requiredConcepts: ['np.all', 'comparisons']
  },
  'q_comp_03': {
    id: 'q_comp_03',
    topic: 'comparisons',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.any(arr < 0) return for arr = np.array([1, 2, -1])?',
    options: ['True', 'False', '[-1]', '[False False True]'],
    correctAnswer: 'True',
    hint: 'Aria whispers: np.any returns True if AT LEAST ONE element matches.',
    explanation: 'There is a negative element (-1), so `np.any()` evaluates to `True`.',
    requiredConcepts: ['np.any', 'comparisons']
  },

  // Level 15: Boolean Indexing
  'q_bool_01': {
    id: 'q_bool_01',
    topic: 'boolean_indexing',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr[arr > 10] return for arr = np.array([5, 12, 8, 20])?',
    options: ['[12 20]', '[False  True False  True]', '[20 12]', '[5 8]'],
    correctAnswer: '[12 20]',
    hint: 'Aria whispers: Indexing an array with a boolean mask filters out only elements where the mask is True.',
    explanation: 'Only 12 and 20 are strictly greater than 10. Boolean indexing filters to `[12 20]`.',
    requiredConcepts: ['boolean_indexing', 'filter']
  },
  'q_bool_02': {
    id: 'q_bool_02',
    topic: 'boolean_indexing',
    difficulty: 3,
    type: 'predict_output',
    question: 'How do you combine multiple conditions in NumPy boolean indexing?',
    codeSnippet: 'import numpy as np\narr = np.array([5, 12, 18, 25])\nprint(arr[(arr > 10) & (arr < 20)])',
    options: ['[12 18]', '[5 25]', 'SyntaxError: use "and"', '[12]'],
    correctAnswer: '[12 18]',
    hint: 'Aria whispers: In NumPy, use bitwise & for element-wise AND, wrapped in parentheses.',
    explanation: 'NumPy uses `&` (and `|` for OR, `~` for NOT) because Python `and`/`or` evaluate truthiness on the whole array object rather than element-wise.',
    requiredConcepts: ['boolean_indexing', 'bitwise-operators']
  },
  'q_bool_03': {
    id: 'q_bool_03',
    topic: 'boolean_indexing',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does ~ (tilde) do in boolean indexing?',
    codeSnippet: 'import numpy as np\nmask = np.array([True, False, True])\nprint(~mask)',
    options: ['[False  True False]', '[True True True]', 'Error: unsupported operator', '[False False False]'],
    correctAnswer: '[False  True False]',
    hint: 'Aria whispers: ~ inverts booleans (True becomes False, False becomes True).',
    explanation: '`~` is the bitwise NOT operator in NumPy, inverting every boolean in the mask.',
    requiredConcepts: ['boolean_indexing', 'not-operator']
  },

  // Level 16: np.where()
  'q_where_01': {
    id: 'q_where_01',
    topic: 'np_where',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.where(scores >= 60, "Pass", "Fail") produce for scores = np.array([50, 75])?',
    options: ["['Fail' 'Pass']", "['Pass' 'Fail']", "['Pass' 'Pass']", '[75]'],
    correctAnswer: "['Fail' 'Pass']",
    hint: 'Aria whispers: np.where(condition, if_true, if_false) applies element-wise conditional substitution.',
    explanation: '50 is < 60 so it becomes "Fail"; 75 is >= 60 so it becomes "Pass". Result: `[\'Fail\' \'Pass\']`.',
    requiredConcepts: ['np.where', 'conditional']
  },
  'q_where_02': {
    id: 'q_where_02',
    topic: 'np_where',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does np.where(condition) return when ONLY the condition is supplied?',
    codeSnippet: 'import numpy as np\narr = np.array([10, 0, 30])\nprint(np.where(arr > 0)[0])',
    options: ['[0 2]', '[10 30]', '[True False True]', '(3,)'],
    correctAnswer: '[0 2]',
    hint: 'Aria whispers: With one argument, np.where returns the indices where condition is True!',
    explanation: '`np.where(cond)` returns a tuple of coordinate arrays for the matching indices. Here, indices 0 and 2 are > 0.',
    requiredConcepts: ['np.where', 'index-extraction']
  },
  'q_where_03': {
    id: 'q_where_03',
    topic: 'np_where',
    difficulty: 2,
    type: 'code_fill',
    question: 'How do you replace all negative numbers in an array with zero using np.where()?',
    options: ['np.where(arr < 0, 0, arr)', 'np.where(arr < 0, arr, 0)', 'arr[arr < 0] = None', 'np.replace(arr < 0, 0)'],
    correctAnswer: 'np.where(arr < 0, 0, arr)',
    hint: 'Aria whispers: If arr < 0, substitute 0, else keep arr unchanged.',
    explanation: '`np.where(arr < 0, 0, arr)` substitutes 0 where true, and keeps the original value elsewhere.',
    requiredConcepts: ['np.where', 'replacement']
  },

  // Level 17: Conditional Data Processing
  'q_cond_01': {
    id: 'q_cond_01',
    topic: 'data_processing',
    difficulty: 3,
    type: 'dataset_mission',
    question: 'Given an array of student marks, how many students scored 80 or higher?',
    codeSnippet: 'import numpy as np\nmarks = np.array([65, 82, 90, 45, 88, 72])\nprint((marks >= 80).sum())',
    options: ['3', '4', '2', '5'],
    correctAnswer: '3',
    hint: 'Aria whispers: Summing a boolean mask counts the number of True values (82, 90, 88).',
    explanation: 'In Python, True evaluates to 1 and False evaluates to 0. `(marks >= 80).sum()` counts how many values meet the criteria: 3.',
    requiredConcepts: ['data_processing', 'boolean-sum']
  },
  'q_cond_02': {
    id: 'q_cond_02',
    topic: 'data_processing',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is the average of scores that are strictly above 50?',
    codeSnippet: 'import numpy as np\nscores = np.array([30, 60, 80, 40])\nprint(scores[scores > 50].mean())',
    options: ['70.0', '52.5', '60.0', '80.0'],
    correctAnswer: '70.0',
    hint: 'Aria whispers: Scores > 50 are [60, 80]. (60 + 80) / 2 = 70.0.',
    explanation: 'Filtered elements are `[60, 80]`. The mean is `(60 + 80) / 2 = 70.0`.',
    requiredConcepts: ['data_processing', 'filtered-mean']
  },

  // ==========================================
  // WORLD 5: BROADCASTING (LEVELS 18 - 20)
  // ==========================================

  // Level 18: Broadcasting Fundamentals
  'q_bcast_01': {
    id: 'q_bcast_01',
    topic: 'broadcasting',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the result of adding a 1D row array [10, 20] to a 2x2 matrix [[1, 2], [3, 4]]?',
    options: ['[[11 22]\n [13 24]]', '[[11 12]\n [23 24]]', 'ValueError: incompatible shapes', '[11 22 13 24]'],
    correctAnswer: '[[11 22]\n [13 24]]',
    hint: 'Aria whispers: The row [10, 20] broadcasts across both rows of the matrix.',
    explanation: 'Row 0: [1+10, 2+20] = [11, 22]. Row 1: [3+10, 4+20] = [13, 24].',
    requiredConcepts: ['broadcasting', '2d-1d-broadcast']
  },
  'q_bcast_02': {
    id: 'q_bcast_02',
    topic: 'broadcasting',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'Can an array of shape (5, 3) broadcast with an array of shape (5, 1)?',
    options: ['Yes, resulting in shape (5, 3)', 'No, because 3 and 1 cannot match', 'Yes, resulting in shape (5, 5)', 'No, dimensions must be identical'],
    correctAnswer: 'Yes, resulting in shape (5, 3)',
    hint: 'Aria whispers: The dimension of size 1 stretches to match size 3.',
    explanation: 'NumPy compares dimensions from right to left: 3 vs 1 is compatible (1 stretches to 3); 5 vs 5 is equal. Result shape: `(5, 3)`.',
    requiredConcepts: ['broadcasting', 'shape-compatibility']
  },

  // Level 19: Broadcasting Rules
  'q_bcast_rules_01': {
    id: 'q_bcast_rules_01',
    topic: 'broadcasting',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'Which of the following shape pairs CANNOT broadcast together?',
    options: ['(4, 3) and (4, 2)', '(3, 1) and (1, 5)', '(2, 3, 4) and (3, 4)', '(1, 6) and (6,)'],
    correctAnswer: '(4, 3) and (4, 2)',
    hint: 'Aria whispers: Trailing dimensions 3 and 2 are different and neither is 1.',
    explanation: 'Comparing trailing dimensions from right: 3 vs 2. Neither is 1, so broadcasting fails with a ValueError.',
    requiredConcepts: ['broadcasting-rules']
  },
  'q_bcast_rules_02': {
    id: 'q_bcast_rules_02',
    topic: 'broadcasting',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the resulting shape when broadcasting (4, 1) with (1, 7)?',
    options: ['(4, 7)', '(7, 4)', '(4, 1, 7)', 'ValueError'],
    correctAnswer: '(4, 7)',
    hint: 'Aria whispers: Both 1s stretch: 4 stretches along cols, 7 stretches along rows.',
    explanation: 'Row dimension expands to 4, column dimension expands to 7. Result is `(4, 7)`.',
    requiredConcepts: ['broadcasting-rules', 'outer-product-shape']
  },

  // Level 20: Broadcasting Boss
  'q_bcast_boss_01': {
    id: 'q_bcast_boss_01',
    topic: 'broadcasting',
    difficulty: 4,
    type: 'boss_challenge',
    question: 'To normalize a (100, 3) dataset by subtracting each column mean, what shape must the mean vector be?',
    options: ['(3,)', '(100,)', '(100, 1)', '(1, 100)'],
    correctAnswer: '(3,)',
    hint: 'Aria whispers: There are 3 columns, so computing mean(axis=0) gives shape (3,), which broadcasts across all 100 rows.',
    explanation: '`data.mean(axis=0)` has shape `(3,)`. It broadcasts against `(100, 3)` by matching the trailing dimension.',
    requiredConcepts: ['broadcasting-normalization', 'boss']
  },
  'q_bcast_boss_02': {
    id: 'q_bcast_boss_02',
    topic: 'broadcasting',
    difficulty: 4,
    type: 'boss_challenge',
    question: 'What is the output of np.arange(3).reshape(3, 1) * np.arange(3)?',
    options: [
      '[[0 0 0]\n [0 1 2]\n [0 2 4]]',
      '[0 1 4]',
      '[[0 1 2]\n [0 1 2]\n [0 1 2]]',
      'ValueError'
    ],
    correctAnswer: '[[0 0 0]\n [0 1 2]\n [0 2 4]]',
    hint: 'Aria whispers: Shape (3, 1) times shape (3,) produces an outer multiplication table of shape (3, 3)!',
    explanation: 'This computes the outer multiplication table: row 0 is 0 * [0,1,2] = [0,0,0], row 1 is 1 * [0,1,2] = [0,1,2], row 2 is 2 * [0,1,2] = [0,2,4].',
    requiredConcepts: ['outer-product', 'broadcasting']
  },

  // ==========================================
  // WORLD 6: ARRAY MANIPULATION (LEVELS 21 - 25)
  // ==========================================

  // Level 21: Concatenation
  'q_concat_01': {
    id: 'q_concat_01',
    topic: 'manipulation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the output of np.concatenate([a, b]) for a = [1, 2] and b = [3, 4]?',
    options: ['[1 2 3 4]', '[[1 2], [3 4]]', '[4 6]', '[[1 3], [2 4]]'],
    correctAnswer: '[1 2 3 4]',
    hint: 'Aria whispers: 1D concatenation joins arrays end-to-end.',
    explanation: '`np.concatenate` joins sequences along an existing axis, resulting in `[1 2 3 4]`.',
    requiredConcepts: ['concatenate']
  },
  'q_concat_02': {
    id: 'q_concat_02',
    topic: 'manipulation',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the shape of np.concatenate([m1, m2], axis=1) when both have shape (3, 4)?',
    options: ['(3, 8)', '(6, 4)', '(3, 4, 2)', '(7, 4)'],
    correctAnswer: '(3, 8)',
    hint: 'Aria whispers: axis=1 joins columns horizontally (4 + 4 = 8).',
    explanation: 'Concatenating along axis 1 leaves rows unchanged (3) and adds column widths: 4 + 4 = 8 -> `(3, 8)`.',
    requiredConcepts: ['concatenate', 'axis1']
  },

  // Level 22: Stack
  'q_stack_01': {
    id: 'q_stack_01',
    topic: 'manipulation',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'Unlike concatenate(), what does np.stack([a, b]) do to the dimensions?',
    options: [
      'It creates a new axis and increases ndim by 1',
      'It always flattens both arrays to 1D',
      'It deletes duplicate numbers',
      'It performs element-wise addition'
    ],
    correctAnswer: 'It creates a new axis and increases ndim by 1',
    hint: 'Aria whispers: stack introduces a brand new axis, turning two 1D arrays into a 2D array.',
    explanation: '`np.stack` joins arrays along a NEW axis. Two 1D arrays of shape (4,) become shape (2, 4).',
    requiredConcepts: ['stack', 'new-axis']
  },

  // Level 23: vstack & hstack
  'q_vhstack_01': {
    id: 'q_vhstack_01',
    topic: 'manipulation',
    difficulty: 2,
    type: 'shape_prediction',
    question: 'What is the difference between np.vstack() and np.hstack()?',
    options: [
      'vstack stacks vertically (row-wise); hstack stacks horizontally (column-wise)',
      'vstack works only on 3D arrays; hstack works on 1D',
      'vstack sorts numbers; hstack reverses numbers',
      'They are identical aliases'
    ],
    correctAnswer: 'vstack stacks vertically (row-wise); hstack stacks horizontally (column-wise)',
    hint: 'Aria whispers: v stands for vertical (rows), h stands for horizontal (columns).',
    explanation: '`np.vstack` stacks arrays vertically on top of each other; `np.hstack` attaches them side-by-side.',
    requiredConcepts: ['vstack', 'hstack']
  },

  // Level 24: Splitting
  'q_split_01': {
    id: 'q_split_01',
    topic: 'manipulation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.split(np.arange(6), 3) return?',
    options: [
      '[array([0, 1]), array([2, 3]), array([4, 5])]',
      '[array([0, 3]), array([1, 4]), array([2, 5])]',
      '[array([0, 1, 2]), array([3, 4, 5])]',
      'ValueError'
    ],
    correctAnswer: '[array([0, 1]), array([2, 3]), array([4, 5])]',
    hint: 'Aria whispers: 6 elements divided into 3 equal parts = 2 elements per sub-array.',
    explanation: '`np.split(arr, 3)` divides the 6 elements into 3 equal sub-arrays of 2 elements each.',
    requiredConcepts: ['split']
  },

  // Level 25: Sorting
  'q_sort_01': {
    id: 'q_sort_01',
    topic: 'sorting',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.argsort(np.array([30, 10, 20])) return?',
    options: ['[1 2 0]', '[10 20 30]', '[0 1 2]', '[2 1 0]'],
    correctAnswer: '[1 2 0]',
    hint: 'Aria whispers: argsort returns the INDICES that would sort the array, not the values themselves!',
    explanation: 'Smallest value 10 is at index 1; then 20 is at index 2; largest 30 is at index 0. Result: `[1, 2, 0]`.',
    requiredConcepts: ['argsort', 'sorting-indices']
  },

  // ==========================================
  // WORLD 7: MEMORY AND STRUCTURE (LEVELS 26 - 28)
  // ==========================================

  // Level 26: Copy vs View
  'q_copyview_01': {
    id: 'q_copyview_01',
    topic: 'memory',
    difficulty: 3,
    type: 'predict_output',
    question: 'What happens to the original array when you modify a slice view?',
    codeSnippet: 'import numpy as np\na = np.array([1, 2, 3])\nb = a[:2]\nb[0] = 99\nprint(a[0])',
    options: ['99', '1', 'Error: slice is locked', 'None'],
    correctAnswer: '99',
    hint: 'Aria whispers: Slices in NumPy are VIEWS into the same memory, not copies! Modifying b modifies a.',
    explanation: 'In NumPy, basic slicing creates a view that shares memory with the original array. Modifying `b` directly mutates `a`.',
    requiredConcepts: ['copy-vs-view', 'memory-sharing']
  },
  'q_copyview_02': {
    id: 'q_copyview_02',
    topic: 'memory',
    difficulty: 3,
    type: 'predict_output',
    question: 'How do you check if an array owns its memory or is a view of another array?',
    options: ['Check if arr.base is not None', 'Check arr.is_view()', 'Check arr.memory_id', 'Check arr.pointer == 0'],
    correctAnswer: 'Check if arr.base is not None',
    hint: 'Aria whispers: arr.base points to the original owner array if arr is a view.',
    explanation: 'If an array is a view, its `.base` attribute references the base array. If it owns its memory, `.base` is `None`.',
    requiredConcepts: ['base', 'view-inspection']
  },

  // Level 27: Transpose
  'q_trans_01': {
    id: 'q_trans_01',
    topic: 'transpose',
    difficulty: 2,
    type: 'shape_prediction',
    question: 'What is the shape of arr.T when arr has shape (3, 7)?',
    options: ['(7, 3)', '(3, 7)', '(21,)', '(1, 21)'],
    correctAnswer: '(7, 3)',
    hint: 'Aria whispers: Transpose swaps axes, flipping rows into columns.',
    explanation: 'Transposing a 2D matrix swaps its dimensions: (3, 7) becomes (7, 3).',
    requiredConcepts: ['transpose', 'shape']
  },

  // Level 28: Advanced Reshaping
  'q_advshape_01': {
    id: 'q_advshape_01',
    topic: 'advanced_reshape',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does np.squeeze() do to an array of shape (1, 5, 1)?',
    options: ['Reduces shape to (5,)', 'Reshapes to (1, 5)', 'Flattens to size 1', 'ValueError'],
    correctAnswer: 'Reduces shape to (5,)',
    hint: 'Aria whispers: np.squeeze strips away single-dimensional entry axes.',
    explanation: '`np.squeeze()` removes all dimensions of length 1, compressing shape (1, 5, 1) down to (5,).',
    requiredConcepts: ['squeeze', 'dimension-removal']
  },

  // ==========================================
  // WORLD 8: RANDOM NUMPY (LEVELS 29 - 30)
  // ==========================================

  // Level 29: Random Numbers
  'q_rand_01': {
    id: 'q_rand_01',
    topic: 'random',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the recommended modern NumPy API for generating pseudo-random numbers?',
    options: [
      'np.random.default_rng()',
      'np.random.legacy_random()',
      'np.random.rand_generator()',
      'np.math.random()'
    ],
    correctAnswer: 'np.random.default_rng()',
    hint: 'Aria whispers: default_rng() initializes the modern PCG64 Generator.',
    explanation: 'Since NumPy 1.17, `np.random.default_rng()` is the official, superior generator replacing legacy functions.',
    requiredConcepts: ['default_rng', 'modern-random']
  },
  'q_rand_02': {
    id: 'q_rand_02',
    topic: 'random',
    difficulty: 2,
    type: 'predict_output',
    question: 'What range of integers does rng.integers(1, 7) sample from (like a 6-sided die)?',
    options: ['1 to 6 inclusive', '1 to 7 inclusive', '0 to 6 inclusive', '0 to 7 exclusive'],
    correctAnswer: '1 to 6 inclusive',
    hint: 'Aria whispers: The upper endpoint 7 is exclusive in rng.integers(low, high).',
    explanation: '`rng.integers(low, high)` samples uniformly from `[low, high)`. So `1, 7` samples integers `1, 2, 3, 4, 5, 6`.',
    requiredConcepts: ['integers', 'die-simulation']
  },

  // Level 30: Random Data Problems
  'q_randdata_01': {
    id: 'q_randdata_01',
    topic: 'random',
    difficulty: 3,
    type: 'predict_output',
    question: 'What function randomly permutes the elements of an array in-place?',
    options: ['rng.shuffle(arr)', 'rng.permute(arr)', 'rng.mix(arr)', 'arr.scramble()'],
    correctAnswer: 'rng.shuffle(arr)',
    hint: 'Aria whispers: shuffle modifies the array in-place along the first axis.',
    explanation: '`rng.shuffle(arr)` modifies the sequence in-place, whereas `rng.permutation(arr)` returns a shuffled copy.',
    requiredConcepts: ['shuffle', 'permutation']
  },

  // ==========================================
  // WORLD 9: LINEAR ALGEBRA (LEVELS 31 - 33)
  // ==========================================

  // Level 31: Matrix Operations
  'q_matops_01': {
    id: 'q_matops_01',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is the difference between A * B and A @ B in NumPy?',
    options: [
      'A * B is element-wise multiplication; A @ B is matrix multiplication',
      'A * B is matrix multiplication; A @ B is dot product only',
      'A @ B raises an error in Python 3',
      'Both are identical aliases'
    ],
    correctAnswer: 'A * B is element-wise multiplication; A @ B is matrix multiplication',
    hint: 'Aria whispers: The @ operator performs true linear algebraic matrix multiplication.',
    explanation: '`*` executes Hadamard element-wise multiplication, while `@` (Python 3.5+) performs matrix multiplication.',
    requiredConcepts: ['matrix-multiplication', 'matmul-operator']
  },

  // Level 32: np.dot vs np.matmul
  'q_dot_01': {
    id: 'q_dot_01',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is the dot product of np.array([1, 2, 3]) and np.array([4, 5, 6])?',
    options: ['32', '28', '[4 10 18]', '15'],
    correctAnswer: '32',
    hint: 'Aria whispers: 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32.',
    explanation: 'The inner dot product of two 1D vectors is `(1*4) + (2*5) + (3*6) = 4 + 10 + 18 = 32`.',
    requiredConcepts: ['dot-product', 'inner-product']
  },

  // Level 33: Linear Algebra
  'q_linalg_01': {
    id: 'q_linalg_01',
    topic: 'linear_algebra',
    difficulty: 4,
    type: 'predict_output',
    question: 'Which submodule contains determinant, matrix inversion, and eigenvalue solvers?',
    options: ['np.linalg', 'np.matrix', 'np.algebra', 'np.math.linear'],
    correctAnswer: 'np.linalg',
    hint: 'Aria whispers: np.linalg stands for Linear Algebra.',
    explanation: '`np.linalg` provides standard LAPACK linear algebra routines (`det`, `inv`, `eig`, `solve`).',
    requiredConcepts: ['linalg', 'lapack']
  },
  'q_linalg_02': {
    id: 'q_linalg_02',
    topic: 'linear_algebra',
    difficulty: 4,
    type: 'predict_output',
    question: 'What is the determinant of identity matrix np.eye(4)?',
    options: ['1.0', '4.0', '0.0', '16.0'],
    correctAnswer: '1.0',
    hint: 'Aria whispers: The determinant of any identity matrix is exactly 1.',
    explanation: '`np.linalg.det(np.eye(4))` evaluates to 1.0 because the diagonal product of an identity matrix is 1.',
    requiredConcepts: ['det', 'identity']
  },

  // ==========================================
  // WORLD 10: REAL DATA HANDLING (LEVELS 34 - 36)
  // ==========================================

  // Level 34: NaN
  'q_nan_01': {
    id: 'q_nan_01',
    topic: 'nan_handling',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.mean(np.array([10, 20, np.nan])) return?',
    options: ['nan', '15.0', '10.0', 'Error'],
    correctAnswer: 'nan',
    hint: 'Aria whispers: Standard math operations propagate NaN (Not a Number)!',
    explanation: 'Any arithmetic operation involving `np.nan` produces `nan`. To ignore NaNs, use `np.nanmean()`.',
    requiredConcepts: ['nan', 'nan-propagation']
  },
  'q_nan_02': {
    id: 'q_nan_02',
    topic: 'nan_handling',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.nanmean(np.array([10, 20, np.nan])) return?',
    options: ['15.0', 'nan', '10.0', '30.0'],
    correctAnswer: '15.0',
    hint: 'Aria whispers: nanmean calculates the mean while safely ignoring NaN values: (10 + 20) / 2 = 15.0.',
    explanation: '`np.nanmean()` ignores missing `nan` entries and computes the mean of the remaining valid numbers.',
    requiredConcepts: ['nanmean', 'safe-stats']
  },

  // Level 35: Missing Data
  'q_miss_01': {
    id: 'q_miss_01',
    topic: 'missing_data',
    difficulty: 3,
    type: 'predict_output',
    question: 'Why does np.nan == np.nan evaluate to False in Python?',
    options: [
      'By IEEE 754 standard, NaN is never equal to anything, including itself',
      'It is a bug in NumPy',
      'Because np.nan is a string',
      'It evaluates to True'
    ],
    correctAnswer: 'By IEEE 754 standard, NaN is never equal to anything, including itself',
    hint: 'Aria whispers: Always use np.isnan(arr) to check for missing values, never arr == np.nan!',
    explanation: 'Under IEEE 754 floating point standard, `NaN != NaN`. Therefore, you must use `np.isnan(arr)`.',
    requiredConcepts: ['ieee754', 'isnan']
  },
  'q_miss_02': {
    id: 'q_miss_02',
    topic: 'missing_data',
    difficulty: 3,
    type: 'code_fill',
    question: 'How do you replace all NaN values with 0 in an array in-place?',
    options: ['arr[np.isnan(arr)] = 0', 'arr[arr == np.nan] = 0', 'arr.fillna(0)', 'np.clean(arr, 0)'],
    correctAnswer: 'arr[np.isnan(arr)] = 0',
    hint: 'Aria whispers: Combine boolean mask np.isnan(arr) with index assignment = 0.',
    explanation: '`arr[np.isnan(arr)] = 0` creates a boolean mask of missing entries and replaces them with 0.',
    requiredConcepts: ['isnan', 'imputation']
  },

  // Level 36: Real Dataset Processing
  'q_dataset_01': {
    id: 'q_dataset_01',
    topic: 'real_datasets',
    difficulty: 3,
    type: 'dataset_mission',
    question: 'In a temperature sensor reading array, how do you find the maximum temperature ignoring sensor errors (NaN)?',
    codeSnippet: 'import numpy as np\ntemps = np.array([22.4, 25.1, np.nan, 28.3, 19.0])\nprint(np.nanmax(temps))',
    options: ['28.3', 'nan', '25.1', '22.4'],
    correctAnswer: '28.3',
    hint: 'Aria whispers: np.nanmax ignores NaNs and finds the highest valid reading.',
    explanation: '`np.nanmax()` safely ignores the sensor error `np.nan` and returns the highest temperature `28.3`.',
    requiredConcepts: ['nanmax', 'sensor-analytics']
  },

  // ==========================================
  // WORLD 11: NUMPY PERFORMANCE (LEVELS 37 - 38)
  // ==========================================

  // Level 37: Vectorization
  'q_vec_01': {
    id: 'q_vec_01',
    topic: 'performance',
    difficulty: 2,
    type: 'multiple_choice',
    question: 'Why is vectorization faster than an equivalent Python for-loop?',
    options: [
      'It pushes execution into pre-compiled C loops and leverages CPU SIMD registers',
      'It creates multiple threads automatically in the cloud',
      'It skips floating-point division',
      'It compresses memory into zip files'
    ],
    correctAnswer: 'It pushes execution into pre-compiled C loops and leverages CPU SIMD registers',
    hint: 'Aria whispers: Vectorized C loops avoid Python bytecode interpreter overhead per element.',
    explanation: 'Vectorized operations execute directly in compiled C with minimal interpreter overhead and SIMD register parallelization.',
    requiredConcepts: ['vectorization', 'c-speed']
  },

  // Level 38: Python Lists vs NumPy
  'q_perf_01': {
    id: 'q_perf_01',
    topic: 'performance',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'What is the primary memory difference between a Python list of integers and an int64 NumPy array?',
    options: [
      'Python lists store pointers to heap integer objects; NumPy stores contiguous raw 8-byte numbers',
      'Python lists are compressed; NumPy is uncompressed',
      'NumPy arrays are stored on disk; Python lists in RAM',
      'There is no memory difference'
    ],
    correctAnswer: 'Python lists store pointers to heap integer objects; NumPy stores contiguous raw 8-byte numbers',
    hint: 'Aria whispers: Pointer indirection in lists causes cache misses, while contiguous arrays load into CPU L1/L2 cache lines.',
    explanation: 'Each Python integer is an object with reference count and type pointers (28 bytes). NumPy stores raw 8-byte integers contiguously in memory.',
    requiredConcepts: ['memory-layout', 'pointer-indirection']
  },

  // ==========================================
  // WORLD 12: ADVANCED NUMPY & FINAL MASTERY (LEVELS 39 - 42)
  // ==========================================

  // Level 39: Advanced & Fancy Indexing
  'q_advidx_01': {
    id: 'q_advidx_01',
    topic: 'advanced',
    difficulty: 4,
    type: 'predict_output',
    question: 'What does arr[[0, 2]] return for arr = np.array([10, 20, 30, 40])?',
    options: ['[10 30]', '[20 40]', '[[10 20], [30 40]]', '[10 20 30]'],
    correctAnswer: '[10 30]',
    hint: 'Aria whispers: Passing a list of integers (fancy indexing) extracts elements at those specific indices.',
    explanation: 'Integer array indexing selects elements at index 0 (10) and index 2 (30): `[10 30]`.',
    requiredConcepts: ['fancy-indexing']
  },
  'q_advidx_02': {
    id: 'q_advidx_02',
    topic: 'advanced',
    difficulty: 4,
    type: 'predict_output',
    question: 'Does fancy integer indexing return a view or a copy?',
    options: ['Always a copy', 'Always a view', 'A view if elements are adjacent', 'Depends on dtype'],
    correctAnswer: 'Always a copy',
    hint: 'Aria whispers: Unlike basic slices which return views, fancy indexing always creates a brand new copy!',
    explanation: 'Basic slicing `arr[1:3]` returns a view, but fancy/advanced indexing `arr[[0, 2]]` allocates and returns a copy.',
    requiredConcepts: ['fancy-indexing', 'copy-behavior']
  },

  // Level 40: Dimension Manipulation
  'q_dim_01': {
    id: 'q_dim_01',
    topic: 'advanced',
    difficulty: 4,
    type: 'shape_prediction',
    question: 'What does arr[:, np.newaxis] do to a 1D array of shape (5,)?',
    options: ['Transforms shape to (5, 1)', 'Transforms shape to (1, 5)', 'Flattens it to (1,)', 'ValueError'],
    correctAnswer: 'Transforms shape to (5, 1)',
    hint: 'Aria whispers: np.newaxis increases dimension by adding a length-1 axis at that position.',
    explanation: 'Inserting `np.newaxis` at column position transforms a 1D vector `(5,)` into a 2D column vector `(5, 1)`.',
    requiredConcepts: ['np.newaxis', 'dimension-expansion']
  },
  'q_dim_02': {
    id: 'q_dim_02',
    topic: 'advanced',
    difficulty: 4,
    type: 'predict_output',
    question: 'What does np.expand_dims(arr, axis=0) produce for an array of shape (3, 4)?',
    options: ['(1, 3, 4)', '(3, 1, 4)', '(3, 4, 1)', '(4, 3)'],
    correctAnswer: '(1, 3, 4)',
    hint: 'Aria whispers: axis=0 inserts the new dimension at the very front.',
    explanation: '`np.expand_dims(arr, axis=0)` prepends a new dimension of size 1: `(1, 3, 4)`.',
    requiredConcepts: ['expand_dims']
  },

  // Level 41: Numerical Algorithms & Utilities
  'q_algo_01': {
    id: 'q_algo_01',
    topic: 'advanced',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does np.clip(np.array([2, 7, 15]), 5, 10) return?',
    options: ['[ 5  7 10]', '[ 2  7 10]', '[ 5  7 15]', '[ 0  7 10]'],
    correctAnswer: '[ 5  7 10]',
    hint: 'Aria whispers: clip constrains numbers between the minimum (5) and maximum (10).',
    explanation: 'Values below 5 are clamped to 5 (2 -> 5), and values above 10 are clamped to 10 (15 -> 10): `[5 7 10]`.',
    requiredConcepts: ['clip']
  },
  'q_algo_02': {
    id: 'q_algo_02',
    topic: 'advanced',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does np.unique(np.array([3, 1, 2, 3, 1])) return?',
    options: ['[1 2 3]', '[3 1 2]', '[3 1 2 3 1]', '[1 1 2 3 3]'],
    correctAnswer: '[1 2 3]',
    hint: 'Aria whispers: np.unique finds sorted unique values without duplicates.',
    explanation: '`np.unique()` returns the sorted unique elements with duplicates removed: `[1 2 3]`.',
    requiredConcepts: ['unique']
  },
  'q_algo_03': {
    id: 'q_algo_03',
    topic: 'advanced',
    difficulty: 4,
    type: 'predict_output',
    question: 'What does np.cumsum(np.array([1, 2, 3, 4])) compute?',
    options: ['[ 1  3  6 10]', '[10 10 10 10]', '[ 1  2  6 24]', '10'],
    correctAnswer: '[ 1  3  6 10]',
    hint: 'Aria whispers: cumsum calculates the cumulative sum along the array: 1, 1+2=3, 3+3=6, 6+4=10.',
    explanation: '`np.cumsum()` computes cumulative sums: `[1, 1+2=3, 3+3=6, 6+4=10]`.',
    requiredConcepts: ['cumsum']
  },

  // Level 42: The Final NumPy Guardian (Culmination Boss)
  'q_guardian_01': {
    id: 'q_guardian_01',
    topic: 'mastery',
    difficulty: 5,
    type: 'boss_challenge',
    question: 'FINAL GUARDIAN: What is the sum of even numbers after reshaping np.arange(12) into a (3, 4) matrix?',
    codeSnippet: 'import numpy as np\ngrid = np.arange(12).reshape(3, 4)\nprint(grid[grid % 2 == 0].sum())',
    options: ['30', '36', '66', '24'],
    correctAnswer: '30',
    hint: 'Aria whispers: Even numbers from 0 to 11 are 0, 2, 4, 6, 8, 10. Their sum is 30.',
    explanation: '0 + 2 + 4 + 6 + 8 + 10 = 30.',
    requiredConcepts: ['mastery-synthesis', 'boss']
  },
  'q_guardian_02': {
    id: 'q_guardian_02',
    topic: 'mastery',
    difficulty: 5,
    type: 'boss_challenge',
    question: 'FINAL GUARDIAN: If A has shape (4, 1) and B has shape (1, 5), what is the total sum of (A + B).size?',
    options: ['20', '9', '4', '5'],
    correctAnswer: '20',
    hint: 'Aria whispers: Broadcasted shape is (4, 5). Size is 4 * 5 = 20.',
    explanation: 'A (4, 1) + B (1, 5) broadcasts to shape `(4, 5)`. The total size is 4 * 5 = 20 elements.',
    requiredConcepts: ['mastery-synthesis', 'boss']
  },
  'q_guardian_03': {
    id: 'q_guardian_03',
    topic: 'mastery',
    difficulty: 5,
    type: 'boss_challenge',
    question: 'FINAL GUARDIAN: What is the result of np.dot([2, 3], [4, 5]) + np.nanmean([10, np.nan, 20])?',
    options: ['38.0', '23.0', 'nan', '40.0'],
    correctAnswer: '38.0',
    hint: 'Aria whispers: Dot product is 2*4 + 3*5 = 8 + 15 = 23. nanmean is 15.0. 23 + 15.0 = 38.0.',
    explanation: 'Dot product is `2*4 + 3*5 = 23`. Nanmean is `(10 + 20) / 2 = 15.0`. 23 + 15.0 = 38.0.',
    requiredConcepts: ['mastery-synthesis', 'boss']
  },

  // ==========================================
  // SUPPLEMENTARY QUESTIONS FOR LEVEL BALANCE
  // ==========================================

  // Level 8: Special Arrays
  'q_spec_05': {
    id: 'q_spec_05',
    topic: 'special_arrays',
    difficulty: 2,
    type: 'shape_prediction',
    question: 'What is the shape of np.eye(3, 4)?',
    options: ['(3, 4)', '(4, 3)', '(3, 3)', '(12,)'],
    correctAnswer: '(3, 4)',
    hint: 'Aria whispers: np.eye(N, M) creates an N-by-M 2D matrix with 1s along the main diagonal.',
    explanation: '`np.eye(3, 4)` returns a 2D array with 3 rows and 4 columns: `(3, 4)`.',
    requiredConcepts: ['eye', 'matrix-shape']
  },

  // Level 9: Ranges
  'q_range_04': {
    id: 'q_range_04',
    topic: 'ranges',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.arange(5, 0, -1) evaluate to?',
    options: ['[5 4 3 2 1]', '[5 4 3 2 1 0]', '[1 2 3 4 5]', 'ValueError'],
    correctAnswer: '[5 4 3 2 1]',
    hint: 'Aria whispers: Negative step counts down towards stop 0 exclusive.',
    explanation: '`arange(5, 0, -1)` steps backwards from 5 down to 1 (0 is excluded): `[5 4 3 2 1]`.',
    requiredConcepts: ['arange', 'negative-step']
  },
  'q_range_05': {
    id: 'q_range_05',
    topic: 'ranges',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the last element of np.linspace(0, 10, 5)?',
    options: ['10.0', '8.0', '9.0', '2.0'],
    correctAnswer: '10.0',
    hint: 'Aria whispers: By default, np.linspace includes the stop value.',
    explanation: '`linspace(0, 10, 5)` generates `[0., 2.5, 5., 7.5, 10.]`. The last element is 10.0.',
    requiredConcepts: ['linspace', 'endpoint']
  },

  // Level 10: Arithmetic
  'q_arith_04': {
    id: 'q_arith_04',
    topic: 'math',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the result of np.array([10, 20]) // 3 in Python?',
    options: ['[3 6]', '[3.33 6.66]', '[1 2]', '[3 6.66]'],
    correctAnswer: '[3 6]',
    hint: 'Aria whispers: Floor division // truncates decimal fractions to integer values.',
    explanation: '`10 // 3 = 3` and `20 // 3 = 6`. Floor division returns integer floor values `[3 6]`.',
    requiredConcepts: ['floor-division', 'arithmetic']
  },
  'q_arith_05': {
    id: 'q_arith_05',
    topic: 'math',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the result of np.array([2, 5]) - np.array([1, 8])?',
    options: ['[ 1 -3]', '[1 3]', '[-1  3]', '[3 13]'],
    correctAnswer: '[ 1 -3]',
    hint: 'Aria whispers: 2 - 1 = 1, and 5 - 8 = -3.',
    explanation: 'Element-wise subtraction produces `[1, -3]`.',
    requiredConcepts: ['subtraction', 'vector-arithmetic']
  },

  // Level 11: Universal Functions (ufuncs)
  'q_ufunc_04': {
    id: 'q_ufunc_04',
    topic: 'math',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.exp(0) evaluate to in NumPy?',
    options: ['1.0', '0.0', 'e', 'nan'],
    correctAnswer: '1.0',
    hint: 'Aria whispers: e^0 = 1.',
    explanation: '`np.exp(0)` calculates e raised to power 0, which is 1.0.',
    requiredConcepts: ['exp', 'ufunc']
  },
  'q_ufunc_05': {
    id: 'q_ufunc_05',
    topic: 'math',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.log10(100) evaluate to?',
    options: ['2.0', '10.0', '100.0', '1.0'],
    correctAnswer: '2.0',
    hint: 'Aria whispers: 10^2 = 100, so log10(100) = 2.0.',
    explanation: '`np.log10(100)` evaluates base-10 logarithm: 2.0.',
    requiredConcepts: ['log10', 'ufunc']
  },

  // Level 12: Aggregation
  'q_agg_05': {
    id: 'q_agg_05',
    topic: 'aggregation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr.var() calculate for an array?',
    options: ['Variance (square of standard deviation)', 'Variable count', 'Vector variance angle', 'Value range'],
    correctAnswer: 'Variance (square of standard deviation)',
    hint: 'Aria whispers: Variance measures spread and equals std() ** 2.',
    explanation: '`arr.var()` calculates population variance: the average of squared deviations from the mean.',
    requiredConcepts: ['var', 'statistics']
  },

  // Level 13: AXIS Mastery
  'q_axis_04': {
    id: 'q_axis_04',
    topic: 'axis',
    difficulty: 2,
    type: 'predict_output',
    question: 'For matrix = np.array([[10, 20], [30, 40]]), what is matrix.max(axis=0)?',
    options: ['[30 40]', '[20 40]', '40', '[10 20]'],
    correctAnswer: '[30 40]',
    hint: 'Aria whispers: axis=0 finds the maximum down each column: max(10, 30)=30, max(20, 40)=40.',
    explanation: 'Axis 0 compares rows down each column, producing `[30, 40]`.',
    requiredConcepts: ['axis0', 'max']
  },
  'q_axis_05': {
    id: 'q_axis_05',
    topic: 'axis',
    difficulty: 2,
    type: 'predict_output',
    question: 'For matrix = np.array([[10, 20], [30, 40]]), what is matrix.max(axis=1)?',
    options: ['[20 40]', '[30 40]', '40', '[10 30]'],
    correctAnswer: '[20 40]',
    hint: 'Aria whispers: axis=1 finds the maximum across each row: max(10, 20)=20, max(30, 40)=40.',
    explanation: 'Axis 1 collapses horizontally across columns: row 0 max is 20, row 1 max is 40 -> `[20, 40]`.',
    requiredConcepts: ['axis1', 'max']
  },

  // Level 14: Comparisons
  'q_comp_04': {
    id: 'q_comp_04',
    topic: 'comparisons',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does (np.array([1, 4, 7]) <= 4) return?',
    options: ['[ True  True False]', '[False  True  True]', '[1 4]', 'True'],
    correctAnswer: '[ True  True False]',
    hint: 'Aria whispers: 1 <= 4 (True), 4 <= 4 (True), 7 <= 4 (False).',
    explanation: 'Element-wise less-than-or-equal produces `[True, True, False]`.',
    requiredConcepts: ['comparisons', 'boolean']
  },
  'q_comp_05': {
    id: 'q_comp_05',
    topic: 'comparisons',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.array_equal([1, 2], [1, 2]) return?',
    options: ['True', '[True True]', '1', 'False'],
    correctAnswer: 'True',
    hint: 'Aria whispers: np.array_equal compares both shape and all elements for exact equality.',
    explanation: '`np.array_equal` returns a single scalar Boolean: `True` if shapes and elements match.',
    requiredConcepts: ['array_equal', 'comparisons']
  },

  // Level 15: Boolean Indexing
  'q_bool_04': {
    id: 'q_bool_04',
    topic: 'boolean_indexing',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does arr[arr % 2 != 0] extract from np.array([1, 2, 3, 4, 5])?',
    options: ['[1 3 5]', '[2 4]', '[False True False True False]', '9'],
    correctAnswer: '[1 3 5]',
    hint: 'Aria whispers: % 2 != 0 filters for odd numbers.',
    explanation: 'Odd numbers leave remainder 1 when divided by 2: `[1 3 5]`.',
    requiredConcepts: ['boolean_indexing', 'odd-filter']
  },
  'q_bool_05': {
    id: 'q_bool_05',
    topic: 'boolean_indexing',
    difficulty: 2,
    type: 'shape_prediction',
    question: 'What is the shape of arr[arr > 0] if arr = np.array([[-1, 2], [3, -4]])?',
    options: ['(2,)', '(2, 2)', '(1, 2)', 'scalar'],
    correctAnswer: '(2,)',
    hint: 'Aria whispers: Boolean indexing on a 2D array flattens matching elements into a 1D vector!',
    explanation: 'Only 2 and 3 match. Boolean indexing always flattens into a 1D vector of length 2: `(2,)`.',
    requiredConcepts: ['boolean_indexing', 'flattening']
  },

  // Level 16: np.where()
  'q_where_04': {
    id: 'q_where_04',
    topic: 'np_where',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.where(np.array([True, False, True]))[0] return?',
    options: ['[0 2]', '[1]', '[True False True]', '[0 1 2]'],
    correctAnswer: '[0 2]',
    hint: 'Aria whispers: With one argument, np.where returns index coordinates of True values.',
    explanation: 'True values are at indices 0 and 2. Result is `[0 2]`.',
    requiredConcepts: ['np.where', 'indices']
  },
  'q_where_05': {
    id: 'q_where_05',
    topic: 'np_where',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the result of np.where(np.array([5, 15]) > 10, 100, 0)?',
    options: ['[  0 100]', '[100   0]', '[5 15]', '[0 0]'],
    correctAnswer: '[  0 100]',
    hint: 'Aria whispers: 5 > 10 is False (0), 15 > 10 is True (100).',
    explanation: 'Condition evaluates to `[False, True]`, yielding `[0, 100]`.',
    requiredConcepts: ['np.where', 'ternary']
  },

  // Level 17: Conditional Data Processing
  'q_cond_03': {
    id: 'q_cond_03',
    topic: 'data_processing',
    difficulty: 3,
    type: 'predict_output',
    question: 'Given prices = np.array([10, 50, 120, 30]), how many prices exceed 40?',
    options: ['2', '1', '3', '4'],
    correctAnswer: '2',
    hint: 'Aria whispers: (prices > 40).sum() counts prices 50 and 120.',
    explanation: 'Only 50 and 120 are strictly greater than 40. The count is 2.',
    requiredConcepts: ['data_processing', 'threshold-counting']
  },
  'q_cond_04': {
    id: 'q_cond_04',
    topic: 'data_processing',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is the sum of negative numbers in np.array([-5, 10, -15, 20])?',
    options: ['-20', '-5', '-15', '10'],
    correctAnswer: '-20',
    hint: 'Aria whispers: arr[arr < 0].sum() sums -5 and -15.',
    explanation: 'Negative numbers are `[-5, -15]`. Their sum is `-20`.',
    requiredConcepts: ['data_processing', 'conditional-sum']
  },
  'q_cond_05': {
    id: 'q_cond_05',
    topic: 'data_processing',
    difficulty: 3,
    type: 'code_fill',
    question: 'How do you clip extreme outliers in arr to a maximum ceiling of 100 without using np.clip?',
    options: ['np.where(arr > 100, 100, arr)', 'np.where(arr > 100, arr, 100)', 'arr[arr > 100] = None', 'arr.cap(100)'],
    correctAnswer: 'np.where(arr > 100, 100, arr)',
    hint: 'Aria whispers: If arr > 100, replace with 100, else keep arr.',
    explanation: '`np.where(arr > 100, 100, arr)` substitutes 100 for all values above 100.',
    requiredConcepts: ['data_processing', 'clipping']
  },

  // Level 18: Broadcasting Fundamentals
  'q_bcast_03': {
    id: 'q_bcast_03',
    topic: 'broadcasting',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What shape results from adding shape (8, 1, 6) and shape (1, 5, 1)?',
    options: ['(8, 5, 6)', '(8, 1, 6)', '(1, 5, 6)', 'ValueError'],
    correctAnswer: '(8, 5, 6)',
    hint: 'Aria whispers: Compare dimensions from right: 6 vs 1 -> 6, 1 vs 5 -> 5, 8 vs 1 -> 8.',
    explanation: 'Every dimension pair (6,1), (1,5), (8,1) has one 1 that stretches to match the other size: `(8, 5, 6)`.',
    requiredConcepts: ['broadcasting', '3d-shape']
  },
  'q_bcast_04': {
    id: 'q_bcast_04',
    topic: 'broadcasting',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the result of np.array([1, 2, 3]) + 10?',
    options: ['[11 12 13]', '[10 20 30]', '[11 2 3]', 'TypeError'],
    correctAnswer: '[11 12 13]',
    hint: 'Aria whispers: The scalar 10 broadcasts across all elements of the array.',
    explanation: 'Scalar broadcasting adds 10 to every element: `[11, 12, 13]`.',
    requiredConcepts: ['scalar-broadcasting']
  },
  'q_bcast_05': {
    id: 'q_bcast_05',
    topic: 'broadcasting',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the sum of all elements in np.ones((2, 3)) * 5?',
    options: ['30.0', '15.0', '10.0', '25.0'],
    correctAnswer: '30.0',
    hint: 'Aria whispers: 6 elements, each equals 5.0. 6 * 5.0 = 30.0.',
    explanation: 'A 2x3 matrix has 6 ones. Multiplying by 5 gives six 5.0s, sum is 30.0.',
    requiredConcepts: ['broadcasting', 'multiplication']
  },

  // Level 19: Broadcasting Rules
  'q_bcast_rules_03': {
    id: 'q_bcast_rules_03',
    topic: 'broadcasting',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'When does NumPy consider two array dimensions compatible for broadcasting?',
    options: ['They are equal, or one of them is 1', 'Both dimensions must be even', 'They must be powers of 2', 'Their product must be divisible by 4'],
    correctAnswer: 'They are equal, or one of them is 1',
    hint: 'Aria whispers: The fundamental broadcasting rule: dims match if dim1 == dim2 or dim1 == 1 or dim2 == 1.',
    explanation: 'NumPy broadcasting rule: two dimensions are compatible if they are equal, or one of them is 1.',
    requiredConcepts: ['broadcasting-rules']
  },
  'q_bcast_rules_04': {
    id: 'q_bcast_rules_04',
    topic: 'broadcasting',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the output shape when broadcasting (3, 1) and (3,)?',
    options: ['(3, 3)', '(3, 1)', '(3,)', 'ValueError'],
    correctAnswer: '(3, 3)',
    hint: 'Aria whispers: (3,) aligns as (1, 3). (3, 1) + (1, 3) yields (3, 3).',
    explanation: 'Trailing dimensions: 1 vs 3 -> 3. Leading dimensions: 3 vs (prepended 1) -> 3. Output is `(3, 3)`.',
    requiredConcepts: ['broadcasting-rules', 'outer-product']
  },
  'q_bcast_rules_05': {
    id: 'q_bcast_rules_05',
    topic: 'broadcasting',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'Will shape (4, 3) broadcast with shape (3, 4)?',
    options: ['No, raises ValueError', 'Yes, produces shape (4, 4)', 'Yes, produces shape (12,)', 'Yes, produces shape (3, 3)'],
    correctAnswer: 'No, raises ValueError',
    hint: 'Aria whispers: Trailing dimensions 3 and 4 are not equal and neither is 1!',
    explanation: 'Trailing dimensions 3 != 4 and neither is 1, so broadcasting fails with a ValueError.',
    requiredConcepts: ['broadcasting-rules', 'value-error']
  },

  // Level 20: Broadcasting Boss
  'q_bcast_boss_03': {
    id: 'q_bcast_boss_03',
    topic: 'broadcasting',
    difficulty: 4,
    type: 'boss_challenge',
    question: 'BOSS: What is the shape of (np.zeros((10, 1, 4)) + np.zeros((1, 5, 4)))?',
    options: ['(10, 5, 4)', '(10, 1, 4)', '(1, 5, 4)', 'ValueError'],
    correctAnswer: '(10, 5, 4)',
    hint: 'Aria whispers: 4 matches 4; 1 stretches to 5; 10 matches 1 stretch to 10.',
    explanation: 'Dimension 2: 4==4. Dimension 1: 1 stretches to 5. Dimension 0: 1 stretches to 10. Result: `(10, 5, 4)`.',
    requiredConcepts: ['boss', '3d-broadcasting']
  },
  'q_bcast_boss_04': {
    id: 'q_bcast_boss_04',
    topic: 'broadcasting',
    difficulty: 4,
    type: 'boss_challenge',
    question: 'BOSS: How do you subtract a row vector of length N from every row of an (M, N) matrix?',
    options: ['matrix - row_vector', 'matrix - row_vector.reshape(N, 1)', 'matrix.T - row_vector', 'np.dot(matrix, row_vector)'],
    correctAnswer: 'matrix - row_vector',
    hint: 'Aria whispers: A 1D array of shape (N,) automatically broadcasts across all M rows of (M, N).',
    explanation: 'By broadcasting rules, shape `(N,)` aligns with trailing dimension of `(M, N)` and replicates M times.',
    requiredConcepts: ['boss', 'mean-centering']
  },

  // Level 21: Concatenation
  'q_concat_03': {
    id: 'q_concat_03',
    topic: 'manipulation',
    difficulty: 2,
    type: 'shape_prediction',
    question: 'What is the shape of np.concatenate([np.ones((2, 5)), np.ones((4, 5))], axis=0)?',
    options: ['(6, 5)', '(2, 10)', '(4, 5)', 'ValueError'],
    correctAnswer: '(6, 5)',
    hint: 'Aria whispers: axis=0 joins along rows: 2 + 4 = 6 rows.',
    explanation: 'Concatenating along axis=0 adds rows: 2 + 4 = 6. Columns remain 5: `(6, 5)`.',
    requiredConcepts: ['concatenate', 'axis0']
  },
  'q_concat_04': {
    id: 'q_concat_04',
    topic: 'manipulation',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'What happens if you concatenate arrays with mismatched non-concatenation dimensions?',
    options: ['Raises ValueError', 'Silently pads with zeros', 'Cuts extra rows', 'Flattens arrays to 1D'],
    correctAnswer: 'Raises ValueError',
    hint: 'Aria whispers: All dimensions except the concatenation axis must match exactly!',
    explanation: 'NumPy raises a ValueError: all the input array dimensions except for the concatenation axis must match exactly.',
    requiredConcepts: ['concatenate', 'value-error']
  },
  'q_concat_05': {
    id: 'q_concat_05',
    topic: 'manipulation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the length of np.concatenate([np.arange(3), np.arange(4)])?',
    options: ['7', '12', '4', '3'],
    correctAnswer: '7',
    hint: 'Aria whispers: 3 elements + 4 elements = 7 elements.',
    explanation: 'Concatenating 1D arrays of lengths 3 and 4 produces an array of length 7.',
    requiredConcepts: ['concatenate', 'length']
  },

  // Level 22: Stack
  'q_stack_02': {
    id: 'q_stack_02',
    topic: 'manipulation',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the shape of np.stack([a, b, c], axis=0) where each array has shape (10,)?',
    options: ['(3, 10)', '(30,)', '(10, 3)', '(1, 3, 10)'],
    correctAnswer: '(3, 10)',
    hint: 'Aria whispers: 3 arrays stacked along new axis 0 produces shape (3, 10).',
    explanation: '`np.stack` creates a new axis at position 0 with size 3 (the number of input arrays): `(3, 10)`.',
    requiredConcepts: ['stack', 'new-axis']
  },
  'q_stack_03': {
    id: 'q_stack_03',
    topic: 'manipulation',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the shape of np.stack([a, b, c], axis=1) where each array has shape (10,)?',
    options: ['(10, 3)', '(3, 10)', '(30,)', '(10, 1, 3)'],
    correctAnswer: '(10, 3)',
    hint: 'Aria whispers: axis=1 inserts the new dimension as columns: (10, 3).',
    explanation: '`axis=1` places the new axis of length 3 at dimension index 1: `(10, 3)`.',
    requiredConcepts: ['stack', 'axis1']
  },
  'q_stack_04': {
    id: 'q_stack_04',
    topic: 'manipulation',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'Can you use np.stack on arrays that have different shapes?',
    options: ['No, all input arrays must have the exact same shape', 'Yes, smaller arrays are zero-padded', 'Yes, larger arrays are cropped', 'Yes, only 1D arrays allowed'],
    correctAnswer: 'No, all input arrays must have the exact same shape',
    hint: 'Aria whispers: stack requires every input array to possess the exact same shape.',
    explanation: 'Every input array to `np.stack` must have identical shape; otherwise a ValueError is raised.',
    requiredConcepts: ['stack', 'requirements']
  },
  'q_stack_05': {
    id: 'q_stack_05',
    topic: 'manipulation',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'If you stack three 2D arrays of shape (4, 5) with axis=-1, what is the resulting shape?',
    options: ['(4, 5, 3)', '(3, 4, 5)', '(4, 3, 5)', '(12, 5)'],
    correctAnswer: '(4, 5, 3)',
    hint: 'Aria whispers: axis=-1 appends the new dimension of length 3 at the end, like RGB color channels!',
    explanation: 'Stacking with `axis=-1` appends the new dimension of length 3 to the end: `(4, 5, 3)`.',
    requiredConcepts: ['stack', 'trailing-axis']
  },

  // Level 23: vstack & hstack
  'q_vhstack_02': {
    id: 'q_vhstack_02',
    topic: 'manipulation',
    difficulty: 2,
    type: 'shape_prediction',
    question: 'What is the shape of np.hstack([np.zeros((3, 2)), np.zeros((3, 5))])?',
    options: ['(3, 7)', '(6, 2)', '(3, 10)', 'ValueError'],
    correctAnswer: '(3, 7)',
    hint: 'Aria whispers: hstack joins columns horizontally: 2 + 5 = 7 columns.',
    explanation: '`np.hstack` attaches arrays side-by-side along columns: rows remain 3, cols become 2+5=7 -> `(3, 7)`.',
    requiredConcepts: ['hstack', 'horizontal']
  },
  'q_vhstack_03': {
    id: 'q_vhstack_03',
    topic: 'manipulation',
    difficulty: 2,
    type: 'shape_prediction',
    question: 'What is the shape of np.vstack([np.zeros((3, 4)), np.zeros((2, 4))])?',
    options: ['(5, 4)', '(3, 6)', '(5, 8)', 'ValueError'],
    correctAnswer: '(5, 4)',
    hint: 'Aria whispers: vstack stacks vertically down rows: 3 + 2 = 5 rows.',
    explanation: '`np.vstack` stacks rows vertically: 3 + 2 = 5 rows, columns remain 4: `(5, 4)`.',
    requiredConcepts: ['vstack', 'vertical']
  },
  'q_vhstack_04': {
    id: 'q_vhstack_04',
    topic: 'manipulation',
    difficulty: 2,
    type: 'predict_output',
    question: 'For two 1D arrays a = [1, 2] and b = [3, 4], what is the shape of np.vstack([a, b])?',
    options: ['(2, 2)', '(4,)', '(1, 4)', '(2, 1)'],
    correctAnswer: '(2, 2)',
    hint: 'Aria whispers: vstack turns 1D vectors into rows of a 2D matrix.',
    explanation: '1D vectors become rows: row 0 is [1, 2] and row 1 is [3, 4] -> shape `(2, 2)`.',
    requiredConcepts: ['vstack', '1d-to-2d']
  },
  'q_vhstack_05': {
    id: 'q_vhstack_05',
    topic: 'manipulation',
    difficulty: 2,
    type: 'predict_output',
    question: 'For two 1D arrays a = [1, 2] and b = [3, 4], what is the shape of np.hstack([a, b])?',
    options: ['(4,)', '(2, 2)', '(1, 4)', '(4, 1)'],
    correctAnswer: '(4,)',
    hint: 'Aria whispers: hstack on 1D arrays concatenates end-to-end to stay 1D.',
    explanation: 'For 1D arrays, `np.hstack` joins them end-to-end into a single 1D array of length 4: `(4,)`.',
    requiredConcepts: ['hstack', '1d']
  },

  // Level 24: Splitting
  'q_split_02': {
    id: 'q_split_02',
    topic: 'manipulation',
    difficulty: 2,
    type: 'predict_output',
    question: 'What happens when using np.split(np.arange(10), 3)?',
    options: ['ValueError: array split does not result in an equal division', 'Returns 3 arrays of lengths 4, 3, 3', 'Returns 10 arrays', 'Drops the last element'],
    correctAnswer: 'ValueError: array split does not result in an equal division',
    hint: 'Aria whispers: 10 cannot be divided evenly by 3! Use np.array_split instead.',
    explanation: '`np.split` requires equal divisions. 10 is not divisible by 3, so it raises ValueError.',
    requiredConcepts: ['split', 'equal-division']
  },
  'q_split_03': {
    id: 'q_split_03',
    topic: 'manipulation',
    difficulty: 3,
    type: 'predict_output',
    question: 'Which function divides an array into unequal sections without raising an error?',
    options: ['np.array_split()', 'np.split()', 'np.divide()', 'np.chunk()'],
    correctAnswer: 'np.array_split()',
    hint: 'Aria whispers: np.array_split handles unequal partitions gracefully.',
    explanation: '`np.array_split()` allows unequal divisions without throwing a ValueError.',
    requiredConcepts: ['array_split']
  },
  'q_split_04': {
    id: 'q_split_04',
    topic: 'manipulation',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'If you split a (6, 8) matrix into 2 parts using np.split(matrix, 2, axis=0), what is each sub-array shape?',
    options: ['(3, 8)', '(6, 4)', '(3, 4)', '(2, 8)'],
    correctAnswer: '(3, 8)',
    hint: 'Aria whispers: Splitting axis 0 divides 6 rows into two halves of 3 rows.',
    explanation: '6 rows divided into 2 sections along axis=0 gives two `(3, 8)` matrices.',
    requiredConcepts: ['split', 'axis0']
  },
  'q_split_05': {
    id: 'q_split_05',
    topic: 'manipulation',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'If you split a (6, 8) matrix using np.split(matrix, 4, axis=1), what is each sub-array shape?',
    options: ['(6, 2)', '(3, 8)', '(6, 4)', '(1, 8)'],
    correctAnswer: '(6, 2)',
    hint: 'Aria whispers: Splitting axis 1 divides 8 columns into 4 sections of 2 columns.',
    explanation: '8 columns divided into 4 sections along axis=1 yields four sub-arrays of shape `(6, 2)`.',
    requiredConcepts: ['split', 'axis1']
  },

  // Level 25: Sorting
  'q_sort_02': {
    id: 'q_sort_02',
    topic: 'sorting',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.sort(np.array([5, 1, 4, 2])) return?',
    options: ['[1 2 4 5]', '[5 4 2 1]', '[1 3 0 2]', '[4 2 1 5]'],
    correctAnswer: '[1 2 4 5]',
    hint: 'Aria whispers: np.sort sorts values in ascending order.',
    explanation: '`np.sort` sorts the elements from smallest to largest: `[1, 2, 4, 5]`.',
    requiredConcepts: ['sort', 'ascending']
  },
  'q_sort_03': {
    id: 'q_sort_03',
    topic: 'sorting',
    difficulty: 3,
    type: 'predict_output',
    question: 'How do you sort an array in descending order in NumPy?',
    options: ['np.sort(arr)[::-1]', 'np.sort(arr, reverse=True)', 'arr.sort_descending()', 'np.reverse_sort(arr)'],
    correctAnswer: 'np.sort(arr)[::-1]',
    hint: 'Aria whispers: Sort ascending, then reverse with step -1 slice [::-1].',
    explanation: 'NumPy does not have a reverse=True keyword; reversing the ascending sort with `[::-1]` is standard practice.',
    requiredConcepts: ['sort', 'descending']
  },
  'q_sort_04': {
    id: 'q_sort_04',
    topic: 'sorting',
    difficulty: 3,
    type: 'predict_output',
    question: 'How do you find the index of the maximum value in an array?',
    options: ['np.argmax(arr)', 'np.max_index(arr)', 'arr.index_max()', 'np.sort(arr)[0]'],
    correctAnswer: 'np.argmax(arr)',
    hint: 'Aria whispers: argmax returns the index of the highest value.',
    explanation: '`np.argmax(arr)` returns the integer index of the maximum value.',
    requiredConcepts: ['argmax']
  },
  'q_sort_05': {
    id: 'q_sort_05',
    topic: 'sorting',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does np.argmin(np.array([40, 10, 30])) return?',
    options: ['1', '10', '0', '2'],
    correctAnswer: '1',
    hint: 'Aria whispers: 10 is the minimum, located at index 1.',
    explanation: 'The smallest element (10) resides at index 1.',
    requiredConcepts: ['argmin']
  },

  // Level 26: Copy vs View
  'q_copyview_03': {
    id: 'q_copyview_03',
    topic: 'memory',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'How can you guarantee that a new array does NOT share memory with the original?',
    options: ['Call arr.copy()', 'Use arr[:]', 'Assign new_arr = arr', 'Call arr.view()'],
    correctAnswer: 'Call arr.copy()',
    hint: 'Aria whispers: arr.copy() allocates brand new independent memory on the heap.',
    explanation: '`arr.copy()` allocates fresh memory and copies the data, ensuring total independence.',
    requiredConcepts: ['copy', 'memory-independence']
  },
  'q_copyview_04': {
    id: 'q_copyview_04',
    topic: 'memory',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is arr.base if arr was created directly as np.array([1, 2, 3])?',
    options: ['None', '[1 2 3]', '0', 'True'],
    correctAnswer: 'None',
    hint: 'Aria whispers: An array that owns its own memory has .base equal to None.',
    explanation: 'If an array owns its memory buffer (it is not a view of another array), `.base` is `None`.',
    requiredConcepts: ['base', 'memory-ownership']
  },
  'q_copyview_05': {
    id: 'q_copyview_05',
    topic: 'memory',
    difficulty: 3,
    type: 'predict_output',
    question: 'Does reshape() create a view or a copy when possible?',
    options: ['A view when memory is contiguous', 'Always a copy', 'Always an error', 'A view only for 1D arrays'],
    correctAnswer: 'A view when memory is contiguous',
    hint: 'Aria whispers: reshape returns a view whenever memory strides allow it.',
    explanation: '`reshape()` returns a view without duplicating data if the underlying memory layout is contiguous.',
    requiredConcepts: ['reshape-view', 'strides']
  },

  // Level 27: Transpose
  'q_trans_02': {
    id: 'q_trans_02',
    topic: 'transpose',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the top-left element (0, 0) of arr.T for arr = np.array([[5, 8], [2, 9]])?',
    options: ['5', '8', '2', '9'],
    correctAnswer: '5',
    hint: 'Aria whispers: Diagonal elements (0, 0), (1, 1) do not change positions upon transpose.',
    explanation: 'The main diagonal elements retain their coordinates during transposition: `(0, 0)` is 5.',
    requiredConcepts: ['transpose', 'diagonal']
  },
  'q_trans_03': {
    id: 'q_trans_03',
    topic: 'transpose',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does (arr.T).T evaluate to for any 2D matrix arr?',
    options: ['The original matrix arr', '-arr', '1 / arr', 'A flattened 1D array'],
    correctAnswer: 'The original matrix arr',
    hint: 'Aria whispers: Transposing twice returns to the original orientation.',
    explanation: 'Transposing twice `(A^T)^T = A` returns the exact original orientation.',
    requiredConcepts: ['transpose', 'double-transpose']
  },
  'q_trans_04': {
    id: 'q_trans_04',
    topic: 'transpose',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'If arr has shape (2, 3, 4), what is the shape of np.transpose(arr, (1, 2, 0))?',
    options: ['(3, 4, 2)', '(2, 4, 3)', '(4, 3, 2)', '(2, 3, 4)'],
    correctAnswer: '(3, 4, 2)',
    hint: 'Aria whispers: Axis 1 (size 3), Axis 2 (size 4), Axis 0 (size 2) -> (3, 4, 2).',
    explanation: 'Permuting axes by `(1, 2, 0)` rearranges dimensions: original axis 1 is 3, axis 2 is 4, axis 0 is 2 -> `(3, 4, 2)`.',
    requiredConcepts: ['transpose', 'axis-permutation']
  },
  'q_trans_05': {
    id: 'q_trans_05',
    topic: 'transpose',
    difficulty: 2,
    type: 'multiple_choice',
    question: 'Does arr.T copy the array data in memory?',
    options: ['No, it creates a view with swapped strides', 'Yes, it always creates a deep copy', 'Yes, only for float arrays', 'Yes, for matrices larger than 10x10'],
    correctAnswer: 'No, it creates a view with swapped strides',
    hint: 'Aria whispers: Transpose simply swaps the stride step sizes without moving data bytes.',
    explanation: '`arr.T` modifies the array strides and shape without allocating new memory or copying bytes.',
    requiredConcepts: ['transpose', 'zero-copy']
  },

  // Level 28: Advanced Reshaping
  'q_advshape_02': {
    id: 'q_advshape_02',
    topic: 'advanced_reshape',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the shape of np.squeeze(arr, axis=0) if arr has shape (1, 4, 5)?',
    options: ['(4, 5)', '(1, 4, 5)', '(20,)', '(4, 5, 1)'],
    correctAnswer: '(4, 5)',
    hint: 'Aria whispers: Squeezing axis 0 strips the leading dimension of size 1.',
    explanation: 'Removing dimension 0 of size 1 reduces the shape to `(4, 5)`.',
    requiredConcepts: ['squeeze', 'axis-selection']
  },
  'q_advshape_03': {
    id: 'q_advshape_03',
    topic: 'advanced_reshape',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'What is the difference between arr.flatten() and arr.ravel()?',
    options: [
      'flatten() always returns a copy; ravel() returns a view whenever possible',
      'flatten() works only on 2D; ravel() works on any dimension',
      'ravel() sorts elements; flatten() reverses them',
      'They are identical aliases'
    ],
    correctAnswer: 'flatten() always returns a copy; ravel() returns a view whenever possible',
    hint: 'Aria whispers: ravel() is memory-efficient and returns a view if contiguous.',
    explanation: '`flatten()` allocates and returns a copy, while `ravel()` returns a view without memory copying when possible.',
    requiredConcepts: ['flatten', 'ravel']
  },
  'q_advshape_04': {
    id: 'q_advshape_04',
    topic: 'advanced_reshape',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What happens when you reshape an array with -1, e.g., arr.reshape(-1, 2) on a 10-element array?',
    options: ['NumPy infers the missing dimension as 5: (5, 2)', 'NumPy reverses the array', 'Raises ValueError', 'Creates negative indices'],
    correctAnswer: 'NumPy infers the missing dimension as 5: (5, 2)',
    hint: 'Aria whispers: -1 tells NumPy to automatically calculate that dimension length: 10 / 2 = 5.',
    explanation: 'NumPy calculates -1 dynamically from total size: 10 elements / 2 = 5 -> shape `(5, 2)`.',
    requiredConcepts: ['reshape', 'inferred-dimension']
  },
  'q_advshape_05': {
    id: 'q_advshape_05',
    topic: 'advanced_reshape',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does arr.ravel()[0] return for arr = np.array([[9, 8], [7, 6]])?',
    options: ['9', '[9 8]', '6', '7'],
    correctAnswer: '9',
    hint: 'Aria whispers: ravel flattens in row-major order: [9, 8, 7, 6]. First element is 9.',
    explanation: 'Row-major flattening yields `[9, 8, 7, 6]`. Index 0 is 9.',
    requiredConcepts: ['ravel', 'row-major']
  },

  // Level 29: Random Numbers
  'q_rand_03': {
    id: 'q_rand_03',
    topic: 'random',
    difficulty: 2,
    type: 'predict_output',
    question: 'What range of floats does rng.random() sample from?',
    options: ['[0.0, 1.0) half-open interval', '[0.0, 1.0] inclusive interval', '[-1.0, 1.0]', '[0, 100)'],
    correctAnswer: '[0.0, 1.0) half-open interval',
    hint: 'Aria whispers: Like Python random(), floats are sampled uniformly from 0.0 up to (but not including) 1.0.',
    explanation: '`rng.random()` generates uniform floats in the half-open interval `[0.0, 1.0)`.',
    requiredConcepts: ['random', 'uniform-floats']
  },
  'q_rand_04': {
    id: 'q_rand_04',
    topic: 'random',
    difficulty: 2,
    type: 'multiple_choice',
    question: 'How do you ensure repeatable random numbers for reproducible scientific experiments?',
    options: ['Pass an integer seed: np.random.default_rng(42)', 'Call rng.lock()', 'Use np.random.freeze()', 'Save array to disk'],
    correctAnswer: 'Pass an integer seed: np.random.default_rng(42)',
    hint: 'Aria whispers: A seed guarantees the exact same pseudo-random sequence every run.',
    explanation: 'Passing a seed integer to `default_rng(seed)` initializes the generator state deterministically.',
    requiredConcepts: ['seed', 'reproducibility']
  },
  'q_rand_05': {
    id: 'q_rand_05',
    topic: 'random',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the shape of rng.normal(loc=0.0, scale=1.0, size=(4, 5))?',
    options: ['(4, 5)', '(20,)', '(1, 4, 5)', 'scalar'],
    correctAnswer: '(4, 5)',
    hint: 'Aria whispers: The size tuple specifies the output tensor shape (4, 5).',
    explanation: '`size=(4, 5)` generates a Gaussian distribution matrix with shape `(4, 5)`.',
    requiredConcepts: ['normal-distribution', 'size']
  },

  // Level 30: Random Data Problems
  'q_randdata_02': {
    id: 'q_randdata_02',
    topic: 'random',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does rng.choice(np.array([10, 20, 30]), size=2, replace=False) guarantee?',
    options: [
      'The 2 selected elements will be distinct (no duplicates)',
      'The 2 elements will always be 10 and 20',
      'The array will be sorted',
      'Duplicates are required'
    ],
    correctAnswer: 'The 2 selected elements will be distinct (no duplicates)',
    hint: 'Aria whispers: replace=False samples without replacement, preventing duplicates.',
    explanation: '`replace=False` ensures each sampled item is unique, drawing without replacement.',
    requiredConcepts: ['choice', 'without-replacement']
  },
  'q_randdata_03': {
    id: 'q_randdata_03',
    topic: 'random',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is the difference between rng.shuffle(arr) and rng.permutation(arr)?',
    options: [
      'shuffle modifies arr in-place; permutation returns a new shuffled copy',
      'permutation is faster; shuffle is slower',
      'shuffle works only on 1D arrays; permutation on 2D',
      'They are identical aliases'
    ],
    correctAnswer: 'shuffle modifies arr in-place; permutation returns a new shuffled copy',
    hint: 'Aria whispers: shuffle alters the input in-place, permutation returns a fresh copy.',
    explanation: '`rng.shuffle(arr)` mutates the array in-place, while `rng.permutation(arr)` returns a shuffled copy.',
    requiredConcepts: ['shuffle', 'permutation']
  },
  'q_randdata_04': {
    id: 'q_randdata_04',
    topic: 'random',
    difficulty: 3,
    type: 'dataset_mission',
    question: 'How do you simulate 1,000 coin flips where 1 is Heads and 0 is Tails?',
    options: ['rng.integers(0, 2, size=1000)', 'rng.integers(1, 2, size=1000)', 'rng.random(size=1000) * 2', 'np.flip(1000)'],
    correctAnswer: 'rng.integers(0, 2, size=1000)',
    hint: 'Aria whispers: integers(0, 2) samples 0 and 1 with equal probability.',
    explanation: '`rng.integers(0, 2, size=1000)` samples 0 and 1 uniformly 1000 times.',
    requiredConcepts: ['coin-flip', 'simulation']
  },
  'q_randdata_05': {
    id: 'q_randdata_05',
    topic: 'random',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is the expected mean of 1,000,000 samples drawn from rng.standard_normal(1000000)?',
    options: ['Approximately 0.0', 'Approximately 1.0', 'Approximately 0.5', 'Exactly 1000000'],
    correctAnswer: 'Approximately 0.0',
    hint: 'Aria whispers: Standard normal distribution has mean mu = 0 and std sigma = 1.',
    explanation: 'Standard normal distribution is centered at mean 0.0.',
    requiredConcepts: ['standard-normal', 'statistics']
  },

  // Level 31: Matrix Operations
  'q_matops_02': {
    id: 'q_matops_02',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the shape of A @ B if A has shape (2, 3) and B has shape (3, 4)?',
    options: ['(2, 4)', '(3, 3)', '(2, 3)', 'ValueError'],
    correctAnswer: '(2, 4)',
    hint: 'Aria whispers: Inner dimensions 3 match; outer dimensions form output shape (2, 4).',
    explanation: 'Matrix multiplication (M, K) @ (K, N) yields (M, N). (2, 3) @ (3, 4) -> `(2, 4)`.',
    requiredConcepts: ['matmul', 'shape-compatibility']
  },
  'q_matops_03': {
    id: 'q_matops_03',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'Can you compute A @ B if A has shape (2, 5) and B has shape (4, 2)?',
    options: ['No, inner dimensions 5 and 4 do not match', 'Yes, produces shape (2, 2)', 'Yes, produces shape (5, 4)', 'Yes, after auto-padding'],
    correctAnswer: 'No, inner dimensions 5 and 4 do not match',
    hint: 'Aria whispers: Inner dimensions must be equal for matrix multiplication.',
    explanation: 'Inner dimensions (5 vs 4) do not match, causing ValueError.',
    requiredConcepts: ['matmul', 'dimension-mismatch']
  },
  'q_matops_04': {
    id: 'q_matops_04',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is the result of multiplying a 2x2 matrix by np.eye(2) using @?',
    options: ['The original matrix unchanged', 'All zeros', 'All ones', 'The transposed matrix'],
    correctAnswer: 'The original matrix unchanged',
    hint: 'Aria whispers: The identity matrix is the multiplicative identity for matrix multiplication: A @ I = A.',
    explanation: 'Multiplying by the identity matrix leaves any compatible matrix unchanged.',
    requiredConcepts: ['identity-matrix', 'matmul']
  },
  'q_matops_05': {
    id: 'q_matops_05',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does np.matmul([[1, 0], [0, 1]], [3, 4]) evaluate to?',
    options: ['[3 4]', '[0 0]', '[7 7]', '12'],
    correctAnswer: '[3 4]',
    hint: 'Aria whispers: Identity matrix multiplied by vector [3, 4] leaves the vector unchanged.',
    explanation: '`I @ v = v`. The result is `[3, 4]`.',
    requiredConcepts: ['matmul', 'vector-multiplication']
  },

  // Level 32: np.dot vs np.matmul
  'q_dot_02': {
    id: 'q_dot_02',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is the dot product of orthogonal vectors [1, 0] and [0, 1]?',
    options: ['0', '1', '2', '[-1 0]'],
    correctAnswer: '0',
    hint: 'Aria whispers: 1*0 + 0*1 = 0. Perpendicular vectors have dot product zero!',
    explanation: '`1*0 + 0*1 = 0`. Perpendicular (orthogonal) vectors have zero inner product.',
    requiredConcepts: ['dot-product', 'orthogonality']
  },
  'q_dot_03': {
    id: 'q_dot_03',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does np.vdot(a, b) compute for complex vectors?',
    options: [
      'Dot product with the complex conjugate of the first vector',
      'Vertical vector dot product',
      'Vector division',
      'Cross product'
    ],
    correctAnswer: 'Dot product with the complex conjugate of the first vector',
    hint: 'Aria whispers: vdot conjugates the first vector to compute true inner products over the complex field.',
    explanation: '`np.vdot` conjugates the first argument for complex numbers before computing the dot product.',
    requiredConcepts: ['vdot', 'complex-inner-product']
  },
  'q_dot_04': {
    id: 'q_dot_04',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'predict_output',
    question: 'What is np.dot(5, [2, 3])?',
    options: ['[10 15]', '25', '10', 'TypeError'],
    correctAnswer: '[10 15]',
    hint: 'Aria whispers: When one argument is a scalar, np.dot performs scalar multiplication.',
    explanation: 'If either argument is a scalar, `np.dot` computes scalar element multiplication: `5 * [2, 3] = [10, 15]`.',
    requiredConcepts: ['dot', 'scalar-dot']
  },
  'q_dot_05': {
    id: 'q_dot_05',
    topic: 'linear_algebra',
    difficulty: 3,
    type: 'shape_prediction',
    question: 'What is the shape of np.outer([1, 2], [3, 4, 5])?',
    options: ['(2, 3)', '(6,)', '(3, 2)', '(2, 2)'],
    correctAnswer: '(2, 3)',
    hint: 'Aria whispers: Outer product of vector length 2 and vector length 3 creates a (2, 3) matrix.',
    explanation: '`np.outer(u, v)` computes the outer product matrix with shape `(len(u), len(v))` -> `(2, 3)`.',
    requiredConcepts: ['outer-product', 'shape']
  },

  // Level 33: np.linalg
  'q_linalg_03': {
    id: 'q_linalg_03',
    topic: 'linear_algebra',
    difficulty: 4,
    type: 'predict_output',
    question: 'What does np.linalg.norm(np.array([3, 4])) compute (Euclidean length)?',
    options: ['5.0', '7.0', '25.0', '1.0'],
    correctAnswer: '5.0',
    hint: 'Aria whispers: sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5.0.',
    explanation: '`np.linalg.norm()` calculates the L2 Euclidean vector magnitude: `sqrt(9 + 16) = 5.0`.',
    requiredConcepts: ['norm', 'euclidean-distance']
  },
  'q_linalg_04': {
    id: 'q_linalg_04',
    topic: 'linear_algebra',
    difficulty: 4,
    type: 'multiple_choice',
    question: 'When does a square matrix NOT have an inverse (singular matrix)?',
    options: ['When its determinant is equal to 0', 'When its determinant is 1', 'When all elements are positive', 'When its size is odd'],
    correctAnswer: 'When its determinant is equal to 0',
    hint: 'Aria whispers: det(A) == 0 means the matrix is singular and cannot be inverted.',
    explanation: 'A matrix is singular (non-invertible) if and only if its determinant is zero.',
    requiredConcepts: ['det', 'singularity']
  },
  'q_linalg_05': {
    id: 'q_linalg_05',
    topic: 'linear_algebra',
    difficulty: 4,
    type: 'predict_output',
    question: 'What function solves the linear matrix equation Ax = b directly?',
    options: ['np.linalg.solve(A, b)', 'np.linalg.inv(A) * b', 'np.solve(A, b)', 'A.solve(b)'],
    correctAnswer: 'np.linalg.solve(A, b)',
    hint: 'Aria whispers: np.linalg.solve is numerically faster and more stable than inverting A.',
    explanation: '`np.linalg.solve(A, b)` solves for x using LAPACK LU decomposition without computing explicit matrix inverses.',
    requiredConcepts: ['solve', 'lapack']
  },

  // Level 34: NaN Handling
  'q_nan_03': {
    id: 'q_nan_03',
    topic: 'nan_handling',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.nansum(np.array([5, np.nan, 15])) return?',
    options: ['20.0', 'nan', '10.0', 'Error'],
    correctAnswer: '20.0',
    hint: 'Aria whispers: nansum treats NaNs as 0: 5 + 15 = 20.0.',
    explanation: '`np.nansum()` computes the sum while ignoring missing NaN values: 5 + 15 = 20.0.',
    requiredConcepts: ['nansum', 'nan-handling']
  },
  'q_nan_04': {
    id: 'q_nan_04',
    topic: 'nan_handling',
    difficulty: 2,
    type: 'predict_output',
    question: 'What does np.isnan(np.array([1.0, np.nan, 3.0])) return?',
    options: ['[False  True False]', '[True False True]', 'True', '1'],
    correctAnswer: '[False  True False]',
    hint: 'Aria whispers: isnan creates a boolean mask where True identifies NaN entries.',
    explanation: '`np.isnan()` returns element-wise booleans marking NaNs: `[False, True, False]`.',
    requiredConcepts: ['isnan', 'mask']
  },
  'q_nan_05': {
    id: 'q_nan_05',
    topic: 'nan_handling',
    difficulty: 2,
    type: 'predict_output',
    question: 'What is the output of 0 / 0 in floating point NumPy?',
    options: ['nan', '0.0', 'inf', 'ZeroDivisionError'],
    correctAnswer: 'nan',
    hint: 'Aria whispers: 0 / 0 produces nan (Not a Number) with an invalid value warning.',
    explanation: 'Under IEEE 754 in NumPy, `0.0 / 0.0` generates `nan`.',
    requiredConcepts: ['nan', 'floating-point']
  },

  // Level 35: Missing Data
  'q_miss_03': {
    id: 'q_miss_03',
    topic: 'missing_data',
    difficulty: 3,
    type: 'predict_output',
    question: 'How do you extract only the valid (non-NaN) numbers from an array?',
    options: ['arr[~np.isnan(arr)]', 'arr[np.isnan(arr)]', 'arr.drop_nan()', 'arr[arr != np.nan]'],
    correctAnswer: 'arr[~np.isnan(arr)]',
    hint: 'Aria whispers: ~ inverts the boolean mask: ~isnan selects all valid values.',
    explanation: '`~np.isnan(arr)` is True for valid numbers, allowing clean filtering of non-NaN entries.',
    requiredConcepts: ['isnan', 'tilde-inversion']
  },
  'q_miss_04': {
    id: 'q_miss_04',
    topic: 'missing_data',
    difficulty: 3,
    type: 'predict_output',
    question: 'How do you count how many NaN values exist in array arr?',
    options: ['np.isnan(arr).sum()', 'arr.count_nan()', 'len(arr[nan])', 'np.nan_count(arr)'],
    correctAnswer: 'np.isnan(arr).sum()',
    hint: 'Aria whispers: Summing the boolean mask counts True values.',
    explanation: '`np.isnan(arr).sum()` sums 1s for each True, giving the total count of missing NaN values.',
    requiredConcepts: ['isnan', 'counting-missing']
  },
  'q_miss_05': {
    id: 'q_miss_05',
    topic: 'missing_data',
    difficulty: 3,
    type: 'code_fill',
    question: 'How do you impute (replace) all NaNs in arr with the array mean of valid entries?',
    options: [
      'arr[np.isnan(arr)] = np.nanmean(arr)',
      'arr[np.isnan(arr)] = arr.mean()',
      'arr.fill_nan_mean()',
      'np.impute(arr)'
    ],
    correctAnswer: 'arr[np.isnan(arr)] = np.nanmean(arr)',
    hint: 'Aria whispers: Use nanmean() because arr.mean() would evaluate to nan!',
    explanation: '`arr[np.isnan(arr)] = np.nanmean(arr)` calculates the mean of valid entries and assigns it to all missing indices.',
    requiredConcepts: ['imputation', 'nanmean']
  },

  // Level 36: Real Datasets
  'q_dataset_02': {
    id: 'q_dataset_02',
    topic: 'real_datasets',
    difficulty: 3,
    type: 'dataset_mission',
    question: 'How do you calculate standard score (Z-score) normalization of a feature column x?',
    options: [
      '(x - x.mean()) / x.std()',
      '(x - x.min()) / (x.max() - x.min())',
      'x / x.sum()',
      'np.log(x)'
    ],
    correctAnswer: '(x - x.mean()) / x.std()',
    hint: 'Aria whispers: Z-score is (value - mean) / standard_deviation.',
    explanation: 'Z-score normalization centers data at mean 0 with standard deviation 1: `(x - mean) / std`.',
    requiredConcepts: ['z-score', 'standardization']
  },
  'q_dataset_03': {
    id: 'q_dataset_03',
    topic: 'real_datasets',
    difficulty: 3,
    type: 'dataset_mission',
    question: 'How do you scale feature values to the range [0, 1] (Min-Max Scaling)?',
    options: [
      '(x - x.min()) / (x.max() - x.min())',
      '(x - x.mean()) / x.std()',
      'x / 100.0',
      'np.normalize(x)'
    ],
    correctAnswer: '(x - x.min()) / (x.max() - x.min())',
    hint: 'Aria whispers: Min-max formula subtracts min and divides by the range (max - min).',
    explanation: 'Min-max scaling shifts minimum to 0 and scales maximum to 1: `(x - min) / (max - min)`.',
    requiredConcepts: ['min-max-scaling', 'feature-engineering']
  },
  'q_dataset_04': {
    id: 'q_dataset_04',
    topic: 'real_datasets',
    difficulty: 3,
    type: 'predict_output',
    question: 'In an array of sensor readings, how do you find the 95th percentile threshold?',
    options: ['np.percentile(readings, 95)', 'readings.percentile(95)', 'np.quantile_95(readings)', 'np.sort(readings)[95]'],
    correctAnswer: 'np.percentile(readings, 95)',
    hint: 'Aria whispers: np.percentile(arr, q) computes the q-th percentile.',
    explanation: '`np.percentile(arr, 95)` calculates the 95th percentile value.',
    requiredConcepts: ['percentile', 'statistics']
  },
  'q_dataset_05': {
    id: 'q_dataset_05',
    topic: 'real_datasets',
    difficulty: 3,
    type: 'dataset_mission',
    question: 'Given an (N, D) dataset matrix, how do you find the number of samples (rows)?',
    options: ['dataset.shape[0]', 'dataset.shape[1]', 'dataset.size', 'len(dataset[0])'],
    correctAnswer: 'dataset.shape[0]',
    hint: 'Aria whispers: In 2D matrices, dimension 0 represents rows (samples).',
    explanation: '`dataset.shape[0]` gives the row count (number of samples in the dataset).',
    requiredConcepts: ['dataset-shape', 'samples']
  },

  // Level 37: Vectorization
  'q_vec_02': {
    id: 'q_vec_02',
    topic: 'performance',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'What CPU feature does vectorized NumPy math utilize for hardware parallelism?',
    options: [
      'SIMD registers (Single Instruction Multiple Data)',
      'GPU shader shaders only',
      'Hard disk paging units',
      'Clock frequency overclocking'
    ],
    correctAnswer: 'SIMD registers (Single Instruction Multiple Data)',
    hint: 'Aria whispers: Modern CPUs have AVX/SSE vector instructions that compute 4-8 operations in a single CPU cycle.',
    explanation: 'SIMD (AVX-512, AVX2, NEON) executes the same arithmetic instruction across multiple numbers simultaneously.',
    requiredConcepts: ['simd', 'hardware-acceleration']
  },
  'q_vec_03': {
    id: 'q_vec_03',
    topic: 'performance',
    difficulty: 2,
    type: 'predict_output',
    question: 'Which is faster: [x + 1 for x in range(1000000)] or np.arange(1000000) + 1?',
    options: [
      'np.arange(1000000) + 1 (often 10x to 50x faster)',
      'List comprehension is faster',
      'Both run at identical speed',
      'Python for-loop with append is fastest'
    ],
    correctAnswer: 'np.arange(1000000) + 1 (often 10x to 50x faster)',
    hint: 'Aria whispers: NumPy vectorized operations run in compiled C without Python bytecode interpreter overhead.',
    explanation: 'Vectorized NumPy executes inside tight C loops with contiguous memory cache locality, running 10x-50x faster.',
    requiredConcepts: ['performance-benchmark', 'c-speed']
  },
  'q_vec_04': {
    id: 'q_vec_04',
    topic: 'performance',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'Why does Python loop overhead slow down numerical operations?',
    options: [
      'Type checking, object boxing/unboxing, and interpreter dispatch on every single iteration',
      'Python pauses to write to log files',
      'Loops run on only 1 bit of memory',
      'Loops always copy the whole operating system'
    ],
    correctAnswer: 'Type checking, object boxing/unboxing, and interpreter dispatch on every single iteration',
    hint: 'Aria whispers: Dynamic typing requires checking object types on every step through the loop.',
    explanation: 'Dynamic type resolution and PyObject pointer chasing add massive interpreter overhead on every iteration.',
    requiredConcepts: ['interpreter-overhead', 'boxing']
  },
  'q_vec_05': {
    id: 'q_vec_05',
    topic: 'performance',
    difficulty: 3,
    type: 'code_fill',
    question: 'How do you turn a Python scalar function into a vectorized NumPy ufunc?',
    options: ['np.vectorize(func)', 'func.vectorize()', 'np.compile(func)', 'np.parallel(func)'],
    correctAnswer: 'np.vectorize(func)',
    hint: 'Aria whispers: np.vectorize wraps Python functions to broadcast over arrays.',
    explanation: '`np.vectorize()` provides a convenient wrapper to evaluate Python functions over array elements.',
    requiredConcepts: ['np.vectorize']
  },

  // Level 38: Python Lists vs NumPy
  'q_perf_02': {
    id: 'q_perf_02',
    topic: 'performance',
    difficulty: 3,
    type: 'predict_output',
    question: 'How many bytes does each element in a float64 array consume in memory?',
    options: ['8 bytes', '64 bytes', '28 bytes', '4 bytes'],
    correctAnswer: '8 bytes',
    hint: 'Aria whispers: 64 bits / 8 bits per byte = 8 bytes.',
    explanation: 'A 64-bit floating point number occupies exactly 8 bytes (64 / 8 = 8).',
    requiredConcepts: ['float64', 'byte-size']
  },
  'q_perf_03': {
    id: 'q_perf_03',
    topic: 'performance',
    difficulty: 3,
    type: 'multiple_choice',
    question: 'What is CPU Cache Locality and why does it favor NumPy arrays?',
    options: [
      'Contiguous memory arrays load into fast L1/L2 CPU cache lines without pointer cache misses',
      'It stores numbers in the GPU VRAM exclusively',
      'It compresses integers into strings',
      'It downloads cache from the web'
    ],
    correctAnswer: 'Contiguous memory arrays load into fast L1/L2 CPU cache lines without pointer cache misses',
    hint: 'Aria whispers: When memory is contiguous, the CPU prefetches entire blocks into ultra-fast cache lines.',
    explanation: 'Sequential RAM storage allows the CPU prefetcher to load continuous blocks into L1 cache, avoiding DRAM latency.',
    requiredConcepts: ['cache-locality', 'l1-cache']
  },
  'q_perf_04': {
    id: 'q_perf_04',
    topic: 'performance',
    difficulty: 2,
    type: 'predict_output',
    question: 'What attribute shows the memory size of each array element in bytes?',
    options: ['arr.itemsize', 'arr.bytes', 'arr.elementsize', 'arr.sizeof'],
    correctAnswer: 'arr.itemsize',
    hint: 'Aria whispers: arr.itemsize returns the byte size of each element (e.g. 8 for float64).',
    explanation: '`arr.itemsize` returns the number of bytes occupied by a single array element.',
    requiredConcepts: ['itemsize']
  },
  'q_perf_05': {
    id: 'q_perf_05',
    topic: 'performance',
    difficulty: 2,
    type: 'predict_output',
    question: 'What attribute returns the total memory consumed by all elements of an array in bytes?',
    options: ['arr.nbytes', 'arr.total_bytes', 'arr.memory_size', 'arr.size * 10'],
    correctAnswer: 'arr.nbytes',
    hint: 'Aria whispers: arr.nbytes = arr.size * arr.itemsize.',
    explanation: '`arr.nbytes` computes the total bytes consumed by the array buffer.',
    requiredConcepts: ['nbytes']
  },

  // Level 39: Advanced & Fancy Indexing
  'q_advidx_03': {
    id: 'q_advidx_03',
    topic: 'advanced',
    difficulty: 4,
    type: 'predict_output',
    question: 'For matrix = np.array([[10, 20], [30, 40]]), what does matrix[[0, 1], [1, 0]] extract?',
    options: ['[20 30]', '[10 40]', '[[20, 30], [10, 40]]', '[10 20]'],
    correctAnswer: '[20 30]',
    hint: 'Aria whispers: Coordinate pairs (0, 1) and (1, 0): matrix[0, 1] is 20, matrix[1, 0] is 30.',
    explanation: 'Fancy indexing with two integer arrays selects coordinates (0, 1) -> 20, and (1, 0) -> 30: `[20 30]`.',
    requiredConcepts: ['fancy-indexing', 'coordinate-selection']
  },
  'q_advidx_04': {
    id: 'q_advidx_04',
    topic: 'advanced',
    difficulty: 4,
    type: 'predict_output',
    question: 'How do you modify elements at specific indices [1, 3] in-place to 0?',
    options: ['arr[[1, 3]] = 0', 'arr.set([1, 3], 0)', 'arr.put(0, [1, 3])', 'arr[1 & 3] = 0'],
    correctAnswer: 'arr[[1, 3]] = 0',
    hint: 'Aria whispers: Fancy indexing assignment modifies the array in-place.',
    explanation: '`arr[[1, 3]] = 0` sets the values at indices 1 and 3 to 0.',
    requiredConcepts: ['fancy-indexing', 'in-place-assignment']
  },
  'q_advidx_05': {
    id: 'q_advidx_05',
    topic: 'advanced',
    difficulty: 4,
    type: 'multiple_choice',
    question: 'What is the key difference between basic slicing and fancy indexing memory behavior?',
    options: [
      'Basic slicing returns a memory view; fancy indexing always allocates and returns a new copy',
      'Fancy indexing is faster than basic slicing',
      'Basic slicing creates copies; fancy indexing creates views',
      'There is no memory difference'
    ],
    correctAnswer: 'Basic slicing returns a memory view; fancy indexing always allocates and returns a new copy',
    hint: 'Aria whispers: Always remember that indexing with arrays or lists makes a copy!',
    explanation: 'Basic slice syntax `arr[1:3]` shares memory (view), whereas integer array indexing `arr[[1, 2]]` returns a copy.',
    requiredConcepts: ['fancy-indexing', 'copy-vs-view']
  },

  // Level 40: Dimension Manipulation
  'q_dim_03': {
    id: 'q_dim_03',
    topic: 'advanced',
    difficulty: 4,
    type: 'shape_prediction',
    question: 'What is the shape of np.expand_dims(arr, axis=-1) if arr has shape (5, 6)?',
    options: ['(5, 6, 1)', '(1, 5, 6)', '(5, 1, 6)', '(30, 1)'],
    correctAnswer: '(5, 6, 1)',
    hint: 'Aria whispers: axis=-1 appends the new dimension of length 1 at the end.',
    explanation: '`axis=-1` inserts a dimension of size 1 at the trailing position: `(5, 6, 1)`.',
    requiredConcepts: ['expand_dims', 'trailing-axis']
  },
  'q_dim_04': {
    id: 'q_dim_04',
    topic: 'advanced',
    difficulty: 4,
    type: 'shape_prediction',
    question: 'What does np.atleast_2d(np.array([1, 2, 3])).shape return?',
    options: ['(1, 3)', '(3, 1)', '(3,)', '(1, 1, 3)'],
    correctAnswer: '(1, 3)',
    hint: 'Aria whispers: atleast_2d converts 1D arrays to 2D row vectors.',
    explanation: '`np.atleast_2d()` guarantees at least 2 dimensions, reshaping a 1D vector `(3,)` to a row vector `(1, 3)`.',
    requiredConcepts: ['atleast_2d']
  },
  'q_dim_05': {
    id: 'q_dim_05',
    topic: 'advanced',
    difficulty: 4,
    type: 'shape_prediction',
    question: 'What does np.atleast_3d(np.array([1, 2])).shape return?',
    options: ['(1, 2, 1)', '(2, 1, 1)', '(1, 1, 2)', '(2,)'],
    correctAnswer: '(1, 2, 1)',
    hint: 'Aria whispers: atleast_3d converts a 1D array into shape (1, N, 1).',
    explanation: '`np.atleast_3d()` reshapes a 1D vector of length 2 into `(1, 2, 1)`.',
    requiredConcepts: ['atleast_3d']
  },

  // Level 41: Numerical Utilities
  'q_algo_04': {
    id: 'q_algo_04',
    topic: 'advanced',
    difficulty: 3,
    type: 'predict_output',
    question: 'What does np.diff(np.array([1, 3, 7, 10])) calculate?',
    options: ['[2 4 3]', '[3 4 3]', '[1 2 4 3]', '9'],
    correctAnswer: '[2 4 3]',
    hint: 'Aria whispers: diff calculates discrete differences: 3-1=2, 7-3=4, 10-7=3.',
    explanation: '`np.diff()` computes the discrete difference along the axis: `[3-1, 7-3, 10-7] = [2, 4, 3]`.',
    requiredConcepts: ['diff', 'discrete-difference']
  },
  'q_algo_05': {
    id: 'q_algo_05',
    topic: 'advanced',
    difficulty: 4,
    type: 'predict_output',
    question: 'What does np.interp(2.5, [1, 3], [10, 30]) return for linear interpolation?',
    options: ['25.0', '20.0', '15.0', '30.0'],
    correctAnswer: '25.0',
    hint: 'Aria whispers: 2.5 is 75% between 1 and 3; 10 + 0.75 * 20 = 25.0.',
    explanation: '`np.interp` performs 1D linear interpolation: at x=2.5, y evaluates to 25.0.',
    requiredConcepts: ['interp', 'linear-interpolation']
  }
};


