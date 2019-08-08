/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { SaleArtworksGrid_sale$ref } from "./SaleArtworksGrid_sale.graphql";
export type SaleArtworksGridQueryVariables = {
    readonly id: string;
    readonly count: number;
    readonly cursor?: string | null;
};
export type SaleArtworksGridQueryResponse = {
    readonly node: ({
        readonly " $fragmentRefs": SaleArtworksGrid_sale$ref;
    } & ({
        readonly " $fragmentRefs": SaleArtworksGrid_sale$ref;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    })) | null;
};
export type SaleArtworksGridQuery = {
    readonly response: SaleArtworksGridQueryResponse;
    readonly variables: SaleArtworksGridQueryVariables;
};



/*
query SaleArtworksGridQuery(
  $id: ID!
  $count: Int!
  $cursor: String
) {
  node(id: $id) {
    __typename
    ... on Sale {
      ...SaleArtworksGrid_sale_1G22uz
    }
    id
  }
}

fragment SaleArtworksGrid_sale_1G22uz on Sale {
  id
  saleArtworks: saleArtworksConnection(first: $count, after: $cursor) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        artwork {
          id
          slug
          image {
            aspect_ratio: aspectRatio
          }
          ...ArtworkGridItem_artwork
        }
        id
        __typename
      }
      cursor
    }
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message: saleMessage
  is_in_auction: isInAuction
  is_biddable: isBiddable
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  slug
  sale {
    is_auction: isAuction
    is_live_open: isLiveOpen
    is_open: isOpen
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
    "type": "ID!",
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
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
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
v5 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  (v3/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleArtworksGridQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "type": "Sale",
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "SaleArtworksGrid_sale",
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
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleArtworksGridQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "type": "Sale",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "saleArtworks",
                "name": "saleArtworksConnection",
                "storageKey": null,
                "args": (v4/*: any*/),
                "concreteType": "SaleArtworkConnection",
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
                    "concreteType": "SaleArtworkEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "artwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "slug",
                                "args": null,
                                "storageKey": null
                              },
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
                                "alias": "is_in_auction",
                                "name": "isInAuction",
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
                                    "alias": "is_live_open",
                                    "name": "isLiveOpen",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": "is_open",
                                    "name": "isOpen",
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
                                  (v3/*: any*/)
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
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "display",
                                        "args": null,
                                        "storageKey": null
                                      }
                                    ]
                                  },
                                  (v3/*: any*/)
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
                                "selections": (v5/*: any*/)
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "partner",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Partner",
                                "plural": false,
                                "selections": (v5/*: any*/)
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "href",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          (v3/*: any*/),
                          (v2/*: any*/)
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "cursor",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "saleArtworks",
                "name": "saleArtworksConnection",
                "args": (v4/*: any*/),
                "handle": "connection",
                "key": "SaleArtworksGrid_saleArtworks",
                "filters": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SaleArtworksGridQuery",
    "id": "6755a74707875bd6c43624d3b892188b",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'adc7147fdf8c6b45db34fee4b5935180';
export default node;
