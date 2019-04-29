/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairBoothHeader_show$ref } from "./FairBoothHeader_show.graphql";
export type FairBoothHeaderTestsQueryVariables = {};
export type FairBoothHeaderTestsQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": FairBoothHeader_show$ref;
    }) | null;
};
export type FairBoothHeaderTestsQuery = {
    readonly response: FairBoothHeaderTestsQueryResponse;
    readonly variables: FairBoothHeaderTestsQueryVariables;
};



/*
query FairBoothHeaderTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...FairBoothHeader_show
    __id: id
  }
}

fragment FairBoothHeader_show on Show {
  fair {
    name
    __id: id
  }
  partner {
    __typename
    ... on Partner {
      name
      gravityID
      internalID
      id
      href
      profile {
        internalID
        gravityID
        is_followed
        __id: id
      }
    }
    ... on Node {
      __id: id
    }
    ... on ExternalPartner {
      __id: id
    }
  }
  counts {
    artworks
    artists
  }
  location {
    display
    __id: id
  }
  __id: id
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
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairBoothHeaderTestsQuery",
  "id": null,
  "text": "query FairBoothHeaderTestsQuery {\n  show(id: \"anderson-fine-art-gallery-flickinger-collection\") {\n    ...FairBoothHeader_show\n    __id: id\n  }\n}\n\nfragment FairBoothHeader_show on Show {\n  fair {\n    name\n    __id: id\n  }\n  partner {\n    __typename\n    ... on Partner {\n      name\n      gravityID\n      internalID\n      id\n      href\n      profile {\n        internalID\n        gravityID\n        is_followed\n        __id: id\n      }\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on ExternalPartner {\n      __id: id\n    }\n  }\n  counts {\n    artworks\n    artists\n  }\n  location {\n    display\n    __id: id\n  }\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairBoothHeaderTestsQuery",
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
            "name": "FairBoothHeader_show",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairBoothHeaderTestsQuery",
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
            "name": "fair",
            "storageKey": null,
            "args": null,
            "concreteType": "Fair",
            "plural": false,
            "selections": [
              v2,
              v1
            ]
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
                  v2,
                  v3,
                  v4,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "id",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "href",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Profile",
                    "plural": false,
                    "selections": [
                      v4,
                      v3,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_followed",
                        "args": null,
                        "storageKey": null
                      },
                      v1
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "ShowCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artworks",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artists",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "display",
                "args": null,
                "storageKey": null
              },
              v1
            ]
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'ae12004335f8c4d530fc3b74a3a8e899';
export default node;
