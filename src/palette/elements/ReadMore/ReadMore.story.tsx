import { storiesOf } from "@storybook/react"
import React from "react"
import { ReadMore } from "./ReadMore"

storiesOf("Components/ReadMore", module)
  .add("With character cap", () => {
    return (
      <ReadMore
        maxChars={300}
        content={
          <div>
            Donald Judd, widely regarded as one of the most significant American
            artists of <a href="#">the post-war period</a>, is perhaps
            best-known for the large-scale outdoor installations and long,
            spacious interiors he designed in Marfa. Donald Judd, widely
            regarded as one of the most significant American artists of the
            post-war period, is perhaps best-known for the large-scale outdoor
            installations and long, spacious interiors he designed in Marfa.
          </div>
        }
      />
    )
  })
  .add("Short content", () => {
    return (
      <ReadMore
        maxChars={300}
        content={
          <div>
            Donald Judd, widely regarded as one of the most significant American
            artists of <a href="#">the post-war period</a>.
          </div>
        }
      />
    )
  })
  .add("As string", () => {
    return (
      <ReadMore
        maxChars={300}
        content="Donald Judd, widely regarded as one of the most significant American artists of the post-war period, is perhaps best-known for the large-scale outdoor installations and long, spacious interiors he designed in Marfa. Donald Judd, widely regarded as one of the most significant American artists of the post-war period, is perhaps best-known for the large-scale outdoor installations and long, spacious interiors he designed in Marfa."
      />
    )
  })
  .add("Character cap with html", () => {
    return (
      <ReadMore
        maxChars={300}
        content='<p>Donald Judd, widely regarded as one of the most significant American artists of <a href="#">the post-war period</a>, is perhaps best-known for the large-scale outdoor installations and long, spacious interiors he designed in Marfa. Donald Judd, widely regarded as one of the most significant American artists of the post-war period, is perhaps best-known for the large-scale outdoor installations and long, spacious interiors he designed in Marfa. </p>'
      />
    )
  })
  .add("Character cap with html", () => {
    return (
      <ReadMore
        disabled
        maxChars={300}
        content={
          <div>
            Donald Judd, widely regarded as one of the most significant American
            artists of <a href="#">the post-war period</a>, is perhaps
            best-known for the large-scale outdoor installations and long,
            spacious interiors he designed in Marfa. Donald Judd, widely
            regarded as one of the most significant American artists of the
            post-war period, is perhaps best-known for the large-scale outdoor
            installations and long, spacious interiors he designed in Marfa.
          </div>
        }
      />
    )
  })
