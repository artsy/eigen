/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b0ad82fd23e7bb5e01174353979a797a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairFollowedArtistsRailTestsQueryVariables = {
    fairID: string;
};
export type FairFollowedArtistsRailTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairFollowedArtistsRail_fair">;
    } | null;
};
export type FairFollowedArtistsRailTestsQueryRawResponse = {
    readonly fair: ({
        readonly internalID: string;
        readonly slug: string;
        readonly filterArtworksConnection: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly slug: string;
                    readonly internalID: string;
                    readonly href: string | null;
                    readonly artistNames: string | null;
                    readonly date: string | null;
                    readonly image: ({
                        readonly resized: ({
                            readonly src: string;
                            readonly srcSet: string;
                            readonly width: number | null;
                            readonly height: number | null;
                        }) | null;
                        readonly aspectRatio: number;
                    }) | null;
                    readonly sale: ({
                        readonly isAuction: boolean | null;
                        readonly isClosed: boolean | null;
                        readonly endAt: string | null;
                        readonly id: string;
                    }) | null;
                    readonly saleMessage: string | null;
                    readonly saleArtwork: ({
                        readonly counts: ({
                            readonly bidderPositions: number | null;
                        }) | null;
                        readonly currentBid: ({
                            readonly display: string | null;
                        }) | null;
                        readonly id: string;
                    }) | null;
                    readonly partner: ({
                        readonly name: string | null;
                        readonly id: string;
                    }) | null;
                    readonly title: string | null;
                }) | null;
            }) | null> | null;
            readonly id: string;
        }) | null;
        readonly id: string;
    }) | null;
};
export type FairFollowedArtistsRailTestsQuery = {
    readonly response: FairFollowedArtistsRailTestsQueryResponse;
    readonly variables: FairFollowedArtistsRailTestsQueryVariables;
    readonly rawResponse: FairFollowedArtistsRailTestsQueryRawResponse;
};



/*
query FairFollowedArtistsRailTestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...FairFollowedArtistsRail_fair
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
}

fragment FairFollowedArtistsRail_fair on Fair {
  internalID
  slug
  filterArtworksConnection(first: 20, input: {includeArtworksByFollowedArtists: true}) {
    edges {
      node {
        ...SmallArtworkRail_artworks
        id
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
    "name": "fairID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
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
  "type": "String"
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v7 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v8 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v9 = {
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
    "name": "FairFollowedArtistsRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FairFollowedArtistsRail_fair"
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
    "name": "FairFollowedArtistsRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 20
              },
              {
                "kind": "Literal",
                "name": "input",
                "value": {
                  "includeArtworksByFollowedArtists": true
                }
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v3/*: any*/),
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
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(first:20,input:{\"includeArtworksByFollowedArtists\":true})"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "b0ad82fd23e7bb5e01174353979a797a",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "fair.filterArtworksConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksConnection"
        },
        "fair.filterArtworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "FilterArtworksEdge"
        },
        "fair.filterArtworksConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "fair.filterArtworksConnection.edges.node.artistNames": (v5/*: any*/),
        "fair.filterArtworksConnection.edges.node.date": (v5/*: any*/),
        "fair.filterArtworksConnection.edges.node.href": (v5/*: any*/),
        "fair.filterArtworksConnection.edges.node.id": (v6/*: any*/),
        "fair.filterArtworksConnection.edges.node.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "fair.filterArtworksConnection.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "fair.filterArtworksConnection.edges.node.image.resized": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ResizedImageUrl"
        },
        "fair.filterArtworksConnection.edges.node.image.resized.height": (v7/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.resized.src": (v8/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.resized.srcSet": (v8/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.resized.width": (v7/*: any*/),
        "fair.filterArtworksConnection.edges.node.internalID": (v6/*: any*/),
        "fair.filterArtworksConnection.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "fair.filterArtworksConnection.edges.node.partner.id": (v6/*: any*/),
        "fair.filterArtworksConnection.edges.node.partner.name": (v5/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "fair.filterArtworksConnection.edges.node.sale.endAt": (v5/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale.id": (v6/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale.isAuction": (v9/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale.isClosed": (v9/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "fair.filterArtworksConnection.edges.node.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "fair.filterArtworksConnection.edges.node.saleArtwork.counts.bidderPositions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FormattedNumber"
        },
        "fair.filterArtworksConnection.edges.node.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "fair.filterArtworksConnection.edges.node.saleArtwork.currentBid.display": (v5/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleArtwork.id": (v6/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleMessage": (v5/*: any*/),
        "fair.filterArtworksConnection.edges.node.slug": (v6/*: any*/),
        "fair.filterArtworksConnection.edges.node.title": (v5/*: any*/),
        "fair.filterArtworksConnection.id": (v6/*: any*/),
        "fair.id": (v6/*: any*/),
        "fair.internalID": (v6/*: any*/),
        "fair.slug": (v6/*: any*/)
      }
    },
    "name": "FairFollowedArtistsRailTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '2063a2cf6c405bbbe06fc94476fc9f67';
export default node;
