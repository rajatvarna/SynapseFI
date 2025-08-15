import { createWelcomeMessage } from './utils';

describe('createWelcomeMessage', () => {
  it('should return a welcome message with the given name', () => {
    const message = createWelcomeMessage('Jules');
    expect(message).toBe('Welcome, Jules!');
  });
});
