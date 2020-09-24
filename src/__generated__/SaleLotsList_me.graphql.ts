/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList_me = {
    readonly " $fragmentRefs": FragmentRefs<"LotsByFollowedArtists_me" | "SaleArtworkList_me">;
    readonly " $refType": "SaleLotsList_me";
};
export type SaleLotsList_me$data = SaleLotsList_me;
export type SaleLotsList_me$key = {
    readonly " $data"?: SaleLotsList_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleLotsList_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "LotsByFollowedArtists_me",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "SaleArtworkList_me",
      "args": null
    }
  ]
};
(node as any).hash = 'ce03f067fe0e8116674b2d83a2905052';
export default node;
