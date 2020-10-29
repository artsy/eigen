/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleInfo_me = {
    readonly " $fragmentRefs": FragmentRefs<"RegisterToBidButton_me">;
    readonly " $refType": "SaleInfo_me";
};
export type SaleInfo_me$data = SaleInfo_me;
export type SaleInfo_me$key = {
    readonly " $data"?: SaleInfo_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleInfo_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "saleID"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleInfo_me",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "saleID",
          "variableName": "saleID"
        }
      ],
      "kind": "FragmentSpread",
      "name": "RegisterToBidButton_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'a692fe458bad273e688deb39a90a3e46';
export default node;
