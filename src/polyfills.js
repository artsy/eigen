/**
 * DOM Polyfills for React Native
 * 
 * This file provides polyfills for DOM APIs that some libraries (styled-components, 
 * moti, etc.) reference even in React Native builds.
 * 
 * With React Native 0.79+ and Metro 0.82+, module evaluation is stricter and these
 * references cause "Property doesn't exist" errors even when behind platform checks.
 * 
 * This polyfill must be imported at the very top of index.js before any other imports.
 */

if (typeof document === 'undefined' && typeof global !== 'undefined') {
  const noop = () => {}
  const noopReturningEmptyArray = () => []
  const noopReturningNull = () => null
  const noopReturningEmptyObject = () => ({})
  
  // Mock HTML Element constructors
  const mockHTMLElement = class HTMLElement {}
  
  // Add all HTML*Element constructors that styled-components might reference
  const htmlElements = [
    'HTMLElement', 'HTMLDivElement', 'HTMLSpanElement', 'HTMLButtonElement',
    'HTMLAnchorElement', 'HTMLImageElement', 'HTMLInputElement', 'HTMLFormElement',
    'HTMLTextAreaElement', 'HTMLSelectElement', 'HTMLOptionElement', 'HTMLLabelElement',
    'HTMLHeadingElement', 'HTMLParagraphElement', 'HTMLUListElement', 'HTMLOListElement',
    'HTMLLIElement', 'HTMLTableElement', 'HTMLTableRowElement', 'HTMLTableCellElement',
    'HTMLCanvasElement', 'HTMLVideoElement', 'HTMLAudioElement', 'HTMLIFrameElement',
    'HTMLStyleElement', 'HTMLLinkElement', 'HTMLMetaElement', 'HTMLScriptElement',
    'HTMLHRElement', 'HTMLBRElement', 'HTMLPreElement', 'HTMLCodeElement',
    'HTMLFieldSetElement', 'HTMLLegendElement', 'HTMLOptGroupElement', 'HTMLDataListElement'
  ]
  
  htmlElements.forEach(name => {
    global[name] = mockHTMLElement
  })
  
  global.document = {
    addEventListener: noop,
    removeEventListener: noop,
    querySelectorAll: noopReturningEmptyArray,
    querySelector: noopReturningNull,
    getElementById: noopReturningNull,
    getElementsByClassName: noopReturningEmptyArray,
    getElementsByTagName: noopReturningEmptyArray,
    createElement: noopReturningEmptyObject,
    createTextNode: noopReturningEmptyObject,
    createDocumentFragment: noopReturningEmptyObject,
    body: {
      appendChild: noop,
      removeChild: noop,
      insertBefore: noop,
      replaceChild: noop,
    },
    head: {
      appendChild: noop,
      removeChild: noop,
    },
    documentElement: {
      style: {},
    },
  }
  
  global.window = global.window || {
    addEventListener: noop,
    removeEventListener: noop,
    document: global.document,
  }
  
  // Add other common browser globals
  global.navigator = global.navigator || {
    userAgent: 'react-native',
    platform: 'react-native',
  }
  
  global.location = global.location || {
    href: '',
    origin: '',
    protocol: '',
    host: '',
    hostname: '',
    port: '',
    pathname: '',
    search: '',
    hash: '',
  }
}