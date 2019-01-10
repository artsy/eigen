/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _EventSection_event$ref: unique symbol;
export type EventSection_event$ref = typeof _EventSection_event$ref;
export type EventSection_event = {
    readonly event_type: string | null;
    readonly description: string | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly " $refType": EventSection_event$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "EventSection_event",
  "type": "PartnerShowEventType",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "event_type",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "start_at",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "end_at",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'bf16a4007c0c680ff3cbfdba7f621e81';
export default node;
