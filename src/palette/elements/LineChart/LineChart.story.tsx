import { storiesOf } from "@storybook/react"
import React from "react"
import { Box } from "../Box"
import { Serif } from "../Typography"
import { LineChart } from "./LineChart"

storiesOf("Components/LineChart", module)
  .add(
    "LineChart with labels",
    () => {
      return (
        <Box width="50%">
          <LineChart
            points={[
              {
                value: 423,
                axisLabelX: "Sep 10",
                tooltip: { title: "Sep 10", description: "423 clicks" },
              },
              {
                value: 567,
                tooltip: (
                  <Serif size="3" p={0.5}>
                    yay!
                  </Serif>
                ),
              },
              {
                value: 300,
                axisLabelX: "Sep 12",
                tooltip: { title: "Sep 12", description: "300 clicks" },
              },
              {
                value: 200,
                tooltip: { title: "Sep 13", description: "200 clicks" },
              },
              {
                value: 501,
                axisLabelX: "Sep 14",
                tooltip: { title: "Sep 14", description: "501 clicks" },
              },
              {
                value: 400,
                tooltip: { title: "Sep 15", description: "400 clicks" },
              },
              {
                value: 800,
                axisLabelX: "Sep 16",
                tooltip: { title: "Sep 16", description: "800 clicks" },
              },
              {
                value: 0,
                tooltip: { title: "Sep 17", description: "0 clicks" },
              },
              {
                value: 100,
                axisLabelX: "Sep 18",
                tooltip: { title: "Sep 18", description: "100 clicks" },
              },
              {
                value: 200,
                tooltip: { title: "Sep 19", description: "200 clicks" },
              },
              {
                value: 500,
                axisLabelX: "Sep 20",
                tooltip: { title: "Sep 20", description: "500 clicks" },
              },
            ]}
          />
        </Box>
      )
    },
    { chromatic: { delay: 1000 } }
  )

  .add(
    "LineChart with custom height",
    () => {
      return (
        <Box width="50%">
          <LineChart
            height={250}
            points={[
              {
                value: 423,
                axisLabelX: "Sep 10",
                tooltip: { title: "Sep 10", description: "423 clicks" },
              },
              {
                value: 567,
                tooltip: (
                  <Serif size="3" p={0.5}>
                    yay!
                  </Serif>
                ),
              },
              {
                value: 300,
                axisLabelX: "Sep 12",
                tooltip: { title: "Sep 12", description: "300 clicks" },
              },
              {
                value: 200,
                tooltip: { title: "Sep 13", description: "200 clicks" },
              },
              {
                value: 501,
                axisLabelX: "Sep 14",
                tooltip: { title: "Sep 14", description: "501 clicks" },
              },
              {
                value: 400,
                tooltip: { title: "Sep 15", description: "400 clicks" },
              },
              {
                value: 800,
                axisLabelX: "Sep 16",
                tooltip: { title: "Sep 16", description: "800 clicks" },
              },
              {
                value: 0,
                tooltip: { title: "Sep 17", description: "0 clicks" },
              },
              {
                value: 100,
                axisLabelX: "Sep 18",
                tooltip: { title: "Sep 18", description: "100 clicks" },
              },
              {
                value: 200,
                tooltip: { title: "Sep 19", description: "200 clicks" },
              },
              {
                value: 500,
                axisLabelX: "Sep 20",
                tooltip: { title: "Sep 20", description: "500 clicks" },
              },
            ]}
          />
        </Box>
      )
    },
    {
      chromatic: { delay: 1000 },
    }
  )
