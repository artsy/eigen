// Mock for moti to reduce memory usage in tests
const React = require("react")
const { View } = require("react-native")

module.exports = {
  __esModule: true,
  MotiView: View,
  View: View,
  AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
  motify: (Component) => () => Component,
  useDynamicAnimation: () => ({
    current: {
      height: 0,
    },
    start: jest.fn(),
    stop: jest.fn(),
    animateTo: jest.fn(),
    animateToEnd: jest.fn(),
    animateToStart: jest.fn(),
    animateToValue: jest.fn(),
    animateToEndValue: jest.fn(),
    animateToStartValue: jest.fn(),
  }),
}
