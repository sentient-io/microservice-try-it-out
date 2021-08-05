import { tryItOutService } from '../../../../src/services/TryItOut/TryItOut_service';

const {testing} = tryItOutService()

describe('testing()', () => {
  it('test if 0 is number', () => {
    expect(testing()).toBe('test');
  });
});
