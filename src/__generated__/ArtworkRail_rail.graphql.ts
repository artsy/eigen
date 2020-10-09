/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkRail_rail",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "key",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artwork",
      "kind": "LinkedField",
      "name": "results",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SmallTileRail_artworks"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "GenericGrid_artworks"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "context",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__typename",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Artist",
              "kind": "LinkedField",
              "name": "artist",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "slug",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "internalID",
                  "storageKey": null
                },
                (v0/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Artist",
              "kind": "LinkedField",
              "name": "basedOn",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "name",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "type": "HomePageRelatedArtistArtworkModule",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Artist",
              "kind": "LinkedField",
              "name": "artist",
              "plural": false,
              "selections": (v1/*: any*/),
              "storageKey": null
            }
          ],
          "type": "HomePageFollowedArtistArtworkModule",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v1/*: any*/),
          "type": "Fair",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v1/*: any*/),
          "type": "Gene",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v1/*: any*/),
          "type": "Sale",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HomePageArtworkModule",
  "abstractKey": null
};
})();
(node as any).hash = '2e78962b49bafcfb33e1b3a654166d6f';
export default node;
