/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Detail_show$ref } from "./Detail_show.graphql";
import { MoreInfo_show$ref } from "./MoreInfo_show.graphql";
import { ShowArtists_show$ref } from "./ShowArtists_show.graphql";
import { ShowArtworks_show$ref } from "./ShowArtworks_show.graphql";
declare const _Show_show$ref: unique symbol;
export type Show_show$ref = typeof _Show_show$ref;
export type Show_show = {
    readonly " $fragmentRefs": Detail_show$ref & MoreInfo_show$ref & ShowArtists_show$ref & ShowArtworks_show$ref;
    readonly " $refType": Show_show$ref;
};



const node: ReaderFragment = {
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
      "name": "ShowArtists_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtworks_show",
      "args": null
    }
  ]
};
(node as any).hash = 'b1c8b81457565759412e680750cbbcdb';
export default node;
