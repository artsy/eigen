function mockedModule(path: string, moduleName?: string | boolean | null, filename = __filename) {
    debugger
    if (module) {
        jest.mock(path, () => ({'default': moduleName}))
    } else {
        jest.mock(path)
    }
}

function mockedModules(paths: {[key: string]: string | boolean}) {
    for (let path in paths) {
        let moduleName = paths[path]
        mockedModule(path, moduleName)
    }
}

mockedModules({
  './lib/components/switch_view.tsx': 'SwitchView',
  './lib/components/spinner.tsx': 'ARSpinner',
  './lib/components/opaque_image_view.tsx': 'AROpaqueImageView',
  './lib/components/artwork_grids/infinite_scroll_grid.tsx': 'ArtworksGrid',
})

//Artist tests
mockedModule('./lib/components/artist/shows/index.tsx', 'Shows')
mockedModule('./lib/components/artist/artworks/index.tsx', 'Artworks')
mockedModule('./lib/components/artist/header.tsx', 'Header')
mockedModule('./lib/components/artist/about.tsx', 'About')

//Gene tests
mockedModules({
  './lib/components/gene/header.tsx': 'Header',
  './lib/components/gene/artworks.tsx': 'Artworks'
})