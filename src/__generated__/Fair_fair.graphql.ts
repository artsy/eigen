/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { FairArtists_fair$ref } from "./FairArtists_fair.graphql";
import { FairArtworks_fair$ref } from "./FairArtworks_fair.graphql";
import { FairDetail_fair$ref } from "./FairDetail_fair.graphql";
import { FairExhibitors_fair$ref } from "./FairExhibitors_fair.graphql";
declare const _Fair_fair$ref: unique symbol;
export type Fair_fair$ref = typeof _Fair_fair$ref;
export type Fair_fair = {
    readonly " $fragmentRefs": FairDetail_fair$ref & FairExhibitors_fair$ref & FairArtists_fair$ref & FairArtworks_fair$ref;
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
      "name": "FairExhibitors_fair",
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
(node as any).hash = 'abf5bb29b520e6c30029961a137edb1a';
export default node;
