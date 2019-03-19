/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ShowEventSection_event$ref } from "./ShowEventSection_event.graphql";
export type EventSectionTestsQueryVariables = {};
export type EventSectionTestsQueryResponse = {
    readonly show: ({
        readonly events: ReadonlyArray<({
            readonly " $fragmentRefs": ShowEventSection_event$ref;
        }) | null> | null;
    }) | null;
};
export type EventSectionTestsQuery = {
    readonly response: EventSectionTestsQueryResponse;
    readonly variables: EventSectionTestsQueryVariables;
};



/*
query EventSectionTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    events {
      ...ShowEventSection_event
    }
    __id
  }
}

fragment ShowEventSection_event on PartnerShowEventType {
  event_type
  description
  start_at
  end_at
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "EventSectionTestsQuery",
  "id": "8350ed20d922e0a716a54dc8c81e5109",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "EventSectionTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
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
                "name": "ShowEventSection_event",
                "args": null
              }
            ]
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "EventSectionTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
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
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = '8f9be413eb817a88adf53011749a1b5a';
export default node;
