/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Collection_collection$ref } from "./Collection_collection.graphql";
export type QueryRenderersCollectionQueryVariables = {
    readonly collectionID: string;
};
export type QueryRenderersCollectionQueryResponse = {
    readonly collection: {
        readonly " $fragmentRefs": Collection_collection$ref;
    } | null;
};
export type QueryRenderersCollectionQuery = {
    readonly response: QueryRenderersCollectionQueryResponse;
    readonly variables: QueryRenderersCollectionQueryVariables;
};



/*
query QueryRenderersCollectionQuery(
  $collectionID: String!
) {
  collection: marketingCollection(slug: $collectionID) {
    ...Collection_collection
  }
}

fragment Collection_collection on MarketingCollection {
  slug
  title
  description
  headerImage
  category
  credit
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "collectionID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "collectionID"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersCollectionQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "collection",
        "name": "marketingCollection",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Collection_collection",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersCollectionQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "collection",
        "name": "marketingCollection",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
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
            "name": "headerImage",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "category",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "credit",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersCollectionQuery",
    "id": "53983d472e1f1713473e410b863e807b",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8a31710533b8db1aec67616c37bf90ba';
export default node;
