import { Flex } from "@artsy/palette"
import React from "react"
import { Text, View } from "react-native"
import { plainTextFromTree } from "../plainTextFromTree"

describe("plainTextFromTree", () => {
  it("returns the original string if given just a string", () => {
    expect(plainTextFromTree("Hello")).toEqual("Hello")
  })

  it("returns the text from within a single element", () => {
    expect(plainTextFromTree(<Text>Hello</Text>)).toEqual("Hello")
  })

  it("returns text nested multiple levels deep", () => {
    const component = (
      <View>
        <Flex>
          <Text>Hi </Text>
          <Text>this </Text>
          <Text>is </Text>
        </Flex>
        <Flex>
          <Text>very </Text>
          <Text>broken </Text>
          <Text>up </Text>
        </Flex>
        <Text>but that's OK</Text>
      </View>
    )

    expect(plainTextFromTree(component)).toEqual("Hi this is very broken up but that's OK")
  })
})
