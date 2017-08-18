/* eslint-disable react/no-multi-comp */
import React from 'react';

const wTCDmock = jest.fn(() => () => {});
jest.setMock('../withTrackingComponentDecorator', wTCDmock);

const tEMDmock = jest.fn(() => () => {});
jest.setMock('../trackEventMethodDecorator', tEMDmock);


describe('tracking HoC', () => {
  // eslint-disable-next-line global-require
  const trackingHoC = require('../trackingHoC').default;

  it('detects a class', () => {
    const testClass = { testClass: true };
    const options = {};

    @trackingHoC(testClass, options)
    class TestClass extends React.Component {} // eslint-disable-line

    new TestClass(); // eslint-disable-line no-new

    expect(wTCDmock).toHaveBeenCalledWith(testClass, options);
  });

  it('detects a class method', () => {
    const testMethod = { testMethod: true };
    class TestMethod {
      @trackingHoC(testMethod)
      blah = () => {}
    }

    const myTest = new TestMethod();
    myTest.blah();

    expect(tEMDmock).toHaveBeenCalledWith(testMethod);
  });

  it('works on stateless functional components', () => {
    const testStateless = { testStateless: true };
    const options = {};
    const TestComponent = () => <div />;

    trackingHoC(testStateless, options)(TestComponent);

    expect(wTCDmock).toHaveBeenCalledWith(testStateless, options);
  });
});
