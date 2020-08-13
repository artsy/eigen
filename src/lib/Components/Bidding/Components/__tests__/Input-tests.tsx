import React from "react"
import { TextInput } from "react-native"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { theme } from "../../Elements/Theme"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Input } from "../Input"

it("shows a gray border by default", () => {
  const component = renderWithWrappers(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  expect(component.toJSON()).toBeTruthy()
  expect(component.toJSON()?.props.style[0].borderColor).toEqual(theme.colors.black10)
})

it("shows a purple border on focus", () => {
  const component = renderWithWrappers(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  const inputComponent = component.root.findByType(Input).instance

  inputComponent.onFocus()

  expect(component.toJSON()).toBeTruthy()
  expect(component.toJSON()?.props.style[0].borderColor).toEqual(theme.colors.purple100)
})

it("changes the border color back to gray on blur", () => {
  const component = renderWithWrappers(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  const inputComponent = component.root.findByType(Input).instance

  inputComponent.onFocus()
  inputComponent.onBlur()

  expect(component.toJSON()).toBeTruthy()
  expect(component.toJSON()?.props.style[0].borderColor).toEqual(theme.colors.black10)
})

it("shows a red border if error is true", () => {
  const component = renderWithWrappers(
    <BiddingThemeProvider>
      <Input error />
    </BiddingThemeProvider>
  )

  expect(component.toJSON()).toBeTruthy()
  expect(component.toJSON()?.props.style[0].borderColor).toEqual(theme.colors.red100)
})

it("updates the border color when the parent component updates the error prop", () => {
  class TestFormForInput extends React.Component {
    state = { error: false }

    render() {
      return (
        <BiddingThemeProvider>
          <Input error={this.state.error} />
        </BiddingThemeProvider>
      )
    }
  }

  const component = renderWithWrappers(<TestFormForInput />)

  expect(component.toJSON()).toBeTruthy()
  expect(component.toJSON()?.props.style[0].borderColor).toEqual(theme.colors.black10)

  // Explicitly calling setState to force-render the Input component
  const parentComponent = component.root.findByType(TestFormForInput).instance
  parentComponent.setState({ error: true })

  expect(component.toJSON()).toBeTruthy()
  expect(component.toJSON()?.props.style[0].borderColor).toEqual(theme.colors.red100)

  parentComponent.setState({ error: false })

  expect(component.toJSON()).toBeTruthy()
  expect(component.toJSON()?.props.style[0].borderColor).toEqual(theme.colors.black10)
})

it("allows for capturing the ref to the actual text input", () => {
  // FXIME: This is a StyledNativeComponent instance. Find the appropriate type and replace any with it.
  let inputRef: any

  const component = renderWithWrappers(
    <BiddingThemeProvider>
      <Input inputRef={element => (inputRef = element)} />
    </BiddingThemeProvider>
  )

  const actualTextInput = component.root.findByType(Input).findByType(TextInput).instance

  expect(inputRef).toBe(actualTextInput)
})
