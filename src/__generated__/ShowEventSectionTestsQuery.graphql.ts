/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ShowEventSection_event$ref } from "./ShowEventSection_event.graphql";
export type ShowEventSectionTestsQueryVariables = {};
export type ShowEventSectionTestsQueryResponse = {
    readonly show: ({
        readonly events: ReadonlyArray<({
            readonly " $fragmentRefs": ShowEventSection_event$ref;
        }) | null> | null;
    }) | null;
};
export type ShowEventSectionTestsQuery = {
    readonly response: ShowEventSectionTestsQueryResponse;
    readonly variables: ShowEventSectionTestsQueryVariables;
};



/*
query ShowEventSectionTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    events {
      ...ShowEventSection_event
    }
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
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ShowEventSectionTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
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
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowEventSectionTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
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
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ShowEventSectionTestsQuery",
    "id": "491aa923b8d9aaf54ec5b6b9277b9a5e",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '491aa923b8d9aaf54ec5b6b9277b9a5e';
export default node;
