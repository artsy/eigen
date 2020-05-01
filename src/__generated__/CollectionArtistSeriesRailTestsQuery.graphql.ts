/* tslint:disable */
/* eslint-disable */
/* @relayHash ad7a58a1be58a960a3edd526bdf0afe1 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketingGroupTypes = "ArtistSeries" | "FeaturedCollections" | "OtherCollections" | "%future added value";
export type CollectionArtistSeriesRailTestsQueryVariables = {};
export type CollectionArtistSeriesRailTestsQueryResponse = {
    readonly marketingCollections: ReadonlyArray<{
        readonly linkedCollections: ReadonlyArray<{
            readonly groupType: MarketingGroupTypes;
            readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collectionGroup">;
        }>;
    }>;
};
export type CollectionArtistSeriesRailTestsQueryRawResponse = {
    readonly marketingCollections: ReadonlyArray<{
        readonly linkedCollections: ReadonlyArray<{
            readonly groupType: MarketingGroupTypes;
            readonly name: string;
            readonly members: ReadonlyArray<{
                readonly slug: string;
                readonly title: string;
                readonly priceGuidance: number | null;
                readonly artworksConnection: ({
                    readonly edges: ReadonlyArray<({
                        readonly node: ({
                            readonly title: string | null;
                            readonly image: ({
                                readonly url: string | null;
                            }) | null;
                            readonly id: string | null;
                        }) | null;
                    }) | null> | null;
                    readonly id: string | null;
                }) | null;
                readonly defaultHeader: ({
                    readonly edges: ReadonlyArray<({
                        readonly node: ({
                            readonly image: ({
                                readonly url: string | null;
                            }) | null;
                            readonly id: string | null;
                        }) | null;
                    }) | null> | null;
                    readonly id: string | null;
                }) | null;
                readonly id: string | null;
            }>;
        }>;
        readonly id: string | null;
    }>;
};
export type CollectionArtistSeriesRailTestsQuery = {
    readonly response: CollectionArtistSeriesRailTestsQueryResponse;
    readonly variables: CollectionArtistSeriesRailTestsQueryVariables;
    readonly rawResponse: CollectionArtistSeriesRailTestsQueryRawResponse;
};



/*
query CollectionArtistSeriesRailTestsQuery {
  marketingCollections(slugs: "photography") {
    linkedCollections {
      groupType
      ...CollectionArtistSeriesRail_collectionGroup
    }
    id
  }
}

fragment CollectionArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
  name
  members {
    slug
    title
    priceGuidance
    artworksConnection(first: 3, aggregations: [TOTAL], sort: "-decayed_merch") {
      edges {
        node {
          title
          image {
            url
          }
          id
        }
      }
      id
    }
    defaultHeader: artworksConnection(sort: "-decayed_merch", first: 1) {
      edges {
        node {
          image {
            url
          }
          id
        }
      }
      id
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slugs",
    "value": "photography"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "groupType",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "Literal",
  "name": "sort",
  "value": "-decayed_merch"
},
v4 = {
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
      "name": "url",
      "args": null,
      "storageKey": null
    }
  ]
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CollectionArtistSeriesRailTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollections",
        "storageKey": "marketingCollections(slugs:\"photography\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": true,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "linkedCollections",
            "storageKey": null,
            "args": null,
            "concreteType": "MarketingCollectionGroup",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              {
                "kind": "FragmentSpread",
                "name": "CollectionArtistSeriesRail_collectionGroup",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CollectionArtistSeriesRailTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollections",
        "storageKey": "marketingCollections(slugs:\"photography\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": true,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "linkedCollections",
            "storageKey": null,
            "args": null,
            "concreteType": "MarketingCollectionGroup",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "members",
                "storageKey": null,
                "args": null,
                "concreteType": "MarketingCollection",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slug",
                    "args": null,
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "priceGuidance",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "aggregations",
                        "value": [
                          "TOTAL"
                        ]
                      },
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 3
                      },
                      (v3/*: any*/)
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "edges",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FilterArtworksEdge",
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
                              (v5/*: any*/)
                            ]
                          }
                        ]
                      },
                      (v5/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "defaultHeader",
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(first:1,sort:\"-decayed_merch\")",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 1
                      },
                      (v3/*: any*/)
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "edges",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FilterArtworksEdge",
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
                              (v4/*: any*/),
                              (v5/*: any*/)
                            ]
                          }
                        ]
                      },
                      (v5/*: any*/)
                    ]
                  },
                  (v5/*: any*/)
                ]
              }
            ]
          },
          (v5/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionArtistSeriesRailTestsQuery",
    "id": "f5803147a7ba1da2e480917acc7b5bc5",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'ee263b4d12c7fb59fdebf04f45cd8368';
export default node;
