// Memoization cache for fast repeated lookup
const codeCache = new Map<number, string>();

/**
 * Generates office codes in Excel-style sequence:
 * 1-999: "001" to "999" 
 * 1000-1998: "A001" to "A999"
 * 1999+: "B001", "B002", ... "Z999", "AA001", "AA002", etc.
 */
export function getOfficeCode(index: number): string {
  // Check memoization cache first
  if (codeCache.has(index)) {
    return codeCache.get(index)!;
  }

  let code: string;

  if (index <= 999) {
    // Simple numeric codes: 001-999
    code = index.toString().padStart(3, '0');
  } else {
    // Zero-based conversion for alphabetic prefix calculation
    const zeroBasedIndex = index - 1000;
    
    // Block size: 999 codes per letter (A001-A999, B001-B999, etc.)
    const blockSize = 999;
    const blockIndex = Math.floor(zeroBasedIndex / blockSize);
    
    // Letter-prefix generation using Excel-style conversion
    const letterPrefix = getExcelColumnName(blockIndex + 1);
    
    // Numeric padding: position within current block (1-999)
    const numericPart = (zeroBasedIndex % blockSize) + 1;
    const paddedNumeric = numericPart.toString().padStart(3, '0');
    
    code = `${letterPrefix}${paddedNumeric}`;
  }

  // Store in memoization cache
  codeCache.set(index, code);
  return code;
}

/**
 * Converts number to Excel-style column name (A, B, ..., Z, AA, AB, ...)
 */
function getExcelColumnName(columnNumber: number): string {
  let result = '';
  
  while (columnNumber > 0) {
    columnNumber--; // Make it 0-based
    result = String.fromCharCode(65 + (columnNumber % 26)) + result;
    columnNumber = Math.floor(columnNumber / 26);
  }
  
  return result;
}

/**
 * Converts office code back to index number for comparison
 * "001" -> 1, "002" -> 2, "A001" -> 1000, etc.
 */
function getIndexFromCode(code: string): number {
  // Check if it's a simple numeric code (001-999)
  if (/^\d{3}$/.test(code)) {
    return parseInt(code, 10);
  }
  
  // Handle alphabetic prefix codes (A001, B001, etc.)
  const match = code.match(/^([A-Z]+)(\d{3})$/);
  if (match) {
    const letterPrefix = match[1];
    const numericPart = parseInt(match[2], 10);
    
    // Convert letter prefix to block index
    let blockIndex = 0;
    for (let i = 0; i < letterPrefix.length; i++) {
      const charCode = letterPrefix.charCodeAt(letterPrefix.length - 1 - i);
      const letterValue = charCode - 64; // A=1, B=2, etc.
      blockIndex += letterValue * Math.pow(26, i);
    }
    
    // Calculate index: 1000 + (blockIndex - 1) * 999 + (numericPart - 1)
    return 1000 + (blockIndex - 1) * 999 + (numericPart - 1);
  }
  
  return 0; // Invalid code
}

/**
 * Finds the next available office code based on existing codes
 * Ensures sequential ordering without duplicates
 */
export function getNextOfficeCode(existingCodes: string[]): string {
  if (existingCodes.length === 0) {
    return getOfficeCode(1);
  }
  
  // Convert all existing codes to indices and find the maximum
  const existingIndices = existingCodes
    .map(code => getIndexFromCode(code))
    .filter(index => index > 0) // Filter out invalid codes
    .sort((a, b) => a - b);
  
  if (existingIndices.length === 0) {
    return getOfficeCode(1);
  }
  
  // Find the highest index and increment by 1
  const maxIndex = Math.max(...existingIndices);
  return getOfficeCode(maxIndex + 1);
} 