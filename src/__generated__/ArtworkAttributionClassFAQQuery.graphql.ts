/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 09e438feec326b14526de8bd9302e70b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAttributionClassFAQQueryVariables = {};
export type ArtworkAttributionClassFAQQueryResponse = {
    readonly artworkAttributionClasses: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ArtworkAttributionClassFAQ_artworkAttributionClasses">;
    } | null> | null;
};
export type ArtworkAttributionClassFAQQuery = {
    readonly response: ArtworkAttributionClassFAQQueryResponse;
    readonly variables: ArtworkAttributionClassFAQQueryVariables;
};



/*
query ArtworkAttributionClassFAQQuery {
  artworkAttributionClasses {
    ...ArtworkAttributionClassFAQ_artworkAttributionClasses
    id
  }
}

fragment ArtworkAttributionClassFAQ_artworkAttributionClasses on AttributionClass {
  name
  longDescription
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkAttributionClassFAQQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AttributionClass",
        "kind": "LinkedField",
        "name": "artworkAttributionClasses",
        "plural": true,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtworkAttributionClassFAQ_artworkAttributionClasses"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtworkAttributionClassFAQQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "AttributionClass",
        "kind": "LinkedField",
        "name": "artworkAttributionClasses",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "longDescription",
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "09e438feec326b14526de8bd9302e70b",
    "metadata": {},
    "name": "ArtworkAttributionClassFAQQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '87f390482264f567dde7a47f2b01a405';
export default node;
