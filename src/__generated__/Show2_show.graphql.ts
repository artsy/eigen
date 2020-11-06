/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly viewingRoomIDs: ReadonlyArray<string>;
    readonly images: ReadonlyArray<{
        readonly __typename: string;
    } | null> | null;
    readonly counts: {
        readonly eligibleArtworks: number | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Show2Header_show" | "Show2InstallShots_show" | "Show2Info_show" | "Show2ViewingRoom_show" | "Show2ContextCard_show" | "Show2Artworks_show" | "Show2ArtworksEmptyState_show">;
    readonly " $refType": "Show2_show";
};
export type Show2_show$data = Show2_show;
export type Show2_show$key = {
    readonly " $data"?: Show2_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
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
      "name": "viewingRoomIDs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "default",
          "value": false
        }
      ],
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        }
      ],
      "storageKey": "images(default:false)"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ShowCounts",
      "kind": "LinkedField",
      "name": "counts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "eligibleArtworks",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Header_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2InstallShots_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Info_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2ViewingRoom_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2ContextCard_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Artworks_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2ArtworksEmptyState_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '61dcfb33719aabba11fa1ffec11ce03a';
export default node;
