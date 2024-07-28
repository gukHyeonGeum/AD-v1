import { DrinkingPipe } from './drinking.pipe';

describe('DrinkingPipe', () => {
  it('create an instance', () => {
    const pipe = new DrinkingPipe();
    expect(pipe).toBeTruthy();
  });
});
