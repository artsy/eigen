import { renderHook } from "@testing-library/react-hooks"
import { useScreenDimensions } from "../useScreenDimensions"

describe(useScreenDimensions, () => {
  it("should give us dimensions", () => {
