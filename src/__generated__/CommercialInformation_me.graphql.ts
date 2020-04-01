/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommercialInformation_me = {
    readonly " $fragmentRefs": FragmentRefs<"CommercialButtons_me">;
    readonly " $refType": "CommercialInformation_me";
};
export type CommercialInformation_me$data = CommercialInformation_me;
export type CommercialInformation_me$key = {
    readonly " $data"?: CommercialInformation_me$data;
    readonly " $fragmentRefs": FragmentRefs<"CommercialInformation_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialInformation_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "CommercialButtons_me",
      "args": null
    }
  ]
};
(node as any).hash = '6ad39fbc2e21290347d9a597e5759b88';
export default node;
