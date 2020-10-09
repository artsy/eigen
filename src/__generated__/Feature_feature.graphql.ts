/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Feature_feature",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "callout",
      "storageKey": null
    },
    {
      "alias": "sets",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "OrderedSetConnection",
      "kind": "LinkedField",
      "name": "setsConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "OrderedSetEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "OrderedSet",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "name",
                  "storageKey": null
                },
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "itemType",
                  "storageKey": null
                },
                {
                  "alias": "orderedItems",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "first",
                      "value": 35
                    }
                  ],
                  "concreteType": "OrderedSetItemConnection",
                  "kind": "LinkedField",
                  "name": "orderedItemsConnection",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "OrderedSetItemEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": null,
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "__typename",
                              "storageKey": null
                            },
                            {
                              "kind": "InlineFragment",
                              "selections": [
                                (v1/*: any*/),
                                {
                                  "alias": null,
                                  "args": null,
                                  "kind": "ScalarField",
                                  "name": "href",
                                  "storageKey": null
                                }
                              ],
                              "type": "FeaturedLink",
                              "abstractKey": null
                            },
                            {
                              "kind": "InlineFragment",
                              "selections": [
                                {
                                  "args": null,
                                  "kind": "FragmentSpread",
                                  "name": "GenericGrid_artworks"
                                }
                              ],
                              "type": "Artwork",
                              "abstractKey": null
                            },
                            {
                              "args": null,
                              "kind": "FragmentSpread",
                              "name": "FeatureFeaturedLink_featuredLink"
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": "orderedItemsConnection(first:35)"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "setsConnection(first:20)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeatureHeader_feature"
    }
  ],
  "type": "Feature",
  "abstractKey": null
};
})();
(node as any).hash = 'b9c1b7b6e209626ac043f40d8886aeb8';
export default node;
