/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowEventSection_event = {
    readonly event_type: string | null;
    readonly description: string | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly " $refType": "ShowEventSection_event";
};
export type ShowEventSection_event$data = ShowEventSection_event;
export type ShowEventSection_event$key = {
    readonly " $data"?: ShowEventSection_event$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowEventSection_event">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowEventSection_event",
  "selections": [
    {
      "alias": "event_type",
      "args": null,
      "kind": "ScalarField",
      "name": "eventType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": "start_at",
      "args": null,
      "kind": "ScalarField",
      "name": "startAt",
      "storageKey": null
    },
    {
      "alias": "end_at",
      "args": null,
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    }
  ],
  "type": "ShowEventType",
  "abstractKey": null
};
(node as any).hash = '0b3e65592f0bb739551d5dfb9c3ebf55';
export default node;
