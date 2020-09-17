/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList_me = {
    readonly email: string | null;
    readonly " $fragmentRefs": FragmentRefs<"LotsByFollowedArtists_me">;
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
      "kind": "ScalarField",
      "alias": null,
      "name": "email",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "LotsByFollowedArtists_me",
      "args": null
    }
  ]
};
(node as any).hash = '829254e8e2cbd6fa73f45494ec021315';
export default node;
