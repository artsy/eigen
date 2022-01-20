/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkModuleRail_rail = {
    readonly title: string | null;
    readonly key: string | null;
    readonly results: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"SmallArtworkRail_artworks">;
    } | null> | null;
    readonly context: {
        readonly __typename: "HomePageRelatedArtistArtworkModule";
        readonly artist?: {
            readonly slug: string;
            readonly internalID: string;
            readonly href: string | null;
        } | null | undefined;
        readonly basedOn?: {
            readonly name: string | null;
        } | null | undefined;
        readonly href?: string | null | undefined;
    } | null;
    readonly " $refType": "ArtworkModuleRail_rail";
};
export type ArtworkModuleRail_rail$data = ArtworkModuleRail_rail;
export type ArtworkModuleRail_rail$key = {
    readonly " $data"?: ArtworkModuleRail_rail$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkModuleRail_rail">;
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
  "name": "ArtworkModuleRail_rail",
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
          "name": "SmallArtworkRail_artworks"
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
(node as any).hash = 'ee899bb4a79feb4ebc16bcda76ed4e0b';
export default node;
