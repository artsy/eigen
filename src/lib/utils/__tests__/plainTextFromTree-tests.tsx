import { Flex } from "@artsy/palette"
import React from "react"
import { Text, View } from "react-native"
import { plainTextFromTree } from "../plainTextFromTree"
import { renderMarkdown } from "../renderMarkdown"

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

  it("correctly handles the output from renderMarkdown", () => {
    const markdown = "This is a *link* for an [artist](/artist/andy-warhol) and a [gene](/gene/minimalism)."
    const component = renderMarkdown(markdown)
    expect(plainTextFromTree(component)).toEqual("This is a link for an artist and a gene.")
  })

  it("correctly handles nulls and undefined", () => {
    expect(plainTextFromTree(null)).toEqual("")
    expect(plainTextFromTree(undefined)).toEqual("")
  })

  it("correctly handles booleans", () => {
    expect(plainTextFromTree(true)).toEqual("")
    expect(plainTextFromTree(false)).toEqual("")
  })

  it("correctly handles numbers", () => {
    expect(plainTextFromTree(<Text>{0.32}</Text>)).toEqual("0.32")
  })
})
