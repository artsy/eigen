import { storiesOf } from "@storybook/react-native"
import React from "react"

import Favourites from "../"

import Artists from "../Components/Artists"
import Artworks from "../Components/Artworks"
import Categories from "../Components/Categories"

import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import ArtistsRenderer from "../Components/Artists/Relay/ArtistsRenderer"
import ArtworksRenderer from "../Components/Artworks/Relay/ArtworksRenderer"
import CategoriesRenderer from "../Components/Categories/Relay/CategoriesRenderer"

storiesOf("Favourites/Relay")
  .add("Root", () => <Favourites />)
  .add("Artists", () => <ArtistsRenderer render={renderWithLoadProgress(Artists)} />)
  .add("Artworks", () => <ArtworksRenderer render={renderWithLoadProgress(Artworks)} />)
  .add("Genes", () => <CategoriesRenderer render={renderWithLoadProgress(Categories)} />)
