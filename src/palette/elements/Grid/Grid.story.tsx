import { storiesOf } from "@storybook/react"
import React from "react"
import { BorderBox } from "../BorderBox"
import { Col, Grid, Row } from "./Grid"

storiesOf("Components/Grid", module).add("Basic", () => {
  return (
    <Grid
      border={{
        default: "4px solid pink",
        xs: "4px solid red",
        sm: "4px solid green",
        md: "4px solid gold",
        lg: "4px solid purple",
        xl: "4px solid blue",
      }}
    >
      <Row>
        {[...new Array(12)].map((_, i) => {
          return (
            <Col sm={1} key={i}>
              <BorderBox>{i + 1}</BorderBox>
            </Col>
          )
        })}
      </Row>
    </Grid>
  )
})
