/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ShowEventSection_event$ref: unique symbol;
export type ShowEventSection_event$ref = typeof _ShowEventSection_event$ref;
export type ShowEventSection_event = {
    readonly event_type: string | null;
    readonly description: string | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly " $refType": ShowEventSection_event$ref;
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
(node as any).hash = '6539ecec157d06c85f44813b23d33ddc';
export default node;
