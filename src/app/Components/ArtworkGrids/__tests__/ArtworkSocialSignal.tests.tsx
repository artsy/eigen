import { screen } from "@testing-library/react-native"
import { ArtworkSocialSignalTestsQuery } from "__generated__/ArtworkSocialSignalTestsQuery.graphql"
import { ArtworkSocialSignal } from "app/Components/ArtworkGrids/ArtworkSocialSignal"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkSocialSignal", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkSocialSignalTestsQuery>({
    Component: (props) => (
      <ArtworkSocialSignal collectorSignals={props.artwork?.collectorSignals} {...(props as any)} />
    ),
    query: graphql`
      query ArtworkSocialSignalTestsQuery @relay_test_operation {
        artwork(id: "example") {
          collectorSignals {
            ...ArtworkSocialSignal_collectorSignals
          }
        }
      }
    `,
  })

  describe("increased interest signal", () => {
    it("renders the increased interest signal", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            increasedInterest: true,
            curatorsPick: false,
          },
        }),
      })

      expect(screen.getByText("Increased Interest")).toBeOnTheScreen()
    })

    it("does not render the increased interest signal when it is hidden", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            collectorSignals: {
              increasedInterest: true,
              curatorsPick: false,
            },
          }),
        },
        { hideIncreasedInterest: true }
      )

      expect(screen.queryByText("Increased Interest")).not.toBeOnTheScreen()
    })

    it("renders the curator's pick signal even if with increased interest singal available", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            increasedInterest: true,
            curatorsPick: true,
          },
        }),
      })

      expect(screen.getByText("Curators’ Pick")).toBeOnTheScreen()
    })
  })

  describe("curator's pick signal", () => {
    it("renders the curator's pick signal", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            increasedInterest: false,
            curatorsPick: true,
          },
        }),
      })

      expect(screen.getByText("Curators’ Pick")).toBeOnTheScreen()
    })

    it("does not render the curators pick signal when it is hidden", () => {
      renderWithRelay(
        {
          Artwork: () => ({
            collectorSignals: {
              increasedInterest: false,
              curatorsPick: true,
            },
          }),
        },
        { hideCuratorsPick: true }
      )

      expect(screen.queryByText("Curators’ Pick")).not.toBeOnTheScreen()
    })
  })
})
