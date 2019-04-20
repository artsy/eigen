/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistShow_show$ref } from "./ArtistShow_show.graphql";
declare const _VariableSizeShowsList_shows$ref: unique symbol;
export type VariableSizeShowsList_shows$ref = typeof _VariableSizeShowsList_shows$ref;
export type VariableSizeShowsList_shows = ReadonlyArray<{
    readonly __id: string;
    readonly " $fragmentRefs": ArtistShow_show$ref;
    readonly " $refType": VariableSizeShowsList_shows$ref;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "VariableSizeShowsList_shows",
  "type": "PartnerShow",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistShow_show",
      "args": null
    }
  ]
};
(node as any).hash = '8249f8d45143d035782a84b2d6d1039d';
export default node;
