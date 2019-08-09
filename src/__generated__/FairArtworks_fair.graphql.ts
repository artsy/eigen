/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FilteredInfiniteScrollGrid_entity$ref } from "./FilteredInfiniteScrollGrid_entity.graphql";
declare const _FairArtworks_fair$ref: unique symbol;
export type FairArtworks_fair$ref = typeof _FairArtworks_fair$ref;
export type FairArtworks_fair = {
    readonly id: string;
    readonly internalID: string;
    readonly slug: string;
    readonly " $fragmentRefs": FilteredInfiniteScrollGrid_entity$ref;
    readonly " $refType": FairArtworks_fair$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FairArtworks_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "medium",
      "type": "String",
      "defaultValue": "*"
    },
    {
      "kind": "LocalArgument",
      "name": "priceRange",
      "type": "String",
      "defaultValue": "*-*"
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
      "name": "internalID",
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
      "kind": "FragmentSpread",
      "name": "FilteredInfiniteScrollGrid_entity",
      "args": null
    }
  ]
};
(node as any).hash = '71c589ff3f298e3fa56d4c9df7a59a5c';
export default node;
