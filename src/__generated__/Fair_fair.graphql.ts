/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { FairArtists_fair$ref } from "./FairArtists_fair.graphql";
import { FairArtworks_fair$ref } from "./FairArtworks_fair.graphql";
import { FairDetail_fair$ref } from "./FairDetail_fair.graphql";
declare const _Fair_fair$ref: unique symbol;
export type Fair_fair$ref = typeof _Fair_fair$ref;
export type Fair_fair = {
    readonly id: string;
    readonly " $fragmentRefs": FairDetail_fair$ref & FairArtists_fair$ref & FairArtworks_fair$ref;
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
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FairDetail_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FairArtists_fair",
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
(node as any).hash = 'e06e40c337531bb701b5756de0275a87';
export default node;
