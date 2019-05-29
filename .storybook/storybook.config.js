// import { addDecorator } from "@storybook/react"
import { Theme } from "@artsy/palette"

console.log("STORY CONFIG")

// // const ThemeDecorator = storyFn => <Theme>{storyFn()}</Theme>
// addDecorator(storyFn => {
//   return <Theme>{storyFn()}</Theme>
// })

import React from "react"
import { configure, addDecorator } from "@storybook/react"

// addDecorator(storyFn => <Theme>{storyFn()}</Theme>)

// configure(function() {
//   // ...
// }, module)

addDecorator(storyFn => <Theme children={storyFn()} />)
