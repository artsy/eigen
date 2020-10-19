/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0b198c319b2b6e565919e24b3c9637db */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleTestsQueryVariables = {};
export type SaleTestsQueryResponse = {
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"Sale_sale">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Sale_me">;
    } | null;
};
export type SaleTestsQuery = {
    readonly response: SaleTestsQueryResponse;
    readonly variables: SaleTestsQueryVariables;
};



/*
query SaleTestsQuery {
  sale(id: "the-sale") {
    ...Sale_sale
    id
  }
  me {
    ...Sale_me
    id
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  internalID
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    lotLabel
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

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
  __isArtworkConnectionInterface: __typename
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    __typename
    node {
      slug
      id
      image {
        aspectRatio
      }
      ...ArtworkGridItem_artwork
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment LotsByFollowedArtists_me on Me {
  lotsByFollowedArtistsConnection(first: 10, liveSale: true, isAuction: true) {
    edges {
      cursor
      node {
        __typename
        id
      }
      id
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment RegisterToBidButton_sale on Sale {
  slug
  startAt
  endAt
  requireIdentityVerification
  registrationStatus {
    qualifiedForBidding
    id
  }
}

fragment SaleArtworkListItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  internalID
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    lotLabel
    id
  }
  image {
    small: url(version: "small")
    aspectRatio
    height
    width
  }
}

fragment SaleArtworkList_me on Me {
  lotsByFollowedArtistsConnection(first: 10, liveSale: true, isAuction: true) {
    edges {
      cursor
      node {
        internalID
        ...SaleArtworkListItem_artwork
        id
        __typename
      }
      id
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment SaleArtworksRail_saleArtworks on SaleArtwork {
  artwork {
    image {
      url(version: "small")
    }
    href
    saleMessage
    artistNames
    slug
    internalID
    sale {
      isAuction
      isClosed
      displayTimelyAt
      endAt
      id
    }
    saleArtwork {
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
      id
    }
    partner {
      name
      id
    }
    id
  }
  lotLabel
}

fragment SaleHeader_sale on Sale {
  name
  internalID
  liveStartAt
  endAt
  startAt
  timeZone
  coverImage {
    url
  }
}

fragment SaleLotsList_me on Me {
  ...LotsByFollowedArtists_me
  ...SaleArtworkList_me
}

fragment Sale_me on Me {
  ...SaleLotsList_me
}

fragment Sale_sale on Sale {
  slug
  liveStartAt
  ...SaleHeader_sale
  ...RegisterToBidButton_sale
  saleArtworksConnection(first: 10) {
    edges {
      node {
        ...SaleArtworksRail_saleArtworks
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "the-sale"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v7 = [
  {
    "kind": "Literal",
    "name": "version",
    "value": "small"
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "Sale",
  "kind": "LinkedField",
  "name": "sale",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAuction",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isClosed",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayTimelyAt",
      "storageKey": null
    },
    (v4/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCounts",
  "kind": "LinkedField",
  "name": "counts",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bidderPositions",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "display",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v16 = [
  (v6/*: any*/),
  {
    "kind": "Literal",
    "name": "isAuction",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "liveSale",
    "value": true
  }
],
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v18 = [
  "liveSale",
  "isAuction"
],
v19 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v20 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v23 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v26 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v27 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCounts"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCurrentBid"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SaleTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Sale_sale"
          }
        ],
        "storageKey": "sale(id:\"the-sale\")"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Sale_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SaleTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "liveStartAt",
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "timeZone",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "requireIdentityVerification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "registrationStatus",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "qualifiedForBidding",
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              (v6/*: any*/)
            ],
            "concreteType": "SaleArtworkConnection",
            "kind": "LinkedField",
            "name": "saleArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtworkEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SaleArtwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "artwork",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": (v7/*: any*/),
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"small\")"
                              }
                            ],
                            "storageKey": null
                          },
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v1/*: any*/),
                          (v3/*: any*/),
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "kind": "LinkedField",
                            "name": "saleArtwork",
                            "plural": false,
                            "selections": [
                              (v12/*: any*/),
                              (v13/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v14/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v15/*: any*/),
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "saleArtworksConnection(first:10)"
          },
          (v5/*: any*/)
        ],
        "storageKey": "sale(id:\"the-sale\")"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v16/*: any*/),
            "concreteType": "SaleArtworksConnection",
            "kind": "LinkedField",
            "name": "lotsByFollowedArtistsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtwork",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v17/*: any*/),
                      (v5/*: any*/),
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "title",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "date",
                        "storageKey": null
                      },
                      (v9/*: any*/),
                      (v1/*: any*/),
                      (v10/*: any*/),
                      (v8/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "kind": "LinkedField",
                        "name": "saleArtwork",
                        "plural": false,
                        "selections": [
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v15/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "image",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "small",
                            "args": (v7/*: any*/),
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"small\")"
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "aspectRatio",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "height",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "width",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "startCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v17/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "large"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"large\")"
                              }
                            ],
                            "storageKey": null
                          },
                          (v14/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isNode"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
            ],
            "storageKey": "lotsByFollowedArtistsConnection(first:10,isAuction:true,liveSale:true)"
          },
          {
            "alias": null,
            "args": (v16/*: any*/),
            "filters": (v18/*: any*/),
            "handle": "connection",
            "key": "LotsByFollowedArtists_lotsByFollowedArtistsConnection",
            "kind": "LinkedHandle",
            "name": "lotsByFollowedArtistsConnection"
          },
          {
            "alias": null,
            "args": (v16/*: any*/),
            "filters": (v18/*: any*/),
            "handle": "connection",
            "key": "SaleArtworkList_lotsByFollowedArtistsConnection",
            "kind": "LinkedHandle",
            "name": "lotsByFollowedArtistsConnection"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0b198c319b2b6e565919e24b3c9637db",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v19/*: any*/),
        "me.lotsByFollowedArtistsConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworksConnection"
        },
        "me.lotsByFollowedArtistsConnection.__isArtworkConnectionInterface": (v20/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "me.lotsByFollowedArtistsConnection.edges.__isNode": (v20/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.__typename": (v20/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.cursor": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.id": (v19/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node": (v22/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.__typename": (v20/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.artistNames": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.date": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.href": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.id": (v19/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image": (v23/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "me.lotsByFollowedArtistsConnection.edges.node.image.height": (v24/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.small": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.url": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.width": (v24/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.internalID": (v19/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner.id": (v19/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner.name": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale": (v26/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.displayTimelyAt": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.endAt": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.id": (v19/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.isAuction": (v27/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.isClosed": (v27/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts": (v29/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts.bidderPositions": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid": (v31/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid.display": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.id": (v19/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.lotLabel": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleMessage": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.slug": (v19/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.title": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.lotsByFollowedArtistsConnection.pageInfo.endCursor": (v21/*: any*/),
        "me.lotsByFollowedArtistsConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.lotsByFollowedArtistsConnection.pageInfo.startCursor": (v21/*: any*/),
        "sale": (v26/*: any*/),
        "sale.coverImage": (v23/*: any*/),
        "sale.coverImage.url": (v21/*: any*/),
        "sale.endAt": (v21/*: any*/),
        "sale.id": (v19/*: any*/),
        "sale.internalID": (v19/*: any*/),
        "sale.liveStartAt": (v21/*: any*/),
        "sale.name": (v21/*: any*/),
        "sale.registrationStatus": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Bidder"
        },
        "sale.registrationStatus.id": (v19/*: any*/),
        "sale.registrationStatus.qualifiedForBidding": (v27/*: any*/),
        "sale.requireIdentityVerification": (v27/*: any*/),
        "sale.saleArtworksConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkConnection"
        },
        "sale.saleArtworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "SaleArtworkEdge"
        },
        "sale.saleArtworksConnection.edges.node": (v28/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork": (v22/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.artistNames": (v21/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.href": (v21/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.id": (v19/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.image": (v23/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.image.url": (v21/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.internalID": (v19/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.partner": (v25/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.partner.id": (v19/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.partner.name": (v21/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale": (v26/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.displayTimelyAt": (v21/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.endAt": (v21/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.id": (v19/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.isAuction": (v27/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.sale.isClosed": (v27/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork": (v28/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.counts": (v29/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.counts.bidderPositions": (v30/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.currentBid": (v31/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.currentBid.display": (v21/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleArtwork.id": (v19/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.saleMessage": (v21/*: any*/),
        "sale.saleArtworksConnection.edges.node.artwork.slug": (v19/*: any*/),
        "sale.saleArtworksConnection.edges.node.id": (v19/*: any*/),
        "sale.saleArtworksConnection.edges.node.lotLabel": (v21/*: any*/),
        "sale.slug": (v19/*: any*/),
        "sale.startAt": (v21/*: any*/),
        "sale.timeZone": (v21/*: any*/)
      }
    },
    "name": "SaleTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '6ce377178419822555cd9b58433d222b';
export default node;
