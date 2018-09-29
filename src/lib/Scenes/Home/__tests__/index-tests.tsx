import { shallow } from "enzyme"
import { Tab } from "lib/Components/TabBar"
import React from "react"
import { NativeModules } from "react-native"
import Home from "../index"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

beforeAll(() => {
  // FIXME: BNMO - Update with Echo setting and remove once BNMO has launched
  NativeModules.Emission = { options: { enableBuyNowMakeOffer: true } }
})

it("has the correct number of tabs", () => {
  const wrapper = shallow(<Home initialTab={0} isVisible={true} tracking={null} />)
  expect(wrapper.find(Tab)).toHaveLength(3)
})
