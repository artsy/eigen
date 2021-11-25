/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionResult_artist = {
    readonly name: string | null;
    readonly href: string | null;
    readonly " $refType": "AuctionResult_artist";
};
export type AuctionResult_artist$data = AuctionResult_artist;
export type AuctionResult_artist$key = {
    readonly " $data"?: AuctionResult_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"AuctionResult_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AuctionResult_artist",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = 'f2a07c4ce7b44bdd92014699d24fe46f';
export default node;
