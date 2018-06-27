/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Registration_me = {
    readonly has_credit_cards: boolean | null;
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
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'b3bea4b4a77d36d250a717c700bcff51';
export default node;
