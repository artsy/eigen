import { storiesOf } from "@storybook/react-native"
import React from "react"

import Favourites from "../"

import Artists from "../Components/Artists"
import Artworks from "../Components/Artworks"
import Categories from "../Components/Categories"

import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import ArtistsRenderer from "../Components/Artists/Relay/FavoriteArtists"
import ArtworksRenderer from "../Components/Artworks/Relay/FavoriteArtworks"
import CategoriesRenderer from "../Components/Categories/Relay/FavoriteCategories"

storiesOf("Favourites/Relay")
  .add("Root", () => <Favourites tracking={trackingData => console.log(trackingData)} />)
  .add("Artists", () => <ArtistsRenderer render={renderWithLoadProgress(Artists)} />)
  .add("Artworks", () => <ArtworksRenderer render={renderWithLoadProgress(Artworks)} />)
  .add("Genes", () => <CategoriesRenderer render={renderWithLoadProgress(Categories)} />)
