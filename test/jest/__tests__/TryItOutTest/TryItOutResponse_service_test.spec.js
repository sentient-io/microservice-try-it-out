import { tryItOutResService } from '../../../../src/services/TryItOut/TryItOutResponse_service';

const { processResponse, toObject } = tryItOutResService();

describe('processResponse()', () => {
  it('Always returns an object', () => {
    expect(typeof processResponse(testCase.apiResponse)).tobe('object');
  });
});

describe('toObject()', () => {
  it('Always returns an object', () => {
    expect(typeof toObject(testCase.apiResponse)).toBe('object');
  });
});

const testCase = {
  apiResponse: {
    results: 'Some results',
  },
};
