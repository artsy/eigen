/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 033696dd87340e7c0c3274af374560e0 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketingGroupTypes = "ArtistSeries" | "FeaturedCollections" | "OtherCollections" | "%future added value";
export type CollectionArtistSeriesRailTestsQueryVariables = {};
export type CollectionArtistSeriesRailTestsQueryResponse = {
    readonly marketingCollection: {
        readonly linkedCollections: ReadonlyArray<{
            readonly groupType: MarketingGroupTypes;
            readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collectionGroup">;
        }>;
        readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collection">;
    } | null;
};
export type CollectionArtistSeriesRailTestsQueryRawResponse = {
    readonly marketingCollection: ({
        readonly slug: string;
        readonly id: string;
        readonly linkedCollections: ReadonlyArray<{
            readonly groupType: MarketingGroupTypes;
            readonly name: string;
            readonly members: ReadonlyArray<{
                readonly slug: string;
                readonly id: string;
                readonly title: string;
                readonly priceGuidance: number | null;
                readonly artworksConnection: ({
                    readonly edges: ReadonlyArray<({
                        readonly node: ({
                            readonly title: string | null;
                            readonly image: ({
                                readonly url: string | null;
                            }) | null;
                            readonly id: string;
                        }) | null;
                    }) | null> | null;
                    readonly id: string;
                }) | null;
            }>;
        }>;
    }) | null;
};
export type CollectionArtistSeriesRailTestsQuery = {
    readonly response: CollectionArtistSeriesRailTestsQueryResponse;
    readonly variables: CollectionArtistSeriesRailTestsQueryVariables;
    readonly rawResponse: CollectionArtistSeriesRailTestsQueryRawResponse;
};



/*
query CollectionArtistSeriesRailTestsQuery {
  marketingCollection(slug: "photography") {
    ...CollectionArtistSeriesRail_collection
    linkedCollections {
      groupType
      ...CollectionArtistSeriesRail_collectionGroup
    }
    id
  }
}

fragment CollectionArtistSeriesRail_collection on MarketingCollection {
  slug
  id
}

fragment CollectionArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
  name
  members {
    slug
    id
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
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slug",
    "value": "photography"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "groupType",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CollectionArtistSeriesRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "MarketingCollectionGroup",
            "kind": "LinkedField",
            "name": "linkedCollections",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "CollectionArtistSeriesRail_collectionGroup"
              }
            ],
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "CollectionArtistSeriesRail_collection"
          }
        ],
        "storageKey": "marketingCollection(slug:\"photography\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CollectionArtistSeriesRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "MarketingCollectionGroup",
            "kind": "LinkedField",
            "name": "linkedCollections",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "MarketingCollection",
                "kind": "LinkedField",
                "name": "members",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "priceGuidance",
                    "storageKey": null
                  },
                  {
                    "alias": null,
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
                      {
                        "kind": "Literal",
                        "name": "sort",
                        "value": "-decayed_merch"
                      }
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "kind": "LinkedField",
                    "name": "artworksConnection",
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
                                    "name": "url",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v3/*: any*/)
                    ],
                    "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "marketingCollection(slug:\"photography\")"
      }
    ]
  },
  "params": {
    "id": "033696dd87340e7c0c3274af374560e0",
    "metadata": {},
    "name": "CollectionArtistSeriesRailTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '818dfb6f7f9593fcc13bcc8029b1c630';
export default node;
