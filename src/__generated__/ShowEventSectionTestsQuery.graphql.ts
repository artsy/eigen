/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2e4ea89cbe5286eb16a06f7f471945d8 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowEventSectionTestsQueryVariables = {};
export type ShowEventSectionTestsQueryResponse = {
    readonly show: {
        readonly events: ReadonlyArray<{
            readonly " $fragmentRefs": FragmentRefs<"ShowEventSection_event">;
        } | null> | null;
    } | null;
};
export type ShowEventSectionTestsQueryRawResponse = {
    readonly show: ({
        readonly events: ReadonlyArray<({
            readonly event_type: string | null;
            readonly description: string | null;
            readonly start_at: string | null;
            readonly end_at: string | null;
        }) | null> | null;
        readonly id: string;
    }) | null;
};
export type ShowEventSectionTestsQuery = {
    readonly response: ShowEventSectionTestsQueryResponse;
    readonly variables: ShowEventSectionTestsQueryVariables;
    readonly rawResponse: ShowEventSectionTestsQueryRawResponse;
};



/*
query ShowEventSectionTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    events {
      ...ShowEventSection_event
    }
    id
  }
}

fragment ShowEventSection_event on ShowEventType {
  event_type: eventType
  description
  start_at: startAt
  end_at: endAt
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowEventSectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ShowEventType",
            "kind": "LinkedField",
            "name": "events",
            "plural": true,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ShowEventSection_event"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ShowEventSectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ShowEventType",
            "kind": "LinkedField",
            "name": "events",
            "plural": true,
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
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
      }
    ]
  },
  "params": {
    "id": "2e4ea89cbe5286eb16a06f7f471945d8",
    "metadata": {},
    "name": "ShowEventSectionTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '3fe8531ee27eff7dc3b37c9f2e686dad';
export default node;
