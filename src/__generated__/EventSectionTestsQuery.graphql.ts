/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { EventSection_event$ref } from "./EventSection_event.graphql";
export type EventSectionTestsQueryVariables = {};
export type EventSectionTestsQueryResponse = {
    readonly show: ({
        readonly events: ReadonlyArray<({
            readonly " $fragmentRefs": EventSection_event$ref;
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
      ...EventSection_event
    }
    __id
  }
}

fragment EventSection_event on PartnerShowEventType {
  event_type
  description
  exhibitionPeriod
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
  "id": "7737968272431d965fbeb56a6095b7c9",
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
                "name": "EventSection_event",
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
                "name": "exhibitionPeriod",
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
(node as any).hash = '2ecb8e3dba5e94545b9ac457a7eb30c9';
export default node;
