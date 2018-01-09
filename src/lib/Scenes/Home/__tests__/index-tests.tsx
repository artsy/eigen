import { shallow } from "enzyme"
import { Tab } from "lib/Components/TabBar"
import React from "react"
import Home from "../index"

it("has the correct number of tabs", () => {
  const wrapper = shallow(<Home tracking={null} />)
  expect(wrapper.find(Tab)).toHaveLength(3)
})
