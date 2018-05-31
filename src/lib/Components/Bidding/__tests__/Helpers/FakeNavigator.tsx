import React from "react"
import { Route } from "react-native"
import * as renderer from "react-test-renderer"

export class FakeNavigator {
  private stack: Route[] = []

  push(route: Route) {
    this.stack.push(route)
  }

  pop() {
    this.stack.pop()
  }

  popN(n: number) {
    for (let count = 0; count++; count < n) {
      this.stack.pop()
    }
  }

  nextStep() {
    const currentRoute = this.stack[this.stack.length - 1]

    return renderer.create(
      React.createElement(currentRoute.component, {
        ...currentRoute.passProps,
        navigator: this,
        relay: {
          environment: null,
        },
      })
    )
  }
}
