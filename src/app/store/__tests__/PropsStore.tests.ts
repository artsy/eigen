import { propsStore } from "app/store/PropsStore"

describe("propsStore", () => {
  describe(propsStore.setPendingProps, () => {
    it("stores and retrieves props for a module", () => {
      const pendingProps = {
        str: "a string",
        afunc: () => null,
      }
      propsStore.setPendingProps("myModule", pendingProps)
      expect(propsStore.getPropsForModule("myModule")).toEqual(pendingProps)
    })
    it("overwrites whatever already exists for a module", () => {
      const initialProps = {
        str: "a string",
        afunc: () => null,
      }
      propsStore.setPendingProps("myModule", initialProps)

      const nextProps = {}
      propsStore.setPendingProps("myModule", nextProps)

      expect(propsStore.getPropsForModule("myModule")).not.toEqual(initialProps)
      expect(propsStore.getPropsForModule("myModule")).toEqual(nextProps)
    })
  })

  describe(propsStore.getPropsForModule, () => {
    it("returns empty dictionary if the module has not been set", () => {
      expect(propsStore.getPropsForModule("a-module-never-set")).toEqual({})
    })
  })

  describe(propsStore.mergeNewPropsForModule, () => {
    it("indeed merges new props for module", () => {
      const first = { str: "a string" }
      const second = { deezFunc: () => null }
      const expected = { str: first.str, deezFunc: second.deezFunc }
      const moduleName = "Modularrr"
      propsStore.setPendingProps(moduleName, first)
      propsStore.mergeNewPropsForModule(moduleName, second)
      expect(propsStore.getPropsForModule(moduleName)).toEqual(expected)
    })
  })

  describe(propsStore.updateProps, () => {
    it("calls callback with latest updated props", () => {
      const callback = jest.fn()
      const first = { str: "a string" }
      const second = { str: "a diff string", deezFunc: () => null }
      const expected = { str: second.str, deezFunc: second.deezFunc }
      const moduleName = "banananana"
      propsStore.setPendingProps(moduleName, first)
      propsStore.updateProps(moduleName, second, callback)

      expect(callback).toBeCalledWith(expected)
    })
  })
})
