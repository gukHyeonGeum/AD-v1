import { SmokingPipe } from './smoking.pipe';

describe('SmokingPipe', () => {
  it('create an instance', () => {
    const pipe = new SmokingPipe();
    expect(pipe).toBeTruthy();
  });
});
