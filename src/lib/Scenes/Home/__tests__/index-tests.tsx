import { shallow } from "enzyme"
import { Tab } from "lib/Components/TabBar"
import React from "react"
import Home from "../index"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

it("has the correct number of tabs", () => {
  const wrapper = shallow(<Home initialTab={0} isVisible={true} tracking={null} />)
  expect(wrapper.find(Tab)).toHaveLength(3)
})
