/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { EventSection_event$ref } from "./EventSection_event.graphql";
declare const _MoreInfo_show$ref: unique symbol;
export type MoreInfo_show$ref = typeof _MoreInfo_show$ref;
export type MoreInfo_show = {
    readonly press_release: string | null;
    readonly events: ReadonlyArray<({
        readonly " $fragmentRefs": EventSection_event$ref;
    }) | null> | null;
    readonly " $refType": MoreInfo_show$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "MoreInfo_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "press_release",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "events",
      "storageKey": null,
      "args": null,
      "concreteType": "PartnerShowEventType",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "EventSection_event",
          "args": null
        }
      ]
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
(node as any).hash = 'a6edcb4b35cd47a5f59a698503bfc393';
export default node;
