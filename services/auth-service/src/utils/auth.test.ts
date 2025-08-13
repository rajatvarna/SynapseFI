import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
} from './auth';

describe('Auth Utils', () => {
  // Set a dummy secret for testing
  process.env.JWT_SECRET = 'test-secret';

  describe('Password Hashing', () => {
    it('should hash a password and then successfully compare it', async () => {
      const password = 'my-secret-password';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).not.toBe(password);

      const isMatch = await comparePassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should fail to compare a wrong password', async () => {
      const password = 'my-secret-password';
      const wrongPassword = 'wrong-password';
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(wrongPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });
  });

  describe('JWT Management', () => {
    it('should generate a token and then successfully verify it', () => {
      const userId = 123;
      const token = generateToken(userId);

      const decoded = verifyToken(token) as { userId: number };
      expect(decoded.userId).toBe(userId);
    });

    it('should throw an error for an invalid token', () => {
      const invalidToken = 'invalid-token-string';
      expect(() => verifyToken(invalidToken)).toThrow();
    });
  });
});
