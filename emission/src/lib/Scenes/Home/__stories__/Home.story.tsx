import { storiesOf } from "@storybook/react-native"
import WorksForYou from "lib/Containers/WorksForYou"
import { ForYouRenderer, WorksForYouRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import Home from "../"
import ForYou from "../Components/ForYou"
import Sales from "../Components/Sales"
import { SalesRenderer } from "../Components/Sales/Relay/SalesRenderer"

storiesOf("Home/Relay")
  .add("Root", () => <Home initialTab={0} isVisible={true} tracking={trackingData => console.log(trackingData)} />)
  .add("Artists", () => (
    <WorksForYouRenderer
      render={renderWithLoadProgress(query => (
        <WorksForYou query={query as any} />
      ))}
    />
  ))
  .add("For You", () => <ForYouRenderer render={renderWithLoadProgress(ForYou)} />)
  .add("Auctions", () => (
    <SalesRenderer
      render={renderWithLoadProgress(query => (
        <Sales query={query as any} />
      ))}
    />
  ))
