/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FilteredInfiniteScrollGrid_entity$ref } from "./FilteredInfiniteScrollGrid_entity.graphql";
declare const _ShowArtworks_show$ref: unique symbol;
export type ShowArtworks_show$ref = typeof _ShowArtworks_show$ref;
export type ShowArtworks_show = {
    readonly id: string;
    readonly slug: string;
    readonly internalID: string;
    readonly " $fragmentRefs": FilteredInfiniteScrollGrid_entity$ref;
    readonly " $refType": ShowArtworks_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ShowArtworks_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
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
    {
      "kind": "FragmentSpread",
      "name": "FilteredInfiniteScrollGrid_entity",
      "args": null
    }
  ]
};
(node as any).hash = 'd18ae5be25656a4cea38614cf43825e9';
export default node;
