import { StackNavigationProp } from "@react-navigation/stack"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { Dimensions } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/Dimensions"
import { MyCollectionArtworkStore } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkStore"
import { MyCollectionArtworkFormMain } from "app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkFormMain"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"

jest.mock("formik")

jest.mock("app/Components/NavigationHeader", () => ({
  NavigationHeader: () => null,
}))

jest.mock("app/Components/ArtistAutosuggest/ArtistAutosuggest", () => ({
  ArtistAutosuggest: () => null,
}))

jest.mock("app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker", () => ({
  CategoryPicker: () => null,
}))

jest.mock("app/Scenes/MyCollection/Screens/ArtworkForm/Components/Dimensions", () => ({
  Dimensions: () => null,
}))

const mockShowActionSheetWithOptions = jest.fn()

jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: mockShowActionSheetWithOptions }),
}))

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve({ photos: [] })),
}))

describe.skip("AddEditArtwork", () => {
  const mockNav: Partial<StackNavigationProp<{}>> = {
    addListener: jest.fn(),
  }

  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        photos: [],
      },
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.reset()
  })

  xit("renders correct components on Add", () => {
    const artworkForm = (
      <MyCollectionArtworkStore.Provider
        runtimeModel={{
          mode: "add",
          artwork: {
            internalID: "id",
          },
        }}
      >
        <MyCollectionArtworkFormMain navigation={mockNav as any} route={null as any} />
      </MyCollectionArtworkStore.Provider>
    )
    const wrapper = renderWithWrappersLEGACY(artworkForm)
    const expected = [NavigationHeader, CategoryPicker, Dimensions]
    expected.forEach((Component) => {
      expect(wrapper.root.findByType(Component as React.ComponentType)).toBeDefined()
    })

    // not exposed components
    expect(wrapper.root.findByProps({ testID: "CompleteButton" })).toBeDefined()
    expect(wrapper.root.findByProps({ testID: "PhotosButton" })).toBeDefined()
  })

  xit("renders correct components on Edit", () => {
    const artworkForm = (
      <MyCollectionArtworkStore.Provider
        runtimeModel={{
          mode: "edit",
          artwork: {
            internalID: "id",
          },
        }}
      >
        <MyCollectionArtworkFormMain navigation={mockNav as any} route={null as any} />
      </MyCollectionArtworkStore.Provider>
    )
    const wrapper = renderWithWrappersLEGACY(artworkForm)
    const completeButton = wrapper.root.findByProps({ testID: "CompleteButton" })
    const deleteButton = wrapper.root.findByProps({ testID: "DeleteButton" })
    expect(completeButton).toBeDefined()
    expect(deleteButton).toBeDefined()
  })

  it("fires clear form on header Clear button click", () => {
    const mockDelete = jest.fn()

    const artworkForm = (
      <MyCollectionArtworkStore.Provider
        runtimeModel={{
          onDelete: mockDelete,
          artwork: {
            internalID: "id",
          },
        }}
      >
        <MyCollectionArtworkFormMain navigation={mockNav as any} route={null as any} />
      </MyCollectionArtworkStore.Provider>
    )
    // make form dirty
    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              width: "30",
            },
            dirtyFormCheckValues: {
              width: "40",
            },
          },
        },
      },
    })

    const wrapper = renderWithWrappersLEGACY(artworkForm)
    wrapper.root.findByType(NavigationHeader).props.onRightButtonPress()

    expect(mockShowActionSheetWithOptions).toHaveBeenCalled()

    const callback = mockShowActionSheetWithOptions.mock.calls[0][1]

    callback(0) // confirm discard
  })

  xit("fires formik's handleSubmit on complete button click", () => {
    const spy = jest.fn()
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: spy,
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        photos: [],
      },
    }))

    const mockDelete = jest.fn()

    const artworkForm = (
      <MyCollectionArtworkStore.Provider
        runtimeModel={{
          onDelete: mockDelete,
          mode: "edit",
          artwork: {
            internalID: "id",
          },
        }}
      >
        <MyCollectionArtworkFormMain navigation={mockNav as any} route={null as any} />
      </MyCollectionArtworkStore.Provider>
    )

    const wrapper = renderWithWrappersLEGACY(artworkForm)

    const completeButton = wrapper.root.findByProps({ testID: "CompleteButton" })
    completeButton.props.onPress()

    expect(spy).toHaveBeenCalled()
  })

  describe("delete artwork button", () => {
    xit("can be pressed", () => {
      const artworkForm = (
        <MyCollectionArtworkStore.Provider
          runtimeModel={{
            mode: "edit",
            artwork: {
              internalID: "id",
            },
          }}
        >
          <MyCollectionArtworkFormMain navigation={mockNav as any} route={null as any} />
        </MyCollectionArtworkStore.Provider>
      )

      const wrapper = renderWithWrappersLEGACY(artworkForm)

      const deleteButton = wrapper.root.findByProps({ testID: "DeleteButton" })
      deleteButton.props.onPress()
    })
  })
})
