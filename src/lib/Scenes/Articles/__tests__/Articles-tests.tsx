// import { navigate } from "lib/navigation/navigate"
// import { FairFragmentContainer } from "lib/Scenes/Fair/Fair"
// import { renderWithWrappers } from "lib/tests/renderWithWrappers"
// import { env } from "process"
// import React from "react"
// import { QueryRenderer } from "react-relay"
// import { graphql } from "relay-runtime"
// import { ArticlesContainer } from "../Articles"

// const query = {
//   articlesConnection: {
//     edges: [],
//   },
// }
// describe("Articles", () => {
//   const TestRenderer = () => (
//     <QueryRenderer<ArticlesTestsQuery>
//       environment={env}
//       query={graphql`
//         query ArticlesTestsQuery @relay_test_operation {
//           fair(id: $fairID) {
//             ...Fair_fair
//           }
//         }
//       `}
//       variables={{ fairID: "art-basel-hong-kong-2020" }}
//       render={({ props, error }) => {
//         if (props?.fair) {
//           return <FairFragmentContainer fair={props.fair} />
//         } else if (error) {
//           console.log(error)
//         }
//       }}
//     />
//   )

//   it("renders Terms and conditions", () => {
//     const tree = renderWithWrappers(<ArticlesContainer query={} />)

//     expect(tree.root.findAllByProps({ title: "Terms of Use" })).toBeTruthy()
//     tree.root.findByProps({ title: "Terms of Use" }).props.onPress()
//     expect(navigate).toHaveBeenCalledWith("/terms", { modal: true })
//   })
// })
