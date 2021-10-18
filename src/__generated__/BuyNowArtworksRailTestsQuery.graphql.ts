/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 10625b74cabb209977b5cafa69ad905c */

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

fragment BuyNowArtworksRail_sale on Sale {
  internalID
  promotedSale {
    saleArtworksConnection(first: 4) {
      edges {
        node {
          artwork {
            id
            title
            date
            saleMessage
            artistNames
            href
            image {
              imageURL
            }
            partner {
              name
              id
            }
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
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 4
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v7 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
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
                "args": (v2/*: any*/),
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
                                "kind": "ScalarField",
                                "name": "artistNames",
                                "storageKey": null
                              },
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
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "image",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "imageURL",
                                    "storageKey": null
                                  }
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
                                  (v3/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
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
                "storageKey": "saleArtworksConnection(first:4)"
              },
              {
                "alias": null,
                "args": (v2/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "Sale_saleArtworksConnection",
                "kind": "LinkedHandle",
                "name": "saleArtworksConnection"
              },
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "10625b74cabb209977b5cafa69ad905c",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "sale": (v4/*: any*/),
        "sale.id": (v5/*: any*/),
        "sale.internalID": (v5/*: any*/),
        "sale.promotedSale": (v4/*: any*/),
        "sale.promotedSale.id": (v5/*: any*/),
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
        "sale.promotedSale.saleArtworksConnection.edges.cursor": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.__typename": (v6/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.artistNames": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.date": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.href": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.id": (v5/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.image.imageURL": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.partner.id": (v5/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.partner.name": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.saleMessage": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.artwork.title": (v7/*: any*/),
        "sale.promotedSale.saleArtworksConnection.edges.node.id": (v5/*: any*/),
        "sale.promotedSale.saleArtworksConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "sale.promotedSale.saleArtworksConnection.pageInfo.endCursor": (v7/*: any*/),
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
