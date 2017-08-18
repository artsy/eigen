import makeClassMemberDecorator from '../makeClassMemberDecorator';

describe('makeClassMemberDecorator', () => {
  it('is a decorator (exports a function, that returns a function)', () => {
    expect(typeof makeClassMemberDecorator).toBe('function');

    const decorated = makeClassMemberDecorator();
    expect(typeof decorated).toBe('function');
  });

  it('properly decorates class methods', () => {
    const mockDecorator = jest.fn(x => x);
    const thingSpy = jest.fn();
    class Test {
      @makeClassMemberDecorator(mockDecorator)
      thing() { // eslint-disable-line class-methods-use-this
        thingSpy();
      }
    }
    const myTest = new Test();

    expect(thingSpy).not.toHaveBeenCalled();
    myTest.thing();
    expect(mockDecorator).toHaveBeenCalledTimes(1);
    expect(thingSpy).toHaveBeenCalledTimes(1);
  });

  it('properly decorates field syntax', () => {
    const mockDecorator = jest.fn(x => x);
    const fieldSpy = jest.fn();
    class Test {
      @makeClassMemberDecorator(mockDecorator)
      field = fieldSpy
    }
    const myTest = new Test();

    expect(fieldSpy).not.toHaveBeenCalled();
    expect(mockDecorator).not.toHaveBeenCalled();
    myTest.field();
    expect(mockDecorator).toHaveBeenCalledTimes(1);
    expect(fieldSpy).toHaveBeenCalledTimes(1);
  });

  it('throws when called on unsupported descriptor', () => {
    expect(() => makeClassMemberDecorator()(null, null, {})).toThrow();
  });
});
