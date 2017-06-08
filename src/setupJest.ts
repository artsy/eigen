function mockedModule(path: string, moduleName: string) {
  jest.mock(path, () => ({ default: moduleName }))
}

jest.mock("./lib/metaphysics.ts")

mockedModule("./lib/components/switch_view.tsx", "SwitchView")
mockedModule("./lib/components/spinner.tsx", "ARSpinner")
mockedModule("./lib/components/opaque_image_view.tsx", "AROpaqueImageView")
mockedModule("./lib/components/artwork_grids/infinite_scroll_grid.tsx", "ArtworksGrid")

// Artist tests
mockedModule("./lib/components/artist/shows/index.tsx", "Shows")
mockedModule("./lib/components/artist/artworks/index.tsx", "Artworks")
mockedModule("./lib/components/artist/header.tsx", "Header")
mockedModule("./lib/components/artist/about.tsx", "About")

// Gene tests
mockedModule("./lib/components/gene/header.tsx", "Header")
mockedModule("./lib/components/gene/artworks.tsx", "Artworks")
