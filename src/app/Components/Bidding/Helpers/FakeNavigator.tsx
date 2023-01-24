import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import React from "react"
import { Route } from "react-native"

/**
 * @deprecated Stop using this. This is for mocking NavigationIOS, which has been deprecated for years.
 */
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

    return renderWithWrappersLEGACY(
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
