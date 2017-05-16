import { shallow } from "enzyme"
import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ArtworkRail, minRailHeight } from "../artwork_rail"

it("renders correctly", () => {
  const props = railProps(false) as any
  const tree = renderer.create(<ArtworkRail {...props} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it("has a min height while data is loading", () => {
  const props = railProps(false) as any
  const rail = new ArtworkRail(props)
  const railStyle = rail.railStyle()
  expect(railStyle.minHeight).toBe(minRailHeight)
})

it("has no min height when data is not loading", () => {
  const props = railProps(true) as any
  const wrapper = shallow(<ArtworkRail {...props} />)
  wrapper.setState({ didPerformFetch: true })

  const instance = wrapper.instance() as ArtworkRail
  const railStyle = instance.railStyle()
  expect(railStyle.minHeight).toBeUndefined()
})

it("renders nothing when there are no artworks", () => {
  const props = railProps(true) as any
  const wrapper = shallow(<ArtworkRail {...props} />)
  wrapper.setState({ didPerformFetch: true })
  expect(wrapper.instance().render()).toBeNull()
})

it("renders when there are artworks", () => {
  const props = railProps(true) as any
  props.rail.results = [{
      __dataID__: "QXJ0d29yazphY20tZW5udWk=",
  }]
  const rail = new ArtworkRail(props)
  expect(rail.render()).not.toBeNull()
})

const railProps = (startedFetching = true) => {
  return {
    rail: {
        key: "live_auctions",
        params: null,
        context: {
          href: "/auction/on-hold-sale",
        },
        results: [
        ],
    },
    relay: {
        pendingVariables: null,
        route: {
          name: "HomeRoute",
          params: {
          },
          queries: {
          },
        },
        setVariables: () => {
          return
        },
        variables: {
          fetchContent: startedFetching,
        },
    },
  }
}
