/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { MoreInfo_show$ref } from "./MoreInfo_show.graphql";
export type MoreInfoTestsQueryVariables = {};
export type MoreInfoTestsQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": MoreInfo_show$ref;
    }) | null;
};
export type MoreInfoTestsQuery = {
    readonly response: MoreInfoTestsQueryResponse;
    readonly variables: MoreInfoTestsQueryVariables;
};



/*
query MoreInfoTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...MoreInfo_show
    __id: id
  }
}

fragment MoreInfo_show on Show {
  internalID
  gravityID
  exhibition_period
  pressReleaseUrl
  openingReceptionText
  partner {
    __typename
    ... on Partner {
      website
      type
    }
    ... on Node {
      __id: id
    }
    ... on ExternalPartner {
      __id: id
    }
  }
  press_release
  events {
    ...ShowEventSection_event
  }
  __id: id
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
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "MoreInfoTestsQuery",
  "id": null,
  "text": "query MoreInfoTestsQuery {\n  show(id: \"anderson-fine-art-gallery-flickinger-collection\") {\n    ...MoreInfo_show\n    __id: id\n  }\n}\n\nfragment MoreInfo_show on Show {\n  internalID\n  gravityID\n  exhibition_period\n  pressReleaseUrl\n  openingReceptionText\n  partner {\n    __typename\n    ... on Partner {\n      website\n      type\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on ExternalPartner {\n      __id: id\n    }\n  }\n  press_release\n  events {\n    ...ShowEventSection_event\n  }\n  __id: id\n}\n\nfragment ShowEventSection_event on PartnerShowEventType {\n  event_type\n  description\n  start_at\n  end_at\n}\n",
  "metadata": {},
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
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MoreInfo_show",
            "args": null
          },
          v1
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
        "args": v0,
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
            "name": "gravityID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "exhibition_period",
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
              v1,
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
(node as any).hash = 'bc9b5b8df734aa249ca91e119888e47e';
export default node;
