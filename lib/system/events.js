/* @flow */
'use strict'

export type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  }
}
