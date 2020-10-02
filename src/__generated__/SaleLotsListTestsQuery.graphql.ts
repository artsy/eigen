/* tslint:disable */
/* eslint-disable */
/* @relayHash d20db0375f63413c51bd8a6249a6929c */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsListTestsQueryVariables = {};
export type SaleLotsListTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_me">;
    } | null;
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_sale">;
    } | null;
};
export type SaleLotsListTestsQuery = {
    readonly response: SaleLotsListTestsQueryResponse;
    readonly variables: SaleLotsListTestsQueryVariables;
};



/*
query SaleLotsListTestsQuery {
  me {
    ...SaleLotsList_me
    id
  }
  sale(id: "the-sale") {
    ...SaleLotsList_sale
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

fragment SaleLotsList_me on Me {
  ...LotsByFollowedArtists_me
  ...SaleArtworkList_me
}

fragment SaleLotsList_sale on Sale {
  internalID
  slug
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
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
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
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v5 = [
  "liveSale",
  "isAuction"
],
v6 = {
  "type": "Sale",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v7 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v8 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v9 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v10 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v11 = {
  "type": "Int",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleLotsListTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SaleLotsList_me",
            "args": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": "sale(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SaleLotsList_sale",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleLotsListTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "lotsByFollowedArtistsConnection",
            "storageKey": "lotsByFollowedArtistsConnection(first:10,isAuction:true,liveSale:true)",
            "args": (v1/*: any*/),
            "concreteType": "SaleArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtwork",
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
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "__typename",
                        "args": null,
                        "storageKey": null
                      },
                      (v2/*: any*/),
                      (v3/*: any*/),
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
                          {
                            "kind": "ScalarField",
                            "alias": "small",
                            "name": "url",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "small"
                              }
                            ],
                            "storageKey": "url(version:\"small\")"
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "height",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "width",
                            "args": null,
                            "storageKey": null
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
                        "alias": null,
                        "name": "saleMessage",
                        "args": null,
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "artistNames",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "href",
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
                            "alias": null,
                            "name": "isAuction",
                            "args": null,
                            "storageKey": null
                          },
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "endAt",
                            "args": null,
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ]
                      },
                      {
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
                            "name": "counts",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtworkCounts",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "bidderPositions",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "lotLabel",
                            "args": null,
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ]
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
                            "name": "name",
                            "args": null,
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v2/*: any*/)
                ]
              },
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
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "lotsByFollowedArtistsConnection",
            "args": (v1/*: any*/),
            "handle": "connection",
            "key": "LotsByFollowedArtists_lotsByFollowedArtistsConnection",
            "filters": (v5/*: any*/)
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "lotsByFollowedArtistsConnection",
            "args": (v1/*: any*/),
            "handle": "connection",
            "key": "SaleArtworkList_lotsByFollowedArtistsConnection",
            "filters": (v5/*: any*/)
          },
          (v2/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": "sale(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v3/*: any*/),
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SaleLotsListTestsQuery",
    "id": "91e96a42a0794e7f87d15e27c6adbd08",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "type": "Me",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale": (v6/*: any*/),
        "me.id": (v7/*: any*/),
        "sale.id": (v7/*: any*/),
        "sale.internalID": (v8/*: any*/),
        "sale.slug": (v8/*: any*/),
        "me.lotsByFollowedArtistsConnection": {
          "type": "SaleArtworksConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges": {
          "type": "ArtworkEdgeInterface",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.pageInfo": {
          "type": "PageInfo",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.lotsByFollowedArtistsConnection.edges.cursor": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.id": (v7/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.pageInfo.hasNextPage": {
          "type": "Boolean",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.lotsByFollowedArtistsConnection.pageInfo.startCursor": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.pageInfo.endCursor": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.internalID": (v8/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.id": (v7/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.__typename": {
          "type": "String",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.lotsByFollowedArtistsConnection.edges.node.slug": (v8/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.title": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.date": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleMessage": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.artistNames": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.href": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale": (v6/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.image.aspectRatio": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "me.lotsByFollowedArtistsConnection.edges.node.partner": {
          "type": "Partner",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.sale.isAuction": (v10/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.isClosed": (v10/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.displayTimelyAt": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.endAt": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.sale.id": (v7/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts": {
          "type": "SaleArtworkCounts",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.lotLabel": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.id": (v7/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.small": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.height": (v11/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.width": (v11/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner.name": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.partner.id": (v7/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.image.url": (v9/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts.bidderPositions": {
          "type": "FormattedNumber",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid.display": (v9/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'd02f6032706152dbcc2cef8a078ff779';
export default node;
