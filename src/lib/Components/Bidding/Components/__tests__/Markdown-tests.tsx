import React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"

import { BiddingThemeProvider } from "../BiddingThemeProvider"
import { LinkText, Markdown } from "../Markdown"

jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentModalViewController: jest.fn() }))
import SwitchBoard from "lib/NativeModules/SwitchBoard"
const SwitchBoardMock = SwitchBoard as any
const { anything } = expect

beforeEach(() => {
  SwitchBoardMock.presentModalViewController.mockReset()
})

it("renders multiple paragraphs as Text elements", () => {
  const markdown = renderer.create(
    <BiddingThemeProvider>
      <Markdown>
        paragraph 1 has some text.{"\n"}
        {"\n"}
        paragraph 2 also has text.
      </Markdown>
    </BiddingThemeProvider>
  )

  expect(markdown.root.findAllByType(Text).length).toEqual(2)
  expect(markdown.root.findAllByType(Text)[0].props.children[0]).toMatch("paragraph 1 has some text")
  expect(markdown.root.findAllByType(Text)[1].props.children[0]).toMatch("paragraph 2 also has text")
})

it("renders links as LinkText", () => {
  const markdown = renderer.create(
    <BiddingThemeProvider>
      <Markdown>
        Sorry, your bid wasn’t received before{"\n"}
        live bidding started. To continue{"\n"}
        bidding, please [join the live auction](http://www.artsy.net).
      </Markdown>
    </BiddingThemeProvider>
  )

  expect(markdown.root.findAllByType(LinkText).length).toEqual(1)
  expect(markdown.root.findAllByType(LinkText)[0].props.children[0]).toMatch("join the live auction")

  markdown.root.findAllByType(LinkText)[0].props.onPress()

  expect(SwitchBoardMock.presentModalViewController).toHaveBeenCalledWith(anything(), "http://www.artsy.net")
})

it("renders mailto links as LinkText", () => {
  const markdown = renderer.create(
    <BiddingThemeProvider>
      <Markdown>
        Your bid can’t be placed at this time.{"\n"}
        Please contact [support@artsy.net](mailto:support@artsy.net) for{"\n"}
        more information.
      </Markdown>
    </BiddingThemeProvider>
  )

  expect(markdown.root.findAllByType(LinkText).length).toEqual(1)
  expect(markdown.root.findAllByType(LinkText)[0].props.children[0]).toMatch("support@artsy.net")

  markdown.root.findAllByType(LinkText)[0].props.onPress()

  expect(SwitchBoardMock.presentModalViewController).toHaveBeenCalledWith(anything(), "mailto:support@artsy.net")
})
