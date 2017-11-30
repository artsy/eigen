import Home from "../index"
import React from "react"
import { Tab } from "lib/Components/TabBar"
import { shallow } from "enzyme"

it("has the correct number of tabs", () => {
  const wrapper = shallow(<Home />)
  expect(wrapper.find(Tab)).toHaveLength(3)
})
