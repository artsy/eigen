import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import ImageSelection from "../components/ImageSelection"
import { Wrapper } from "./"

const nav = {} as any
const route = {} as any

const uri1 = "https://d32dm0rphc51dk.cloudfront.net/Vq62IJMLbG1TuUjs-2fZCg/large.jpg"
const uri2 = "https://d32dm0rphc51dk.cloudfront.net/WAlGHmjlxTn3USMllNt4rA/large.jpg"
const uri3 = "https://d32dm0rphc51dk.cloudfront.net/8BuMWBuUOBtKVBsGRUoDKw/large.jpg"

storiesOf("Consignments - Image Selection")
  .add("With some images", () =>
    <Wrapper>
      <ImageSelection data={[{ image: { uri: uri1 } }, { image: { uri: uri2 } }, { image: { uri: uri3 } }]} />
    </Wrapper>
  )
  .add("With no images", () =>
    <Wrapper>
      <ImageSelection data={[]} />
    </Wrapper>
  )
