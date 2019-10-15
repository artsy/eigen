/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairBoothHeader_show$ref } from "./FairBoothHeader_show.graphql";
export type FairBoothHeaderTestsQueryVariables = {};
export type FairBoothHeaderTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FairBoothHeader_show$ref;
    } | null;
};
export type FairBoothHeaderTestsQueryRawResponse = {
    readonly show: ({
        readonly fair: ({
            readonly name: string | null;
            readonly id: string | null;
        }) | null;
        readonly partner: ({
            readonly __typename: "Partner";
            readonly id: string | null;
            readonly name: string | null;
            readonly slug: string;
            readonly internalID: string;
            readonly href: string | null;
            readonly profile: ({
                readonly internalID: string;
                readonly slug: string;
                readonly is_followed: boolean | null;
                readonly id: string | null;
            }) | null;
        } | {
            readonly __typename: string | null;
            readonly id: string | null;
        }) | null;
        readonly counts: ({
            readonly artworks: number | null;
            readonly artists: number | null;
        }) | null;
        readonly location: ({
            readonly display: string | null;
            readonly id: string | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type FairBoothHeaderTestsQuery = {
    readonly response: FairBoothHeaderTestsQueryResponse;
    readonly variables: FairBoothHeaderTestsQueryVariables;
    readonly rawResponse: FairBoothHeaderTestsQueryRawResponse;
};



/*
query FairBoothHeaderTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...FairBoothHeader_show
    id
  }
}

fragment FairBoothHeader_show on Show {
  fair {
    name
    id
  }
  partner {
    __typename
    ... on Partner {
      name
      slug
      internalID
      id
      href
      profile {
        internalID
        slug
        is_followed: isFollowed
        id
      }
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  counts {
    artworks
    artists
  }
  location {
    display
    id
  }
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
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
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairBoothHeader_show",
            "args": null
          }
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
        "args": (v0/*: any*/),
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
              (v1/*: any*/),
              (v2/*: any*/)
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
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  (v1/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
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
                      (v4/*: any*/),
                      (v3/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": "is_followed",
                        "name": "isFollowed",
                        "args": null,
                        "storageKey": null
                      },
                      (v2/*: any*/)
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
              (v2/*: any*/)
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FairBoothHeaderTestsQuery",
    "id": "b1ee01f4e05a61ebeb1522bc54bcb701",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3ba373afceda21f082cf206b7bb54f8c';
export default node;
