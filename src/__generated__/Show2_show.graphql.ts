/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly images: ReadonlyArray<{
        readonly __typename: string;
    } | null> | null;
    readonly counts: {
        readonly eligibleArtworks: number | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Show2Header_show" | "Show2InstallShots_show" | "Show2Info_show" | "Show2ContextCard_show" | "Show2Artworks_show">;
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
      "storageKey": null
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
      "name": "Show2ContextCard_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Artworks_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '8cea372cdc56bfbc50f8f87b26dd5552';
export default node;
