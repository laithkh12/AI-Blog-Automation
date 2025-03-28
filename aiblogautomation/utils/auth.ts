import bcrypt from "bcryptjs";

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Adjust based on security/performance trade-offs
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare a password with the stored hash
export const comparePassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, storedHash);
  return isMatch;
};
