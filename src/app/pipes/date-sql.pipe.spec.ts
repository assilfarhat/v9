import { DateSqlPipe } from './date-sql.pipe';

describe('DateSqlPipe', () => {
  it('create an instance', () => {
    const pipe = new DateSqlPipe();
    expect(pipe).toBeTruthy();
  });
});
