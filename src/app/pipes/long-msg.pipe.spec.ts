import { LongMsgPipe } from './long-msg.pipe';

describe('LongMsgPipe', () => {
  it('create an instance', () => {
    const pipe = new LongMsgPipe();
    expect(pipe).toBeTruthy();
  });
});
