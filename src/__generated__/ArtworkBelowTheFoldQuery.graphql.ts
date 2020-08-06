/* tslint:disable */
/* eslint-disable */
/* @relayHash e66483a1d5f21cdc4c38b2a62d2aa8cc */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkBelowTheFoldQueryVariables = {
    artworkID: string;
};
export type ArtworkBelowTheFoldQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"Artwork_artworkBelowTheFold">;
    } | null;
};
export type ArtworkBelowTheFoldQuery = {
    readonly response: ArtworkBelowTheFoldQueryResponse;
    readonly variables: ArtworkBelowTheFoldQueryVariables;
};



/*
query ArtworkBelowTheFoldQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    ...Artwork_artworkBelowTheFold
    id
  }
}

fragment AboutArtist_artwork on Artwork {
  artists {
    id
    biography_blurb: biographyBlurb {
      text
    }
    ...ArtistListItem_artist
  }
}

fragment AboutWork_artwork on Artwork {
  additional_information: additionalInformation
  description
  isInAuction
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment ArtworkDetails_artwork on Artwork {
  slug
  category
  conditionDescription {
    label
    details
  }
  signatureInfo {
    label
    details
  }
  certificateOfAuthenticity {
    label
    details
  }
  framed {
    label
    details
  }
  series
  publisher
  manufacturer
  image_rights: imageRights
  canRequestLotConditionsReport
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    id
  }
  saleArtwork {
    currentBid {
      display
    }
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment ArtworkHistory_artwork on Artwork {
  provenance
  exhibition_history: exhibitionHistory
  literature
}

fragment Artwork_artworkBelowTheFold on Artwork {
  additional_information: additionalInformation
  description
  provenance
  exhibition_history: exhibitionHistory
  literature
  partner {
    type
    id
  }
  artist {
    biography_blurb: biographyBlurb {
      text
    }
    id
  }
  sale {
    id
    isBenefit
    isGalleryAuction
  }
  category
  canRequestLotConditionsReport
  conditionDescription {
    details
  }
  signature
  signatureInfo {
    details
  }
  certificateOfAuthenticity {
    details
  }
  framed {
    details
  }
  series
  publisher
  manufacturer
  image_rights: imageRights
  context {
    __typename
    ... on Sale {
      isAuction
    }
    ... on Node {
      id
    }
  }
  contextGrids {
    __typename
    artworks: artworksConnection(first: 6) {
      edges {
        node {
          id
        }
      }
    }
  }
  artistSeriesConnection(first: 1) {
    edges {
      node {
        artworksConnection(first: 20) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
  ...PartnerCard_artwork
  ...AboutWork_artwork
  ...OtherWorks_artwork
  ...AboutArtist_artwork
  ...ArtworkDetails_artwork
  ...ContextCard_artwork
  ...ArtworkHistory_artwork
  ...ArtworksInSeriesRail_artwork
}

fragment ArtworksInSeriesRail_artwork on Artwork {
  artistSeriesConnection(first: 1) {
    edges {
      node {
        slug
        artworksConnection(first: 20) {
          edges {
            node {
              slug
              internalID
              href
              artistNames
              image {
                imageURL
                aspectRatio
              }
              sale {
                isAuction
                isClosed
                displayTimelyAt
                id
              }
              saleArtwork {
                currentBid {
                  display
                }
                id
              }
              saleMessage
              title
              date
              partner {
                name
                id
              }
              id
            }
          }
        }
      }
    }
  }
}

fragment ContextCard_artwork on Artwork {
  id
  context {
    __typename
    ... on Sale {
      id
      name
      isLiveOpen
      href
      formattedStartDateTime
      isAuction
      coverImage {
        url
      }
    }
    ... on Fair {
      id
      name
      href
      exhibitionPeriod
      image {
        url
      }
    }
    ... on Show {
      id
      internalID
      slug
      name
      href
      exhibitionPeriod
      isFollowed
      coverImage {
        url
      }
    }
    ... on Node {
      id
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment OtherWorks_artwork on Artwork {
  contextGrids {
    __typename
    title
    ctaTitle
    ctaHref
    artworks: artworksConnection(first: 6) {
      edges {
        node {
          ...GenericGrid_artworks
          id
        }
      }
    }
  }
}

fragment PartnerCard_artwork on Artwork {
  sale {
    isBenefit
    isGalleryAuction
    id
  }
  partner {
    cities
    is_default_profile_public: isDefaultProfilePublic
    type
    name
    slug
    id
    href
    initials
    profile {
      id
      internalID
      is_followed: isFollowed
      icon {
        url(version: "square140")
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artworkID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": "is_followed",
  "name": "isFollowed",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "LinkedField",
  "alias": "biography_blurb",
  "name": "biographyBlurb",
  "storageKey": null,
  "args": null,
  "concreteType": "ArtistBlurb",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "text",
      "args": null,
      "storageKey": null
    }
  ]
},
v10 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "details",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "label",
    "args": null,
    "storageKey": null
  }
],
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isAuction",
  "args": null,
  "storageKey": null
},
v13 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
],
v14 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "coverImage",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v13/*: any*/)
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v13/*: any*/)
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v20 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v21 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v22 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "sale",
  "storageKey": null,
  "args": null,
  "concreteType": "Sale",
  "plural": false,
  "selections": [
    (v12/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isClosed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "displayTimelyAt",
      "args": null,
      "storageKey": null
    },
    (v2/*: any*/)
  ]
},
v23 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "saleArtwork",
  "storageKey": null,
  "args": null,
  "concreteType": "SaleArtwork",
  "plural": false,
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "currentBid",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkCurrentBid",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "display",
          "args": null,
          "storageKey": null
        }
      ]
    },
    (v2/*: any*/)
  ]
},
v24 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v2/*: any*/)
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkBelowTheFoldQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Artwork_artworkBelowTheFold",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkBelowTheFoldQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": "additional_information",
            "name": "additionalInformation",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "provenance",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "exhibition_history",
            "name": "exhibitionHistory",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "literature",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": "Partner",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "type",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "cities",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "is_default_profile_public",
                "name": "isDefaultProfilePublic",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "profile",
                "storageKey": null,
                "args": null,
                "concreteType": "Profile",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "icon",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "url",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "version",
                            "value": "square140"
                          }
                        ],
                        "storageKey": "url(version:\"square140\")"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v9/*: any*/),
              (v2/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sale",
            "storageKey": null,
            "args": null,
            "concreteType": "Sale",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isBenefit",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isGalleryAuction",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "category",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "canRequestLotConditionsReport",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conditionDescription",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v10/*: any*/)
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "signature",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "signatureInfo",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v10/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "certificateOfAuthenticity",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v10/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "framed",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v10/*: any*/)
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "series",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "publisher",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "manufacturer",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "image_rights",
            "name": "imageRights",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "context",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              (v11/*: any*/),
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Sale",
                "selections": [
                  (v12/*: any*/),
                  (v3/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isLiveOpen",
                    "args": null,
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "formattedStartDateTime",
                    "args": null,
                    "storageKey": null
                  },
                  (v14/*: any*/)
                ]
              },
              {
                "kind": "InlineFragment",
                "type": "Fair",
                "selections": [
                  (v3/*: any*/),
                  (v5/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/)
                ]
              },
              {
                "kind": "InlineFragment",
                "type": "Show",
                "selections": [
                  (v7/*: any*/),
                  (v4/*: any*/),
                  (v3/*: any*/),
                  (v5/*: any*/),
                  (v15/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isFollowed",
                    "args": null,
                    "storageKey": null
                  },
                  (v14/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "contextGrids",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworksConnection",
                "storageKey": "artworksConnection(first:6)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 6
                  }
                ],
                "concreteType": "ArtworkConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtworkEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": "aspect_ratio",
                                "name": "aspectRatio",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "url",
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "large"
                                  }
                                ],
                                "storageKey": "url(version:\"large\")"
                              },
                              (v17/*: any*/)
                            ]
                          },
                          (v18/*: any*/),
                          (v19/*: any*/),
                          (v20/*: any*/),
                          (v4/*: any*/),
                          (v21/*: any*/),
                          (v5/*: any*/),
                          (v22/*: any*/),
                          (v23/*: any*/),
                          (v24/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v11/*: any*/),
              (v18/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "ctaTitle",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "ctaHref",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artistSeriesConnection",
            "storageKey": "artistSeriesConnection(first:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "ArtistSeriesConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistSeriesEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtistSeries",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artworksConnection",
                        "storageKey": "artworksConnection(first:20)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 20
                          }
                        ],
                        "concreteType": "ArtworkConnection",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "edges",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "ArtworkEdge",
                            "plural": true,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "node",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Artwork",
                                "plural": false,
                                "selections": [
                                  (v2/*: any*/),
                                  (v4/*: any*/),
                                  (v7/*: any*/),
                                  (v5/*: any*/),
                                  (v21/*: any*/),
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "image",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "imageURL",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      (v17/*: any*/)
                                    ]
                                  },
                                  (v22/*: any*/),
                                  (v23/*: any*/),
                                  (v20/*: any*/),
                                  (v18/*: any*/),
                                  (v19/*: any*/),
                                  (v24/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v4/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isInAuction",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v9/*: any*/),
              (v7/*: any*/),
              (v4/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              (v5/*: any*/),
              (v8/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "nationality",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "birthday",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "deathday",
                "args": null,
                "storageKey": null
              },
              (v16/*: any*/)
            ]
          },
          (v4/*: any*/),
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtworkBelowTheFoldQuery",
    "id": "340377d6fd6ff0afcf48332f11314ca4",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '72cb482f87d89456b64301d0e0fe0405';
export default node;
