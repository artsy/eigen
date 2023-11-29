import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { ComponentClass, FunctionComponent, createElement } from "react"

interface Route {
  component?: FunctionComponent | ComponentClass
  passProps?: any
}

/**
 * @deprecated Stop using this. This is for mocking NavigationIOS, which has been deprecated for years.
 */
export class FakeNavigator {
  private stack: Route[] = []

  push(route: any) {
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

    if (currentRoute.component) {
      return renderWithWrappersLEGACY(
        <>
          {createElement(currentRoute.component, {
            ...currentRoute.passProps,
            nextScreen: true,
            navigator: this,
            relay: {
              environment: null,
            },
          })}
        </>
      )
    } else {
      throw "No component found on route"
    }
  }
}
