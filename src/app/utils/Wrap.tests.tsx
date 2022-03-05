import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Text, View } from "react-native"
import { Wrap } from "./Wrap"

describe("Wrap", () => {
  const TestComp = ({ force }: { force: boolean }) => (
    <Wrap if={force}>
      <View testID="wrapper-view">
        <Wrap.Content>
          <Text testID="inner-text">wow</Text>
        </Wrap.Content>
      </View>
    </Wrap>
  )

  it("renders transparently when not wrapping", async () => {
    const { queryByTestId } = renderWithWrappersTL(<TestComp force={false} />)
    expect(queryByTestId("wrapper-view")).toBeFalsy()
    expect(queryByTestId("inner-text")).toBeTruthy()
  })

  it("renders transparently when wrapping", async () => {
    const { queryByTestId } = renderWithWrappersTL(<TestComp force />)

    expect(queryByTestId("wrapper-view")).toBeTruthy()
    expect(queryByTestId("inner-text")).toBeTruthy()
  })

  describe("edge cases", () => {
    it("doesn't allow zero Wrap.Content", async () => {
      expect(() =>
        renderWithWrappersTL(
          <Wrap if={false}>
            <Text testID="inner-text">wow</Text>
          </Wrap>
        )
      ).toThrowError("Wrap.Content is required")
    })

    it("doesn't allow more than exactly one Wrap.Content", async () => {
      expect(() =>
        renderWithWrappersTL(
          <Wrap if={false}>
            <View testID="wrapper-view">
              <Wrap.Content>
                <Text testID="inner-text">wow</Text>
              </Wrap.Content>
              <Wrap.Content>
                <Text testID="inner-text-2">wow2</Text>
              </Wrap.Content>
            </View>
          </Wrap>
        )
      ).toThrowError("You can't have more than one Wrap.Content")
    })

    it("doesn't allow more than exactly one Wrap.Content even if wrapped", async () => {
      expect(() =>
        renderWithWrappersTL(
          <Wrap if={false}>
            <View testID="wrapper-view">
              <Wrap.Content>
                <Text testID="inner-text">wow</Text>
                <Wrap.Content>
                  <Text testID="inner-text-2">wow2</Text>
                </Wrap.Content>
              </Wrap.Content>
            </View>
          </Wrap>
        )
      ).toThrowError("You can't have more than one Wrap.Content")
    })
  })
})
