import expect from "expect"

// Waiting on https://github.com/thymikee/snapshot-diff/pull/17
import diff from "snapshot-diff"
expect.extend({ toMatchDiffSnapshot: (diff as any).toMatchDiffSnapshot })

const originalConsoleError = console.error

// Remove on the next React-Native update.
console.error = (message?: any, ...optionalParams: any[]) => {
  if (
    typeof message === "string" &&
    (message.includes("PropTypes has been moved to a separate package.") ||
      message.includes("React.createClass is no longer supported.") ||
      message.includes("Check the render method of `ScrollViewMock`. It was passed a child from ListViewMock.") ||
      message.includes("setState(...): Can only update a mounted or mounting component."))
  ) {
    // NOOP
  } else {
    originalConsoleError(message)
  }
}

jest.mock("./lib/metaphysics.ts")

jest.mock("./lib/NativeModules/NotificationsManager.tsx", () => ({
  NotificationsManager: jest.fn(),
}))

function mockedModule(path: string, mockModuleName: string) {
  jest.mock(path, () => mockModuleName)
}

mockedModule("./lib/Components/SwitchView.tsx", "SwitchView")
mockedModule("./lib/Components/Spinner.tsx", "ARSpinner")
mockedModule("./lib/Components/OpaqueImageView.tsx", "AROpaqueImageView")
mockedModule("./lib/Components/ArtworkGrids/InfiniteScrollGrid.tsx", "ArtworksGrid")

// Artist tests
mockedModule("./lib/Components/Artist/Shows/index.tsx", "Shows")
mockedModule("./lib/Components/Artist/Artworks/index.tsx", "Artworks")
mockedModule("./lib/Components/Artist/Header.tsx", "Header")
mockedModule("./lib/Components/Artist/About.tsx", "About")

// Gene tests
mockedModule("./lib/Components/Gene/Header.tsx", "Header")
mockedModule("./lib/Components/Gene/Artworks.tsx", "Artworks")
