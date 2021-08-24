import { AvatarMiddleware } from './avatar.middleware';

describe('AvatarMiddleware', () => {
  it('should be defined', () => {
    expect(new AvatarMiddleware()).toBeDefined();
  });
});
