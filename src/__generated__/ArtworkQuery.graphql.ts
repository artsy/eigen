/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Artwork_artwork$ref } from "./Artwork_artwork.graphql";
export type ArtworkQueryVariables = {
    readonly artworkID: string;
};
export type ArtworkQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": Artwork_artwork$ref;
    } | null;
};
export type ArtworkQuery = {
    readonly response: ArtworkQueryResponse;
    readonly variables: ArtworkQueryVariables;
};



/*
query ArtworkQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    ...Artwork_artwork
    id
  }
}

fragment Artwork_artwork on Artwork {
  additional_information
  description
  provenance
  exhibition_history
  literature
  partner {
    type
    id
  }
  artist {
    name
    biography_blurb {
      text
    }
    id
  }
  sale {
    isBenefit
    isGalleryAuction
    id
  }
  category
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
  image_rights
  context {
    __typename
    ... on Node {
      id
    }
    ... on ArtworkContextFair {
      id
    }
  }
  contextGrids {
    __typename
    artworks(first: 6) {
      edges {
        node {
          id
        }
      }
    }
  }
  slug
  internalID
  is_acquireable
  is_offerable
  is_biddable
  is_inquireable
  availability
  ...PartnerCard_artwork
  ...AboutWork_artwork
  ...OtherWorks_artwork
  ...AboutArtist_artwork
  ...ArtworkDetails_artwork
  ...ContextCard_artwork
  ...ArtworkHeader_artwork
  ...CommercialInformation_artwork
  ...ArtworkHistory_artwork
}

fragment PartnerCard_artwork on Artwork {
  sale {
    isBenefit
    isGalleryAuction
    id
  }
  partner {
    is_default_profile_public
    type
    name
    slug
    internalID
    id
    href
    initials
    profile {
      id
      internalID
      slug
      is_followed
      icon {
        url(version: "square140")
      }
    }
    locations {
      city
      id
    }
  }
}

fragment AboutWork_artwork on Artwork {
  additional_information
  description
}

fragment OtherWorks_artwork on Artwork {
  contextGrids {
    __typename
    title
    ctaTitle
    ctaHref
    artworks(first: 6) {
      edges {
        node {
          ...GenericGrid_artworks
          id
        }
      }
    }
  }
}

fragment AboutArtist_artwork on Artwork {
  artists {
    id
    biography_blurb {
      text
    }
    ...ArtistListItem_artist
  }
}

fragment ArtworkDetails_artwork on Artwork {
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
  image_rights
}

fragment ContextCard_artwork on Artwork {
  id
  slug
  internalID
  context {
    __typename
    ... on ArtworkContextAuction {
      id
      name
      href
      formattedStartDateTime
      cover_image {
        url
      }
    }
    ... on ArtworkContextFair {
      id
      name
      href
      exhibition_period
      image {
        url
      }
    }
    ... on Node {
      id
    }
  }
  shows(size: 1) {
    id
    name
    href
    slug
    internalID
    exhibition_period
    is_followed
    cover_image {
      url
    }
  }
}

fragment ArtworkHeader_artwork on Artwork {
  ...ArtworkActions_artwork
  ...ArtworkTombstone_artwork
  images {
    ...ImageCarousel_images
  }
}

fragment CommercialInformation_artwork on Artwork {
  availability
  partner {
    name
    id
  }
  artists {
    is_consignable
    id
  }
  sale {
    is_auction
    is_closed
    id
  }
  ...ArtworkAvailability_artwork
  ...SellerInfo_artwork
}

fragment ArtworkHistory_artwork on Artwork {
  provenance
  exhibition_history
  literature
}

fragment ArtworkAvailability_artwork on Artwork {
  availability
}

fragment SellerInfo_artwork on Artwork {
  availability
  partner {
    name
    id
  }
}

fragment ArtworkActions_artwork on Artwork {
  id
  internalID
  slug
  title
  href
  is_saved
  artists {
    name
    id
  }
  image {
    url
  }
  widthCm
  heightCm
}

fragment ArtworkTombstone_artwork on Artwork {
  title
  medium
  date
  cultural_maker
  artists {
    name
    href
    ...FollowArtistButton_artist
    id
  }
  dimensions {
    in
    cm
  }
  edition_of
  attribution_class {
    shortDescription
    id
  }
}

fragment ImageCarousel_images on Image {
  url
  width
  height
}

fragment FollowArtistButton_artist on Artist {
  id
  slug
  internalID
  is_followed
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  slug
  image {
    aspect_ratio
  }
  ...ArtworkGridItem_artwork
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  slug
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    id
  }
  sale_artwork {
    current_bid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    id
  }
  partner {
    name
    id
  }
  href
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
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_followed",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "biography_blurb",
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
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_auction",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v12 = [
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
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibition_period",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v16 = [
  (v15/*: any*/)
],
v17 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v16/*: any*/)
},
v18 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "cover_image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v16/*: any*/)
},
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v20 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v21 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_biddable",
  "args": null,
  "storageKey": null
},
v22 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_acquireable",
  "args": null,
  "storageKey": null
},
v23 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_offerable",
  "args": null,
  "storageKey": null
},
v24 = [
  (v3/*: any*/),
  (v2/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkQuery",
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
            "name": "Artwork_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkQuery",
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
            "alias": null,
            "name": "additional_information",
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
            "alias": null,
            "name": "exhibition_history",
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
                "name": "is_default_profile_public",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
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
                  (v5/*: any*/),
                  (v4/*: any*/),
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
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "locations",
                "storageKey": null,
                "args": null,
                "concreteType": "Location",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "city",
                    "args": null,
                    "storageKey": null
                  },
                  (v2/*: any*/)
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
              (v3/*: any*/),
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
              },
              (v2/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/)
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
            "kind": "LinkedField",
            "alias": null,
            "name": "conditionDescription",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v12/*: any*/)
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
            "selections": (v12/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "certificateOfAuthenticity",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v12/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "framed",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v12/*: any*/)
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
            "alias": null,
            "name": "image_rights",
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
              (v13/*: any*/),
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "ArtworkContextFair",
                "selections": [
                  (v3/*: any*/),
                  (v6/*: any*/),
                  (v14/*: any*/),
                  (v17/*: any*/)
                ]
              },
              {
                "kind": "InlineFragment",
                "type": "ArtworkContextAuction",
                "selections": [
                  (v3/*: any*/),
                  (v6/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "formattedStartDateTime",
                    "args": null,
                    "storageKey": null
                  },
                  (v18/*: any*/)
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
                "alias": null,
                "name": "artworks",
                "storageKey": "artworks(first:6)",
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
                          (v4/*: any*/),
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
                                "name": "aspect_ratio",
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
                              }
                            ]
                          },
                          (v19/*: any*/),
                          (v20/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "sale_message",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_in_auction",
                            "args": null,
                            "storageKey": null
                          },
                          (v21/*: any*/),
                          (v22/*: any*/),
                          (v23/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "sale",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Sale",
                            "plural": false,
                            "selections": [
                              (v10/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "is_live_open",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "is_open",
                                "args": null,
                                "storageKey": null
                              },
                              (v11/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "display_timely_at",
                                "args": null,
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "sale_artwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "current_bid",
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
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "artists",
                            "storageKey": "artists(shallow:true)",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "shallow",
                                "value": true
                              }
                            ],
                            "concreteType": "Artist",
                            "plural": true,
                            "selections": (v24/*: any*/)
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Partner",
                            "plural": false,
                            "selections": (v24/*: any*/)
                          },
                          (v6/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v13/*: any*/),
              (v19/*: any*/),
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
          (v4/*: any*/),
          (v5/*: any*/),
          (v22/*: any*/),
          (v23/*: any*/),
          (v21/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_inquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "availability",
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
              (v5/*: any*/),
              (v4/*: any*/),
              (v3/*: any*/),
              (v7/*: any*/),
              (v6/*: any*/),
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
              (v17/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_consignable",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "shows",
            "storageKey": "shows(size:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 1
              }
            ],
            "concreteType": "Show",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v14/*: any*/),
              (v8/*: any*/),
              (v18/*: any*/)
            ]
          },
          (v19/*: any*/),
          (v6/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_saved",
            "args": null,
            "storageKey": null
          },
          (v17/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "widthCm",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "heightCm",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "medium",
            "args": null,
            "storageKey": null
          },
          (v20/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "cultural_maker",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "dimensions",
            "storageKey": null,
            "args": null,
            "concreteType": "dimensions",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "in",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "cm",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "edition_of",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "attribution_class",
            "storageKey": null,
            "args": null,
            "concreteType": "AttributionClass",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "shortDescription",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              (v15/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "width",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "height",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtworkQuery",
    "id": "b6e71360f571068cbf8bd6b7547ae633",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '5d0f8dca3f718f5dd5d9dbe1489d31a1';
export default node;
