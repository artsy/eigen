import { StackNavigationProp } from "@react-navigation/stack"
import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionArtworkStore } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkStore"
import { MyCollectionArtworkFormMain } from "app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkFormMain"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"

jest.mock("formik")

jest.mock("app/Components/NavigationHeader", () => {
  const { TouchableOpacity } = jest.requireActual("react-native")
  return {
    NavigationHeader: ({ onRightButtonPress }: { onRightButtonPress?: () => void }) => (
      <TouchableOpacity
        accessibilityRole="button"
        testID="mock-navigation-header-right-button"
        onPress={onRightButtonPress}
      />
    ),
  }
})

jest.mock("app/Components/ArtistAutosuggest/ArtistAutosuggest", () => ({
  ArtistAutosuggest: () => null,
}))

jest.mock("app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker", () => {
  const { View } = jest.requireActual("react-native")
  return { CategoryPicker: () => <View testID="mock-category-picker" /> }
})

jest.mock("app/Scenes/MyCollection/Screens/ArtworkForm/Components/Dimensions", () => {
  const { View } = jest.requireActual("react-native")
  return { Dimensions: () => <View testID="mock-dimensions" /> }
})

const mockShowActionSheetWithOptions = jest.fn()

jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: mockShowActionSheetWithOptions }),
}))

jest.mock("app/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve({ photos: [] })),
}))

describe("AddEditArtwork", () => {
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

  it("renders correct components on Add", async () => {
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
    await renderWithWrappers(artworkForm)
    expect(screen.getByTestId("mock-navigation-header-right-button")).toBeOnTheScreen()
    expect(screen.getByTestId("mock-category-picker")).toBeOnTheScreen()
    expect(screen.getByTestId("mock-dimensions")).toBeOnTheScreen()

    // not exposed components
    expect(screen.getByTestId("CompleteButton")).toBeOnTheScreen()
    expect(screen.getByTestId("PhotosButton")).toBeOnTheScreen()
  })

  it("renders correct components on Edit", async () => {
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
    await renderWithWrappers(artworkForm)
    expect(screen.getByTestId("CompleteButton")).toBeOnTheScreen()
    expect(screen.getByTestId("DeleteButton")).toBeOnTheScreen()
  })

  it("fires clear form on header Clear button click", async () => {
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
    // make form dirty: in "add" mode any filled-in formik field counts, and the header only
    // gets an `onRightButtonPress` (the "Clear" button) when the form is dirty
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      values: {
        photos: [],
        width: "30",
      },
    }))

    await renderWithWrappers(artworkForm)
    await fireEvent.press(screen.getByTestId("mock-navigation-header-right-button"))

    expect(mockShowActionSheetWithOptions).toHaveBeenCalled()

    const callback = mockShowActionSheetWithOptions.mock.calls[0][1]

    callback(0) // confirm discard
  })

  it("fires formik's handleSubmit on complete button click", async () => {
    const spy = jest.fn()
    // CompleteButton is disabled unless the form is valid and dirty
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: spy,
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      isValid: true,
      values: {
        photos: [],
        width: "30",
      },
    }))
    // in "edit" mode the form is dirty when formik values differ from the original ones
    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            dirtyFormCheckValues: {
              width: "40",
            },
          },
        },
      },
    })

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

    await renderWithWrappers(artworkForm)

    await fireEvent.press(screen.getByTestId("CompleteButton"))

    expect(spy).toHaveBeenCalled()
  })

  describe("delete artwork button", () => {
    it("can be pressed", async () => {
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

      await renderWithWrappers(artworkForm)

      await fireEvent.press(screen.getByTestId("DeleteButton"))
    })
  })
})
