/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConfirmContactInfo_me = {
    readonly phone: string | null;
    readonly " $refType": "ConfirmContactInfo_me";
};
export type ConfirmContactInfo_me$data = ConfirmContactInfo_me;
export type ConfirmContactInfo_me$key = {
    readonly " $data"?: ConfirmContactInfo_me$data;
    readonly " $fragmentRefs": FragmentRefs<"ConfirmContactInfo_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ConfirmContactInfo_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phone",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'd6c5b96e9aa17401b9390b2c4d13fbdc';
export default node;
