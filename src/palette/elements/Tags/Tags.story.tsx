import { storiesOf } from "@storybook/react"
import React from "react"
import { BorderBox } from "../BorderBox"
import { Tags } from "./Tags"

const tagList = [
  {
    name: "Sculpture",
    href: "/gene/sculpture",
  },
  {
    name: "Repetition",
    href: "/gene/repetition",
  },
  {
    name: "United States",
    href: "/gene/united-states",
  },
  {
    name: "1960s",
    href: "/gene/1960s",
  },
  {
    name: "Minimalism",
    href: "/gene/minimalism",
  },
  {
    name: "Abstract Art",
    href: "/gene/abstract-art",
  },
  {
    name: "Line, Form, and Color",
    href: "/gene/line-form-and-color",
  },
  {
    name: "1860–1969",
    href: "/gene/1860-1969",
  },
  {
    name: "Abstract Sculpture",
    href: "/gene/abstract-sculpture",
  },
  {
    name: "Linear Forms",
    href: "/gene/linear-forms",
  },
]

storiesOf("Components/Tags", module)
  .add("default props", () => {
    return (
      <BorderBox>
        <Tags tags={tagList} />
      </BorderBox>
    )
  })
  .add("within a narrow container", () => {
    return (
      <BorderBox width="350px">
        <Tags tags={tagList} />
      </BorderBox>
    )
  })
  .add("with displayNum", () => {
    return (
      <BorderBox width="350px">
        <Tags tags={tagList} displayNum={5} />
      </BorderBox>
    )
  })
