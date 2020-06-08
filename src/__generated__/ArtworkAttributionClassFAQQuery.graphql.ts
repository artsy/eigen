/* tslint:disable */
/* eslint-disable */
/* @relayHash 6b16f7101567bfa532727e821020f989 */

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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkAttributionClassFAQQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artworkAttributionClasses",
        "storageKey": null,
        "args": null,
        "concreteType": "AttributionClass",
        "plural": true,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtworkAttributionClassFAQ_artworkAttributionClasses",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkAttributionClassFAQQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artworkAttributionClasses",
        "storageKey": null,
        "args": null,
        "concreteType": "AttributionClass",
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "longDescription",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtworkAttributionClassFAQQuery",
    "id": "09e438feec326b14526de8bd9302e70b",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = '87f390482264f567dde7a47f2b01a405';
export default node;
