export type RGB = {
  r: number;
  g: number;
  b: number;
};

export function hexToRgb(hex: string): RGB | null {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Check if the hex code is valid
  if (hex.length !== 3 && hex.length !== 6) {
      throw new Error('Invalid hex color code');
  }

  // If the hex code is shorthand (e.g., "03F"), convert it to full form (e.g., "0033FF")
  if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
  }

  // Parse the hex string
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  return { r, g, b };
}

export function rgbToHex({ r, g, b }: RGB): string {
  // Ensure each RGB value is between 0.0 and 1.0
  if (
    r < 0.0 || r > 1.0 ||
    g < 0.0 || g > 1.0 ||
    b < 0.0 || b > 1.0
  ) {
    throw new Error('Invalid RGB color values');
  }

  // Convert each RGB value to a two-character hexadecimal string
  const toHex = (value: number) => Math.round(value * 255).toString(16).padStart(2, '0');

  // Concatenate the hexadecimal strings
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

