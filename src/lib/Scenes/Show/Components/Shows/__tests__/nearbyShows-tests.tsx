import "react-native"
import { NearbyShows } from "../../../__fixtures__/NearbyShowsFixture"

// FIXME: This isn't testing anything
it("returns a nearby shows ", () => {
  const show = NearbyShows.edges[0]
  expect(show).toEqual({
    node: {
      id: "j-cacciola-gallery-delicate-power-the-delicacy-and-complexity-of-egg-tempera",
      name: "Delicate Power: The Delicacy and Complexity of Egg Tempera",
      images: [
        {
          url: "https://d32dm0rphc51dk.cloudfront.net/6HYZ-tKaXLrcqXCfYxNZQQ/large.jpg",
          aspect_ratio: 0.99,
        },
      ],
      partner: {
        name: "J. Cacciola Gallery",
      },
      location: {
        address: "35 Mill Street",
        address_2: "",
        state: "NJ",
        postal_code: "07924",
      },
    },
  })
})
