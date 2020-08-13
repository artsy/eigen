import { storiesOf } from "@storybook/react"
import React from "react"
import { Box } from "../Box"
import { Serif } from "../Typography"
import { BarChart } from "./BarChart"

storiesOf("Components/BarChart", module)
  .add(
    "BarChart with labels",
    () => {
      return (
        <Box width="50%">
          <BarChart
            bars={[
              {
                value: 2000,
                label: { title: "Sept 30", description: "423 clicks" },
                onClick: () => {
                  window.open("https://calmingmanatee.com/")
                },
              },
              {
                value: 1400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 3200,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 4000,
                highlightLabel: {
                  title: "$30,000",
                  description: "This artwork",
                },
              },
              {
                value: 400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 800,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 0,
              },
              {
                value: 100,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 3000,
                label: { title: "Sept 30", description: "423 clicks" },
              },
            ]}
            minLabel="$500"
            maxLabel="$50,000+"
          />
        </Box>
      )
    },
    { chromatic: { delay: 2000, diffThreshold: 1 } }
  )

  .add(
    "Height label constrained to left",
    () => {
      return (
        <Box width="50%">
          <BarChart
            bars={[
              {
                value: 2000,
                highlightLabel: {
                  title: "$30,000–$80,000",
                  description: "This artwork",
                },
              },
              {
                value: 1400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 3200,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 4000,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 800,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 0,
              },
              {
                value: 100,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 3000,
                label: { title: "Sept 30", description: "423 clicks" },
              },
            ]}
            minLabel="$500"
            maxLabel="$50,000+"
          />
        </Box>
      )
    },
    { chromatic: { delay: 2000, diffThreshold: 1 } }
  )

  .add(
    "Height label constrained to right",
    () => {
      return (
        <Box width="50%">
          <BarChart
            bars={[
              {
                value: 2000,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 1400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 3200,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 4000,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 400,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 800,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 0,
              },
              {
                value: 100,
                label: { title: "Sept 30", description: "423 clicks" },
              },
              {
                value: 3000,
                highlightLabel: {
                  title: "$30,000–$80,000",
                  description: "This artwork",
                },
              },
            ]}
            minLabel="$500"
            maxLabel="$50,000+"
          />
        </Box>
      )
    },
    { chromatic: { delay: 2000, diffThreshold: 1 } }
  )

  .add(
    "With x-axis labels",
    () => {
      return (
        <Box width="50%">
          <BarChart
            bars={[
              {
                value: 2000,
                label: { title: "Sep 30", description: "423 clicks" },
                axisLabelX: "Sep 30",
              },
              {
                value: 1400,
                label: { title: "Nov 30", description: "423 clicks" },
              },
              {
                value: 400,
                label: { title: "Dec 30", description: "423 clicks" },
                axisLabelX: <Serif size="2">DECEMBER 30</Serif>,
              },
              {
                value: 3200,
                label: { title: "Jan 30", description: "423 clicks" },
              },
              {
                value: 4000,
                label: { title: "Feb 30", description: "423 clicks" },
                axisLabelX: "February 20 - June 20",
                highlightLabel: {
                  title: "$30,000–$80,000",
                  description: "This artwork",
                },
              },
              {
                value: 400,
                label: { title: "Mar 30", description: "423 clicks" },
              },
              {
                value: 800,
                label: { title: "Apr 30", description: "423 clicks" },
                axisLabelX: <Serif size="2">APRIL</Serif>,
              },
              {
                value: 0,
              },
              {
                value: 100,
                label: { title: "Jul 30", description: "423 clicks" },
                axisLabelX: "Jul 30",
              },
            ]}
            minLabel={null}
            maxLabel={null}
          />
        </Box>
      )
    },
    { chromatic: { delay: 2000, diffThreshold: 1 } }
  )

  .add(
    "Zero state with highlight and x axis label",
    () => {
      return (
        <Box width="50%">
          <BarChart
            bars={[
              {
                value: 0,
                axisLabelX: "Sep 30",
              },
              {
                value: 0,
              },
              {
                value: 0,
                label: { title: "Dec 30", description: "0 clicks" },
              },
              {
                value: 0,
                label: { title: "Jan 30", description: "0 clicks" },
              },
              {
                value: 0,
                label: { title: "Feb 30", description: "0 clicks" },
                axisLabelX: "February 20 - June 20",
                highlightLabel: {
                  title: "0",
                  description: "No clicks",
                },
              },
              {
                value: 0,
                label: { title: "Mar 30", description: "0 clicks" },
              },
              {
                value: 0,
              },
              {
                value: 0,
              },
              {
                value: 0,
                axisLabelX: "Jul 30",
              },
            ]}
            minLabel={null}
            maxLabel={null}
          />
        </Box>
      )
    },
    { chromatic: { delay: 2000, diffThreshold: 1 } }
  )

  .add(
    "Zero state no labels",
    () => {
      return (
        <Box width="50%">
          <BarChart
            bars={[
              {
                value: 0,
              },
              {
                value: 0,
              },
              {
                value: 0,
              },
              {
                value: 0,
              },
              {
                value: 0,
              },
              {
                value: 0,
              },
              {
                value: 0,
              },
              {
                value: 0,
              },
              {
                value: 0,
              },
            ]}
            minLabel="Sep 30"
            maxLabel="Jul 30"
          />
        </Box>
      )
    },
    { chromatic: { delay: 2000, diffThreshold: 1 } }
  )
