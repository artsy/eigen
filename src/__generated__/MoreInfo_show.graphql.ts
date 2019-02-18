/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { EventSection_event$ref } from "./EventSection_event.graphql";
declare const _MoreInfo_show$ref: unique symbol;
export type MoreInfo_show$ref = typeof _MoreInfo_show$ref;
export type MoreInfo_show = {
    readonly __id: string;
    readonly id: string;
    readonly partner: ({
        readonly website?: string | null;
        readonly type?: string | null;
    }) | null;
    readonly press_release: string | null;
    readonly events: ReadonlyArray<({
        readonly " $fragmentRefs": EventSection_event$ref;
    }) | null> | null;
    readonly " $refType": MoreInfo_show$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "MoreInfo_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        v0,
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "website",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "type",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
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
    }
  ]
};
})();
(node as any).hash = '9b64ca0ceb2cf53712854d39e9b0e75c';
export default node;
