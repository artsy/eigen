/* tslint:disable */
/* eslint-disable */
/* @relayHash 53f5ab5d65b42c9d2f76f6293505e2f1 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MarketingGroupTypes = "ArtistSeries" | "FeaturedCollections" | "OtherCollections" | "%future added value";
export type OtherCollectionsRailTestsQueryVariables = {};
export type OtherCollectionsRailTestsQueryResponse = {
    readonly marketingCollection: {
        readonly linkedCollections: ReadonlyArray<{
            readonly groupType: MarketingGroupTypes;
            readonly " $fragmentRefs": FragmentRefs<"OtherCollectionsRail_collectionGroup">;
        }>;
    } | null;
};
export type OtherCollectionsRailTestsQueryRawResponse = {
    readonly marketingCollection: ({
        readonly linkedCollections: ReadonlyArray<{
            readonly groupType: MarketingGroupTypes;
            readonly name: string;
            readonly members: ReadonlyArray<{
                readonly id: string;
                readonly slug: string;
                readonly title: string;
            }>;
        }>;
        readonly id: string | null;
    }) | null;
};
export type OtherCollectionsRailTestsQuery = {
    readonly response: OtherCollectionsRailTestsQueryResponse;
    readonly variables: OtherCollectionsRailTestsQueryVariables;
    readonly rawResponse: OtherCollectionsRailTestsQueryRawResponse;
};



/*
query OtherCollectionsRailTestsQuery {
  marketingCollection(slug: "post-war") {
    linkedCollections {
      groupType
      ...OtherCollectionsRail_collectionGroup
    }
    id
  }
}

fragment OtherCollectionsRail_collectionGroup on MarketingCollectionGroup {
  groupType
  name
  members {
    id
    slug
    title
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slug",
    "value": "post-war"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "groupType",
  "args": null,
  "storageKey": null
},
v2 = {
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
    "name": "OtherCollectionsRailTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"post-war\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "linkedCollections",
            "storageKey": null,
            "args": null,
            "concreteType": "MarketingCollectionGroup",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              {
                "kind": "FragmentSpread",
                "name": "OtherCollectionsRail_collectionGroup",
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
    "name": "OtherCollectionsRailTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"post-war\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "linkedCollections",
            "storageKey": null,
            "args": null,
            "concreteType": "MarketingCollectionGroup",
            "plural": true,
            "selections": [
              (v1/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "members",
                "storageKey": null,
                "args": null,
                "concreteType": "MarketingCollection",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
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
                    "name": "title",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "OtherCollectionsRailTestsQuery",
    "id": "89f9fe2f9edd2e062a4c409d49d062d6",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '52ae03838dc501e59f584e28bcc0fb3e';
export default node;
