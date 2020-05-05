/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkRail_rail = {
    readonly title: string | null;
    readonly key: string | null;
    readonly results: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"SmallTileRail_artworks" | "GenericGrid_artworks">;
    } | null> | null;
    readonly context: {
        readonly __typename: "HomePageRelatedArtistArtworkModule";
        readonly artist?: {
            readonly slug: string;
            readonly internalID: string;
            readonly href: string | null;
        } | null;
        readonly basedOn?: {
            readonly name: string | null;
        } | null;
        readonly href?: string | null;
    } | null;
    readonly " $refType": "ArtworkRail_rail";
};
export type ArtworkRail_rail$data = ArtworkRail_rail;
export type ArtworkRail_rail$key = {
    readonly " $data"?: ArtworkRail_rail$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "ArtworkRail_rail",
  "type": "HomePageArtworkModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "key",
      "args": null,
      "storageKey": null
    },
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
          "name": "SmallTileRail_artworks",
          "args": null
        },
        {
          "kind": "FragmentSpread",
          "name": "GenericGrid_artworks",
          "args": null
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
          "type": "HomePageRelatedArtistArtworkModule",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "__typename",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "artist",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "internalID",
                  "args": null,
                  "storageKey": null
                },
                (v0/*: any*/)
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "basedOn",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "HomePageFollowedArtistArtworkModule",
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "artist",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": (v1/*: any*/)
            }
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "Fair",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "Gene",
          "selections": (v1/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "Sale",
          "selections": (v1/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = '2e78962b49bafcfb33e1b3a654166d6f';
export default node;
