describe("useArtworkForm", () => {
  it.todo("works")
})

/*
// TODO: Reenable once we figure out circular dep issue involving GlobalStore

import { useFormikContext } from "formik"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { useArtworkForm } from "./useArtworkForm"

jest.mock("formik")
jest.mock("react")

describe("useArtworkForm", () => {
  const useEffectMock = useEffect as jest.Mock
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useEffectMock.mockImplementation((x) => x)
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      values: {
        medium: "Painting",
      },
    }))
  })

  it("returns a formik instance", () => {
    const wrapper = useArtworkForm()
    expect(wrapper.formik.values.medium).toBe("Painting")
  })

  it("updates formik values in store", (done) => {
    const spy = jest.fn()
    GlobalStore.actions.myCollection.artwork.setFormValues = spy as any
    useArtworkForm()
    setImmediate(() => {
      expect(spy).toHaveBeenCalled()
      done()
    })
  })
})

*/
