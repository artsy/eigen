import { storiesOf } from "@storybook/react-native"
import React from "react"

import Favourites from "../"

import Artists from "../Components/Artists"
import Artworks from "../Components/Artworks"

import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import ArtistsRenderer from "../Components/Artists/Relay/ArtistsRenderer"
import ArtworksRenderer from "../Components/Artworks/Relay/ArtworksRenderer"

storiesOf("Favourites/Relay")
  .add("Root", () => <Favourites />)
  .add("Artists", () => <ArtistsRenderer render={renderWithLoadProgress(Artists)} />)
  .add("Artworks", () => <ArtworksRenderer render={renderWithLoadProgress(Artworks)} />)
  .add("Genes", () => <ArtistsRenderer render={renderWithLoadProgress(Artists)} />)
