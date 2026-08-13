import arabicReshaper from 'arabic-reshaper';

/**
 * Fixes Arabic text for jsPDF by reshaping and reversing it.
 * @param text The Arabic text to fix.
 * @returns The fixed text.
 */
export const fixArabic = (text: string): string => {
  if (!text) return '';
  
  // Check if text contains Arabic characters
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  if (!arabicPattern.test(text)) return text;

  try {
    // Reshape the Arabic text using the default export's reshape method
    const reshaped = (arabicReshaper as any).reshape(text);
    
    // Reverse the reshaped text for jsPDF RTL support
    return reshaped.split('').reverse().join('');
  } catch (e) {
    console.error("Arabic reshaping error:", e);
    return text;
  }
};
