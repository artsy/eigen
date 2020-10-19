/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CommercialInformation_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CommercialButtons_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '6ad39fbc2e21290347d9a597e5759b88';
export default node;
