import crypto from 'crypto';

export const hashPassword = (password) => {
  const newpassword =  crypto.createHash('sha256').update(password).digest('hex');
  return newpassword;
};

export const comparePassword = (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      throw new Error('Le mot de passe ou le hash est manquant');
    }
    const hashedInputPassword = hashPassword(password);
    const isMatch = hashedInputPassword === hashedPassword;
    return isMatch;
  } catch (error) {
    console.error('Erreur lors de la comparaison des mots de passe:', error);
    return false;
  }
};

