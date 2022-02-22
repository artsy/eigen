import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { Route } from "react-native"

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

  stackSize() {
    return this.stack.length
  }

  nextRoute() {
    return this.stack[this.stack.length - 1]
  }

  previousRoute() {
    return this.stack[this.stack.length - 2]
  }

  nextStep() {
    const currentRoute = this.stack[this.stack.length - 1]

    return renderWithWrappers(
      <>
        {React.createElement(currentRoute.component!, {
          ...currentRoute.passProps,
          nextScreen: true,
          navigator: this,
          relay: {
            environment: null,
          },
        })}
      </>
    )
  }
}
