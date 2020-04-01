/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommercialButtons_me = {
    readonly " $fragmentRefs": FragmentRefs<"BidButton_me">;
    readonly " $refType": "CommercialButtons_me";
};
export type CommercialButtons_me$data = CommercialButtons_me;
export type CommercialButtons_me$key = {
    readonly " $data"?: CommercialButtons_me$data;
    readonly " $fragmentRefs": FragmentRefs<"CommercialButtons_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialButtons_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "BidButton_me",
      "args": null
    }
  ]
};
(node as any).hash = '6774dff4c22324842f91845c3a03587f';
export default node;
