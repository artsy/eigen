/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtworkRailHeader_rail$ref } from "./ArtworkRailHeader_rail.graphql";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _ArtworkRail_rail$ref: unique symbol;
export type ArtworkRail_rail$ref = typeof _ArtworkRail_rail$ref;
export type ArtworkRail_rail = {
    readonly id: string;
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
        readonly " $fragmentRefs": GenericGrid_artworks$ref;
    }) | null> | null;
    readonly " $fragmentRefs": ArtworkRailHeader_rail$ref;
    readonly " $refType": ArtworkRail_rail$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
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
    ]
  }
];
return {
  "kind": "Fragment",
  "name": "ArtworkRail_rail",
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
      "name": "ArtworkRailHeader_rail",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
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
        }
      ]
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
      ]
    },
    v0,
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
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '2d9a4662d25a7542dbe48112b76f7d19';
export default node;
