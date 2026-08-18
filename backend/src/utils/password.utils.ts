import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;

  const hashedPasswd = await bcrypt.hash(password, saltRounds);

  return hashedPasswd;
};

export const validatePassword = async (
  passwordToValidate: string,
  realPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(passwordToValidate, realPassword);

  return isMatch;
};
