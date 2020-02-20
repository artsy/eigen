/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ShowEventSection_event = {
    readonly event_type: string | null;
    readonly description: string | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly " $refType": "ShowEventSection_event";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ShowEventSection_event",
  "type": "ShowEventType",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": "event_type",
      "name": "eventType",
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
      "alias": "start_at",
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "end_at",
      "name": "endAt",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '0b3e65592f0bb739551d5dfb9c3ebf55';
export default node;
