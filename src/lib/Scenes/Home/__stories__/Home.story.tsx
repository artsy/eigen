import { storiesOf } from "@storybook/react-native"
import React from "react"

import Home from "../"

import WorksForYou from "lib/Containers/WorksForYou"

import ForYou from "../Components/ForYou"
import Sales from "../Components/Sales"

import { ForYouRenderer, WorksForYouRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import SalesRenderer from "../Components/Sales/Relay/SalesRenderer"

storiesOf("Home/Relay")
  .add("Root", () => <Home />)
  .add("Artists", () => <WorksForYouRenderer render={renderWithLoadProgress(WorksForYou)} />)
  .add("For You", () => <ForYouRenderer render={renderWithLoadProgress(ForYou)} />)
  .add("Auctions", () => <SalesRenderer render={renderWithLoadProgress(Sales)} />)
