import { customAlphabet } from 'nanoid';

// Define the alphabet excluding dashes
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Create a custom nanoid generator
export const idGenerator = customAlphabet(alphabet, 10); // 21 is the default length for nanoid