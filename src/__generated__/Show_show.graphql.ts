/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { AllArtists_show$ref } from "./AllArtists_show.graphql";
import { Detail_show$ref } from "./Detail_show.graphql";
import { MoreInfo_show$ref } from "./MoreInfo_show.graphql";
import { ShowArtworks_show$ref } from "./ShowArtworks_show.graphql";
declare const _Show_show$ref: unique symbol;
export type Show_show$ref = typeof _Show_show$ref;
export type Show_show = {
    readonly " $fragmentRefs": Detail_show$ref & MoreInfo_show$ref & AllArtists_show$ref & ShowArtworks_show$ref;
    readonly " $refType": Show_show$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Show_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Detail_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "MoreInfo_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "AllArtists_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtworks_show",
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
(node as any).hash = 'ac21907c476a9b08e0b82aeae1845ebf';
export default node;
