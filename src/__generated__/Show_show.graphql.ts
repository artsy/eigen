/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly viewingRoomIDs: ReadonlyArray<string>;
    readonly images: ReadonlyArray<{
        readonly __typename: string;
    } | null> | null;
    readonly counts: {
        readonly eligibleArtworks: number | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ShowHeader_show" | "ShowInstallShots_show" | "ShowInfo_show" | "ShowViewingRoom_show" | "ShowContextCard_show" | "ShowArtworks_show" | "ShowArtworksEmptyState_show">;
    readonly " $refType": "Show_show";
};
export type Show_show$data = Show_show;
export type Show_show$key = {
    readonly " $data"?: Show_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "input"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show_show",
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
      "name": "ShowHeader_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowInstallShots_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowInfo_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowViewingRoom_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowContextCard_show"
    },
    {
      "args": [
        {
          "kind": "Variable",
          "name": "input",
          "variableName": "input"
        }
      ],
      "kind": "FragmentSpread",
      "name": "ShowArtworks_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowArtworksEmptyState_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '93c46afb77d259263205cc3c864936f7';
export default node;
