import React from "react"
import * as renderer from "react-test-renderer"

import { theme } from "../../Elements/Theme"
import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { Input } from "../Input"

it("shows a gray border by default", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.black10)
})

it("shows a purple border on focus", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  const inputComponent = component.root.findByType(Input).instance

  inputComponent.onFocus()

  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.purple100)
})

it("changes the border color back to gray on blur", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Input />
    </BiddingThemeProvider>
  )

  const inputComponent = component.root.findByType(Input).instance

  inputComponent.onFocus()
  inputComponent.onBlur()

  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.black10)
})

it("shows a red border if error is true", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Input error />
    </BiddingThemeProvider>
  )

  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.red100)
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

  const component = renderer.create(<TestFormForInput />)

  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.black10)

  // Explicitly calling setState to force-render the Input component
  component.root.instance.setState({ error: true })

  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.red100)

  component.root.instance.setState({ error: false })

  expect(component.toJSON().props.style[0].borderColor).toEqual(theme.colors.black10)
})
