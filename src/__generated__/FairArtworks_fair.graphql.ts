/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairArtworks_fair = {
    readonly id: string;
    readonly internalID: string;
    readonly slug: string;
    readonly " $fragmentRefs": FragmentRefs<"FilteredInfiniteScrollGrid_entity">;
    readonly " $refType": "FairArtworks_fair";
};
export type FairArtworks_fair$data = FairArtworks_fair;
export type FairArtworks_fair$key = {
    readonly " $data"?: FairArtworks_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairArtworks_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": "*",
      "kind": "LocalArgument",
      "name": "medium"
    },
    {
      "defaultValue": "*-*",
      "kind": "LocalArgument",
      "name": "priceRange"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "FairArtworks_fair",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "FilteredInfiniteScrollGrid_entity"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '71c589ff3f298e3fa56d4c9df7a59a5c';
export default node;
