import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import Messages from "../messages"

it("Renders correctly", () => {
  const tree = renderer.create(<Messages me={meProps} />).toJSON()
  expect(tree).toMatchSnapshot()
})

const meProps = {
    conversations: {
        edges: [
            {
            node: {
                id: "582",
                inquiry_id: "59302144275b244a81d0f9c6",
                from_name: "Jean-Luc Collecteur",
                from_email: "luc+messaging@artsymail.com",
                to_name: "ACA Galleries",
                last_message: "Karl and Anna... Fab!",
                created_at: "2017-06-01T14:14:35.538Z",
                artworks: [
                {
                    id: "bradley-theodore-karl-and-anna-face-off-diptych",
                    href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
                    title: "Karl and Anna Face Off (Diptych)",
                    date: "2016",
                    artist: {
                    name: "Bradley Theodore",
                    },
                    image: {
                    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
                    image_url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/:version.jpg",
                    },
                },
                ],
            },
            },
            {
            node: {
                id: "581",
                inquiry_id: "593020be8b3b814f9f86f2fd",
                from_name: "Jean-Luc Collecteur",
                from_email: "luc+messaging@artsymail.com",
                to_name: "David Krut Projects",
                last_message: "Hi, I’m interested in purchasing this work. \
                    Could you please provide more information about the piece?",
                created_at: "2017-06-01T14:12:19.155Z",
                artworks: [
                {
                    id: "aida-muluneh-darkness-give-way-to-light-1",
                    href: "/artwork/aida-muluneh-darkness-give-way-to-light-1",
                    title: "Darkness Give Way to Light",
                    date: "2016",
                    artist: {
                    name: "Aida Muluneh",
                    },
                    image: {
                    url: "https://d32dm0rphc51dk.cloudfront.net/FDIuqbZUY1kLR-1Pd-Ec8w/normalized.jpg",
                    image_url: "https://d32dm0rphc51dk.cloudfront.net/FDIuqbZUY1kLR-1Pd-Ec8w/:version.jpg",
                    },
                },
                ],
            },
            },
        ],
    },
}
