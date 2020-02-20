/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MoreInfoTestsQueryVariables = {};
export type MoreInfoTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"MoreInfo_show">;
    } | null;
};
export type MoreInfoTestsQueryRawResponse = {
    readonly show: ({
        readonly internalID: string;
        readonly slug: string;
        readonly pressReleaseUrl: string | null;
        readonly openingReceptionText: string | null;
        readonly partner: ({
            readonly __typename: "Partner";
            readonly id: string | null;
            readonly website: string | null;
            readonly type: string | null;
        } | {
            readonly __typename: string | null;
            readonly id: string | null;
        }) | null;
        readonly press_release: string | null;
        readonly events: ReadonlyArray<({
            readonly event_type: string | null;
            readonly description: string | null;
            readonly start_at: string | null;
            readonly end_at: string | null;
        }) | null> | null;
        readonly id: string | null;
    }) | null;
};
export type MoreInfoTestsQuery = {
    readonly response: MoreInfoTestsQueryResponse;
    readonly variables: MoreInfoTestsQueryVariables;
    readonly rawResponse: MoreInfoTestsQueryRawResponse;
};



/*
query MoreInfoTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...MoreInfo_show
    id
  }
}

fragment MoreInfo_show on Show {
  internalID
  slug
  pressReleaseUrl
  openingReceptionText
  partner {
    __typename
    ... on Partner {
      website
      type
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  press_release: pressRelease
  events {
    ...ShowEventSection_event
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
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MoreInfoTestsQuery",
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
            "kind": "FragmentSpread",
            "name": "MoreInfo_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MoreInfoTestsQuery",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "pressReleaseUrl",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "openingReceptionText",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/),
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
            "alias": "press_release",
            "name": "pressRelease",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "events",
            "storageKey": null,
            "args": null,
            "concreteType": "ShowEventType",
            "plural": true,
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
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MoreInfoTestsQuery",
    "id": "8335a74249c2d3565dc22caa88ba4acd",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '95d9f9f6a8db4f48d036bacb751a5d77';
export default node;
