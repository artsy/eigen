jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))
jest.mock("lib/options", () => ({ options: {} }))
jest.mock("@react-native-community/netinfo", () => {
  return {
    addEventListener: jest.fn(),
    isConnected: {
      fetch: () => {
        return new Promise(accept => {
          accept(false)
        })
      },
      addEventListener: jest.fn(),
    },
  }
})

import { options } from "lib/options"

import { shallow } from "enzyme"
import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import { Tab } from "lib/Components/TabBar"
import React from "react"
import { Home } from "../Home"

it("has the correct number of tabs", () => {
  const wrapper = shallow(<Home initialTab={0} isVisible={true} tracking={null} />)
  expect(wrapper.find(Tab)).toHaveLength(3)
})

it("defaults to showing the sash", () => {
  options.hideConsignmentsSash = undefined
  const wrapper = shallow(<Home initialTab={0} isVisible={true} tracking={null} />)
  expect(wrapper.find(DarkNavigationButton)).toHaveLength(1)
})

it("can hide the sash by setting the global option hideConsignmentsSash", () => {
  options.hideConsignmentsSash = true
  const wrapper = shallow(<Home initialTab={0} isVisible={true} tracking={null} />)
  expect(wrapper.find(DarkNavigationButton)).toHaveLength(0)
})
