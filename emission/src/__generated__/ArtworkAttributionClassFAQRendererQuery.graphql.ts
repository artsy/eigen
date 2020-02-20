/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAttributionClassFAQRendererQueryVariables = {};
export type ArtworkAttributionClassFAQRendererQueryResponse = {
    readonly artworkAttributionClasses: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ArtworkAttributionClassFAQ_artworkAttributionClasses">;
    } | null> | null;
};
export type ArtworkAttributionClassFAQRendererQuery = {
    readonly response: ArtworkAttributionClassFAQRendererQueryResponse;
    readonly variables: ArtworkAttributionClassFAQRendererQueryVariables;
};



/*
query ArtworkAttributionClassFAQRendererQuery {
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
    "name": "ArtworkAttributionClassFAQRendererQuery",
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
    "name": "ArtworkAttributionClassFAQRendererQuery",
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
    "name": "ArtworkAttributionClassFAQRendererQuery",
    "id": "836d7fa217741306a9e462f3d5b78a0f",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = 'ef4ae79c78e3ebf5e50b05514635029c';
export default node;
