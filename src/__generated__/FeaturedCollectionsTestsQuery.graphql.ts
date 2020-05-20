/* tslint:disable */
/* eslint-disable */
/* @relayHash 27cb2ab39042bfc7156e29843dc917a0 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketingGroupTypes = "ArtistSeries" | "FeaturedCollections" | "OtherCollections" | "%future added value";
export type FeaturedCollectionsTestsQueryVariables = {};
export type FeaturedCollectionsTestsQueryResponse = {
    readonly marketingCollection: {
        readonly linkedCollections: ReadonlyArray<{
            readonly groupType: MarketingGroupTypes;
            readonly " $fragmentRefs": FragmentRefs<"FeaturedCollectionsRail_collectionGroup">;
        }>;
        readonly " $fragmentRefs": FragmentRefs<"FeaturedCollectionsRail_collection">;
    } | null;
};
export type FeaturedCollectionsTestsQueryRawResponse = {
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
                readonly descriptionMarkdown: string | null;
                readonly featuredCollectionArtworks: ({
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
            }>;
        }>;
    }) | null;
};
export type FeaturedCollectionsTestsQuery = {
    readonly response: FeaturedCollectionsTestsQueryResponse;
    readonly variables: FeaturedCollectionsTestsQueryVariables;
    readonly rawResponse: FeaturedCollectionsTestsQueryRawResponse;
};



/*
query FeaturedCollectionsTestsQuery {
  marketingCollection(slug: "post-war") {
    ...FeaturedCollectionsRail_collection
    linkedCollections {
      groupType
      ...FeaturedCollectionsRail_collectionGroup
    }
    id
  }
}

fragment FeaturedCollectionsRail_collection on MarketingCollection {
  slug
  id
}

fragment FeaturedCollectionsRail_collectionGroup on MarketingCollectionGroup {
  name
  members {
    slug
    id
    title
    priceGuidance
    descriptionMarkdown
    featuredCollectionArtworks: artworksConnection(first: 1, aggregations: [TOTAL], sort: "-decayed_merch") {
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
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slug",
    "value": "post-war"
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
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
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
    "name": "FeaturedCollectionsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"post-war\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
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
                "name": "FeaturedCollectionsRail_collectionGroup",
                "args": null
              }
            ]
          },
          {
            "kind": "FragmentSpread",
            "name": "FeaturedCollectionsRail_collection",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FeaturedCollectionsTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"post-war\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
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
                    "name": "priceGuidance",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "descriptionMarkdown",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "featuredCollectionArtworks",
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:1,sort:\"-decayed_merch\")",
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
                        "value": 1
                      },
                      {
                        "kind": "Literal",
                        "name": "sort",
                        "value": "-decayed_merch"
                      }
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
                                    "name": "url",
                                    "args": null,
                                    "storageKey": null
                                  }
                                ]
                              },
                              (v3/*: any*/)
                            ]
                          }
                        ]
                      },
                      (v3/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FeaturedCollectionsTestsQuery",
    "id": "1f50199add6d63b45fcff3ad360cbea1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '588347db31cdb29126c0f4e2c4612cfa';
export default node;
