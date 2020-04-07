/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sales_me = {
    readonly email: string | null;
    readonly " $fragmentRefs": FragmentRefs<"LotsByFollowedArtists_me">;
    readonly " $refType": "Sales_me";
};
export type Sales_me$data = Sales_me;
export type Sales_me$key = {
    readonly " $data"?: Sales_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Sales_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Sales_me",
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
(node as any).hash = 'f375762d5b4a257366fe453dcc629646';
export default node;
