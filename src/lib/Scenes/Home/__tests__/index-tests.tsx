import React from "react"

import { shallow } from "enzyme"
import { Tab } from "lib/Components/TabBar"
import Home from "../index"

it("has the correct number of tabs", () => {
  const wrapper = shallow(<Home />)
  expect(wrapper.find(Tab)).toHaveLength(3)
})
