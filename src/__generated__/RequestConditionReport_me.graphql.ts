/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type RequestConditionReport_me = {
    readonly email: string | null;
    readonly internalID: string;
    readonly " $refType": "RequestConditionReport_me";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "RequestConditionReport_me",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '258c05430e9b3e8a98d4422132c12e82';
export default node;
