/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ArtworkCarousel_rail = {
    readonly __id: string;
    readonly key: string | null;
    readonly params: ({
        readonly medium: string | null;
        readonly price_range: string | null;
    }) | null;
    readonly context: ({
        readonly artist?: ({
            readonly href: string | null;
        }) | null;
        readonly href?: string | null;
    }) | null;
    readonly results?: ReadonlyArray<({
        }) | null> | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v2 = [
  v1
],
v3 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "artist",
    "storageKey": null,
    "args": null,
    "concreteType": "Artist",
    "plural": false,
    "selections": [
      v1,
      v0
    ],
    "idField": "__id"
  }
];
return {
  "kind": "Fragment",
  "name": "ArtworkCarousel_rail",
  "type": "HomePageArtworkModule",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "fetchContent",
      "type": "Boolean!",
      "defaultValue": false
    }
  ],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ArtworkCarouselHeader_rail",
      "args": null
    },
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "key",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "params",
      "storageKey": null,
      "args": null,
      "concreteType": "HomePageModulesParams",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "medium",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "price_range",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        }
      ],
      "idField": "id"
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        v0,
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextSale",
          "selections": v2
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextGene",
          "selections": v2
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextFair",
          "selections": v2
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextRelatedArtist",
          "selections": v3
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageModuleContextFollowedArtist",
          "selections": v3
        }
      ],
      "idField": "__id"
    },
    {
      "kind": "Condition",
      "passingValue": true,
      "condition": "fetchContent",
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "results",
          "storageKey": null,
          "args": null,
          "concreteType": "Artwork",
          "plural": true,
          "selections": [
            {
              "kind": "FragmentSpread",
              "name": "GenericGrid_artworks",
              "args": null
            },
            v0
          ],
          "idField": "__id"
        }
      ]
    }
  ],
  "idField": "__id"
};
})();
(node as any).hash = '40c7c47c0d5c7633cf5205f9bf043c9b';
export default node;
