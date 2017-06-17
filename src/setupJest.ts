function mockedModule(path: string, moduleName: string) {
  jest.mock(path, () => ({ default: moduleName }))
}

jest.mock("./lib/metaphysics.ts")

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
