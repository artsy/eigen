/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Feature_feature = {
    readonly description: string | null;
    readonly callout: string | null;
    readonly sets: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly name: string | null;
                readonly description: string | null;
                readonly itemType: string | null;
                readonly orderedItems: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly __typename: string;
                            readonly id?: string;
                            readonly href?: string | null;
                            readonly " $fragmentRefs": FragmentRefs<"FeatureFeaturedLink_featuredLink" | "GenericGrid_artworks">;
                        } | null;
                    } | null> | null;
                };
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"FeatureHeader_feature">;
    readonly " $refType": "Feature_feature";
};
export type Feature_feature$data = Feature_feature;
export type Feature_feature$key = {
    readonly " $data"?: Feature_feature$data;
    readonly " $fragmentRefs": FragmentRefs<"Feature_feature">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "description",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Feature_feature",
  "type": "Feature",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "callout",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "sets",
      "name": "setsConnection",
      "storageKey": "setsConnection(first:20)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "OrderedSetConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "OrderedSetEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "OrderedSet",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                },
                (v0/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "itemType",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": "orderedItems",
                  "name": "orderedItemsConnection",
                  "storageKey": "orderedItemsConnection(first:35)",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "first",
                      "value": 35
                    }
                  ],
                  "concreteType": "OrderedSetItemConnection",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "edges",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "OrderedSetItemEdge",
                      "plural": true,
                      "selections": [
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "node",
                          "storageKey": null,
                          "args": null,
                          "concreteType": null,
                          "plural": false,
                          "selections": [
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "name": "__typename",
                              "args": null,
                              "storageKey": null
                            },
                            {
                              "kind": "InlineFragment",
                              "type": "FeaturedLink",
                              "selections": [
                                (v1/*: any*/),
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "name": "href",
                                  "args": null,
                                  "storageKey": null
                                }
                              ]
                            },
                            {
                              "kind": "InlineFragment",
                              "type": "Artwork",
                              "selections": [
                                {
                                  "kind": "FragmentSpread",
                                  "name": "GenericGrid_artworks",
                                  "args": null
                                }
                              ]
                            },
                            {
                              "kind": "FragmentSpread",
                              "name": "FeatureFeaturedLink_featuredLink",
                              "args": null
                            }
                          ]
                        }
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
    {
      "kind": "FragmentSpread",
      "name": "FeatureHeader_feature",
      "args": null
    }
  ]
};
})();
(node as any).hash = 'b9c1b7b6e209626ac043f40d8886aeb8';
export default node;
