import { fireEvent } from "@testing-library/react-native"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { useFormikContext } from "formik"
import { Touchable } from "palette"
import { Modal, TouchableOpacity } from "react-native"
import { act } from "react-test-renderer"
import { CategoryPicker } from "./CategoryPicker"

jest.mock("formik")
jest.unmock("react-relay")

describe("CategoryPicker", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      values: {
        category: "Painting",
      },
    }))
  })

  it("displays and selects the correct category", async () => {
    const handleChangeMock = jest.fn()
    const { UNSAFE_getAllByType } = renderWithHookWrappersTL(
      <CategoryPicker
        handleChange={handleChangeMock}
        options={artworkMediumCategories}
        value={null}
      />
    )
    const SelectInput = UNSAFE_getAllByType(TouchableOpacity)[0]
    await act(() => fireEvent(SelectInput, "onPress"))
    const modal = UNSAFE_getAllByType(Modal)[0]
    modal.findAllByType(Touchable)[0].props.onPress()

    expect(handleChangeMock).toHaveBeenCalledWith(artworkMediumCategories[0].value, 0)
  })
})
