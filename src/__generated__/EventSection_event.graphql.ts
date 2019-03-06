/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _EventSection_event$ref: unique symbol;
export type EventSection_event$ref = typeof _EventSection_event$ref;
export type EventSection_event = {
    readonly event_type: string | null;
    readonly description: string | null;
    readonly exhibitionPeriod: string | null;
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
      "name": "exhibitionPeriod",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'a20a159a1f84fbbabdce3370d196fc42';
export default node;
