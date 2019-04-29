/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _Registration_me$ref: unique symbol;
export type Registration_me$ref = typeof _Registration_me$ref;
export type Registration_me = {
    readonly has_credit_cards: boolean | null;
    readonly " $refType": Registration_me$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Registration_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "has_credit_cards",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'b3bea4b4a77d36d250a717c700bcff51';
export default node;
