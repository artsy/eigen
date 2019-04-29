/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtistShow_show$ref } from "./ArtistShow_show.graphql";
declare const _SmallList_shows$ref: unique symbol;
export type SmallList_shows$ref = typeof _SmallList_shows$ref;
export type SmallList_shows = ReadonlyArray<{
    readonly " $fragmentRefs": ArtistShow_show$ref;
    readonly " $refType": SmallList_shows$ref;
}>;



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SmallList_shows",
  "type": "PartnerShow",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ArtistShow_show",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '7b60b30ef5f0eccc1bae5f2c93c817dc';
export default node;
