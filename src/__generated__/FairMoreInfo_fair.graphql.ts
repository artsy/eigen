/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _FairMoreInfo_fair$ref: unique symbol;
export type FairMoreInfo_fair$ref = typeof _FairMoreInfo_fair$ref;
export type FairMoreInfo_fair = {
    readonly links: string | null;
    readonly about: string | null;
    readonly ticketsLink: string | null;
    readonly " $refType": FairMoreInfo_fair$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "FairMoreInfo_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "links",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "about",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "ticketsLink",
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
(node as any).hash = '2f059a192d98cdcbee4798ae5c44cfa6';
export default node;
