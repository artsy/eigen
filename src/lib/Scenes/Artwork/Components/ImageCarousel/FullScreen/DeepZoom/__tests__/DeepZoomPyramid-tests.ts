import { DeepZoomPyramid } from "../DeepZoomPyramid"
import { DeepZoomTileID } from "../DeepZoomTile"

describe(DeepZoomPyramid, () => {
  jest.useFakeTimers()

  it("keeps track of tiles", () => {
    const pyramid = new DeepZoomPyramid()
    const id = DeepZoomTileID.create(1, 0, 0)
    const onShouldLoad = jest.fn()
    pyramid.willMount(id)
    pyramid.didMount({ id, onShouldLoad })
    jest.runAllTimers()
    expect(onShouldLoad).toHaveBeenCalledTimes(1)

    // add a tile below and make sure it doesn't get loaded until the one above completes
    const belowId = DeepZoomTileID.create(0, 0, 0)
    const belowShouldLoad = jest.fn()
    pyramid.willMount(belowId)
    pyramid.didMount({ id: belowId, onShouldLoad: belowShouldLoad })
    jest.runAllTimers()
    expect(onShouldLoad).toHaveBeenCalledTimes(1)
    expect(belowShouldLoad).toHaveBeenCalledTimes(0)

    // complete the one above
    pyramid.didLoad(id)
    jest.runAllTimers()
    expect(belowShouldLoad).toHaveBeenCalledTimes(1)
  })

  it("only loads one layer at a time even if tiles are added together", () => {
    const pyramid = new DeepZoomPyramid()
    const id = DeepZoomTileID.create(1, 0, 0)
    const onShouldLoad = jest.fn()
    const belowId = DeepZoomTileID.create(0, 0, 0)
    const belowShouldLoad = jest.fn()
    pyramid.willMount(id)
    pyramid.willMount(belowId)
    pyramid.didMount({ id, onShouldLoad })
    pyramid.didMount({ id: belowId, onShouldLoad: belowShouldLoad })
    jest.runAllTimers()
    expect(onShouldLoad).toHaveBeenCalledTimes(1)
    expect(belowShouldLoad).toHaveBeenCalledTimes(0)

    // complete the one above
    pyramid.didLoad(id)
    jest.runAllTimers()
    expect(onShouldLoad).toHaveBeenCalledTimes(1)
    expect(belowShouldLoad).toHaveBeenCalledTimes(1)
  })
})
