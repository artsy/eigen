/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fb034fc84d39498fd60d388d7a1aa6c2 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BuyNowArtworksRailTestsQueryVariables = {
    id: string;
};
export type BuyNowArtworksRailTestsQueryResponse = {
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"BuyNowArtworksRail_sale">;
    } | null;
};
export type BuyNowArtworksRailTestsQuery = {
    readonly response: BuyNowArtworksRailTestsQueryResponse;
    readonly variables: BuyNowArtworksRailTestsQueryVariables;
};



/*
query BuyNowArtworksRailTestsQuery(
  $id: String!
) {
  sale(id: $id) {
    ...BuyNowArtworksRail_sale
    id
  }
}

fragment ArtworkRailCard_artwork_hl5k2 on Artwork {
  id
  slug
  internalID
  href
  artistNames
  date
  image {
    resized(width: 155) {
      src
      srcSet
      width
      height
    }
    aspectRatio
  }
  sale {
    isAuction
    isClosed
    endAt
    id
  }
  saleMessage
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
  title
  realizedPrice
}

fragment BuyNowArtworksRail_sale on Sale {
  internalID
  promotedSale {
    saleArtworksConnection(first: 20) {
      edges {
        node {
          artwork {
            ...SmallArtworkRail_artworks
            id
          }
          id
          __typename
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
    id
  }
}

fragment SmallArtworkRail_artworks on Artwork {
  ...ArtworkRailCard_artwork_hl5k2
  internalID
  href
  slug
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v7 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v10 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v11 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BuyNowArtworksRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "BuyNowArtworksRail_sale"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "BuyNowArtworksRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Sale",
            "kind": "LinkedField",
            "name": "promotedSale",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v3/*: any*/),
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
                              (v4/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "slug",
                                "storageKey": null
                              },
                              (v2/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "href",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "artistNames",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "date",
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
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "width",
                                        "value": 155
                                      }
                                    ],
                                    "concreteType": "ResizedImageUrl",
                                    "kind": "LinkedField",
                                    "name": "resized",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "src",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "srcSet",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "width",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "height",
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": "resized(width:155)"
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "aspectRatio",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
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
                                    "name": "endAt",
                                    "storageKey": null
                                  },
                                  (v4/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "saleMessage",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SaleArtwork",
                                "kind": "LinkedField",
                                "name": "saleArtwork",
                                "plural": false,
                                "selections": [
                                  {
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
                                  {
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
                                  (v4/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Partner",
                                "kind": "LinkedField",
                                "name": "partner",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "name",
                                    "storageKey": null
                                  },
                                  (v4/*: any*/)
                                ],
                                "storageKey": null
                              },
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
                                "name": "realizedPrice",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "__typename",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      }
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
                  }
                ],
                "storageKey": "saleArtworksConnection(first:20)"
              },
              {
                "alias": null,
                "args": (v3/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "Sale_saleArtworksConnection",
                "kind": "LinkedHandle",
                "name": "saleArtworksConnection"
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "fb034fc84d39498fd60d388d7a1aa6c2",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "sale": (v5/*: any*/),
        "sale.id": (v6/*: any*/),
        "sale.internalID": (v6/*: any*/),
        "sale.promotedSale": (v5/*: any*/),
        "sale.promotedSale.id": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkConnection"
        },
        "sale.promotedSale.saleArtworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "SaleArtworkEdge"
        },
        "sale.promotedSale.saleArtworksConnection.edges.cursor": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node": (v8/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.__typename": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.artistNames": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.date": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.href": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.id": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image.resized": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ResizedImageUrl"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image.resized.height": (v10/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image.resized.src": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image.resized.srcSet": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image.resized.width": (v10/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.internalID": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.partner.id": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.partner.name": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.realizedPrice": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.sale": (v5/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.sale.endAt": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.sale.id": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.sale.isAuction": (v11/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.sale.isClosed": (v11/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.saleArtwork": (v8/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.saleArtwork.counts.bidderPositions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FormattedNumber"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.saleArtwork.currentBid.display": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.saleArtwork.id": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.saleMessage": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.slug": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.title": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.id": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "sale.promotedSale.saleArtworksConnection.pageInfo.endCursor": (v9/*: any*/),
        "sale.promotedSale.saleArtworksConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "BuyNowArtworksRailTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '83497160b713fbb1057034de3ab1812a';
export default node;
