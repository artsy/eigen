/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkRail_rail = {
    readonly id: string;
    readonly key: string | null;
    readonly params: {
        readonly medium: string | null;
        readonly price_range: string | null;
    } | null;
    readonly context: {
        readonly artist?: {
            readonly href: string | null;
        } | null;
        readonly href?: string | null;
    } | null;
    readonly results?: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"GenericGrid_artworks">;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkRailHeader_rail">;
    readonly " $refType": "ArtworkRail_rail";
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "href",
    "args": null,
    "storageKey": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "artist",
    "storageKey": null,
    "args": null,
    "concreteType": "Artist",
    "plural": false,
    "selections": (v0/*: any*/)
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
          "alias": "price_range",
          "name": "priceRange",
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
        {
          "kind": "InlineFragment",
          "type": "HomePageFollowedArtistArtworkModule",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageRelatedArtistArtworkModule",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "Fair",
          "selections": (v0/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "Gene",
          "selections": (v0/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "Sale",
          "selections": (v0/*: any*/)
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkRailHeader_rail",
      "args": null
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
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'c96da4feffc2958d57212bf6664e973f';
export default node;
