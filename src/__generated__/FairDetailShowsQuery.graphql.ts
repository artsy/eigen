/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairDetailShowsQueryVariables = {
    id: string;
    count: number;
    cursor?: string | null;
};
export type FairDetailShowsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairDetail_fair">;
    } | null;
};
export type FairDetailShowsQuery = {
    readonly response: FairDetailShowsQueryResponse;
    readonly variables: FairDetailShowsQueryVariables;
};



/*
query FairDetailShowsQuery(
  $id: String!
  $count: Int!
  $cursor: String
) {
  fair(id: $id) {
    ...FairDetail_fair_1G22uz
    id
  }
}

fragment FairDetail_fair_1G22uz on Fair {
  ...FairHeader_fair
  slug
  internalID
  name
  hours
  isActive
  location {
    ...LocationMap_location
    coordinates {
      lat
      lng
    }
    id
  }
  organizer {
    website
    id
  }
  profile {
    name
    id
  }
  sponsoredContent {
    pressReleaseUrl
    activationText
  }
  shows: showsConnection(first: $count, after: $cursor) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        artworks: artworksConnection(first: 4) {
          edges {
            node {
              slug
              id
            }
          }
        }
        ...FairBoothPreview_show
        id
        __typename
      }
    }
  }
}

fragment FairHeader_fair on Fair {
  slug
  name
  formattedOpeningHours
  startAt
  endAt
  exhibitionPeriod
  counts {
    artists
  }
  image {
    url
  }
  followedContent {
    artists {
      name
      href
      slug
      internalID
      id
    }
  }
  artistsConnection(first: 3) {
    edges {
      node {
        name
        href
        slug
        internalID
        id
      }
    }
  }
  profile {
    id
    icon {
      url(version: "square140")
    }
  }
}

fragment LocationMap_location on Location {
  id
  internalID
  city
  address
  address_2: address2
  postal_code: postalCode
  summary
  coordinates {
    lat
    lng
  }
}

fragment FairBoothPreview_show on Show {
  slug
  internalID
  counts {
    artworks
  }
  partner {
    __typename
    ... on Partner {
      name
      href
      slug
      internalID
      id
      profile {
        id
        slug
        internalID
        isFollowed
      }
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  coverImage {
    url
  }
  location {
    display
    id
  }
  artworks: artworksConnection(first: 4) {
    edges {
      node {
        ...GenericGrid_artworks
        id
      }
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

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message: saleMessage
  is_biddable: isBiddable
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  slug
  sale {
    is_auction: isAuction
    is_closed: isClosed
    display_timely_at: displayTimelyAt
    id
  }
  sale_artwork: saleArtwork {
    current_bid: currentBid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio: aspectRatio
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
    "name": "id",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
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
v4 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
],
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
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v8 = [
  (v3/*: any*/),
  (v5/*: any*/),
  (v2/*: any*/),
  (v6/*: any*/),
  (v7/*: any*/)
],
v9 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v11 = [
  (v3/*: any*/),
  (v7/*: any*/)
],
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FairDetailShowsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairDetail_fair",
            "args": [
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor"
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairDetailShowsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "formattedOpeningHours",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "startAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "endAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "exhibitionPeriod",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "FairCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artists",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "image",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": (v4/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "followedContent",
            "storageKey": null,
            "args": null,
            "concreteType": "FollowedContent",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artists",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": (v8/*: any*/)
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artistsConnection",
            "storageKey": "artistsConnection(first:3)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
              }
            ],
            "concreteType": "ArtistConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artist",
                    "plural": false,
                    "selections": (v8/*: any*/)
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "profile",
            "storageKey": null,
            "args": null,
            "concreteType": "Profile",
            "plural": false,
            "selections": [
              (v7/*: any*/),
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
              },
              (v3/*: any*/)
            ]
          },
          (v6/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "hours",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isActive",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v6/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "city",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "address",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "address_2",
                "name": "address2",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "postal_code",
                "name": "postalCode",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "summary",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "coordinates",
                "storageKey": null,
                "args": null,
                "concreteType": "LatLng",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lat",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lng",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "organizer",
            "storageKey": null,
            "args": null,
            "concreteType": "organizer",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "website",
                "args": null,
                "storageKey": null
              },
              (v7/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sponsoredContent",
            "storageKey": null,
            "args": null,
            "concreteType": "FairSponsoredContent",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "pressReleaseUrl",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "activationText",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "shows",
            "name": "showsConnection",
            "storageKey": null,
            "args": (v9/*: any*/),
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "startCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ShowEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Show",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": "artworks",
                        "name": "artworksConnection",
                        "storageKey": "artworksConnection(first:4)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 4
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
                                  (v7/*: any*/),
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
                                      }
                                    ]
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "title",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "date",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": "sale_message",
                                    "name": "saleMessage",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": "is_biddable",
                                    "name": "isBiddable",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": "is_acquireable",
                                    "name": "isAcquireable",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": "is_offerable",
                                    "name": "isOfferable",
                                    "args": null,
                                    "storageKey": null
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
                                        "alias": "is_auction",
                                        "name": "isAuction",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      {
                                        "kind": "ScalarField",
                                        "alias": "is_closed",
                                        "name": "isClosed",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      {
                                        "kind": "ScalarField",
                                        "alias": "display_timely_at",
                                        "name": "displayTimelyAt",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      (v7/*: any*/)
                                    ]
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": "sale_artwork",
                                    "name": "saleArtwork",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "SaleArtwork",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "LinkedField",
                                        "alias": "current_bid",
                                        "name": "currentBid",
                                        "storageKey": null,
                                        "args": null,
                                        "concreteType": "SaleArtworkCurrentBid",
                                        "plural": false,
                                        "selections": [
                                          (v10/*: any*/)
                                        ]
                                      },
                                      (v7/*: any*/)
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
                                    "selections": (v11/*: any*/)
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "partner",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Partner",
                                    "plural": false,
                                    "selections": (v11/*: any*/)
                                  },
                                  (v5/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v2/*: any*/),
                      (v6/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "counts",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ShowCounts",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "artworks",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          (v12/*: any*/),
                          (v7/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              (v3/*: any*/),
                              (v5/*: any*/),
                              (v2/*: any*/),
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
                                  (v7/*: any*/),
                                  (v2/*: any*/),
                                  (v6/*: any*/),
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "isFollowed",
                                    "args": null,
                                    "storageKey": null
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
                        "name": "coverImage",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": (v4/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "location",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Location",
                        "plural": false,
                        "selections": [
                          (v10/*: any*/),
                          (v7/*: any*/)
                        ]
                      },
                      (v7/*: any*/),
                      (v12/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "shows",
            "name": "showsConnection",
            "args": (v9/*: any*/),
            "handle": "connection",
            "key": "Fair_shows",
            "filters": null
          },
          (v7/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FairDetailShowsQuery",
    "id": "799f311cb1f781211196d16e7976be1f",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '21f76737f5ce9859445a5f9a15e41c99';
export default node;
