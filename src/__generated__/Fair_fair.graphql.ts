/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { FairArtworks_fair$ref } from "./FairArtworks_fair.graphql";
import { FairDetail_fair$ref } from "./FairDetail_fair.graphql";
declare const _Fair_fair$ref: unique symbol;
export type Fair_fair$ref = typeof _Fair_fair$ref;
export type Fair_fair = {
    readonly " $fragmentRefs": FairDetail_fair$ref & FairArtworks_fair$ref;
    readonly " $refType": Fair_fair$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Fair_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "FairDetail_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FairArtworks_fair",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '1956ea1445a23e4d340f23238dc4a089';
export default node;
