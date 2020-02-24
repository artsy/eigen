/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type getConvectionGeminiKeyQueryVariables = {};
export type getConvectionGeminiKeyQueryResponse = {
    readonly system: {
        readonly services: {
            readonly convection: {
                readonly geminiTemplateKey: string;
            };
        } | null;
    } | null;
};
export type getConvectionGeminiKeyQuery = {
    readonly response: getConvectionGeminiKeyQueryResponse;
    readonly variables: getConvectionGeminiKeyQueryVariables;
};



/*
query getConvectionGeminiKeyQuery {
  system {
    services {
      convection {
        geminiTemplateKey
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "system",
    "storageKey": null,
    "args": null,
    "concreteType": "System",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "services",
        "storageKey": null,
        "args": null,
        "concreteType": "Services",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "convection",
            "storageKey": null,
            "args": null,
            "concreteType": "ConvectionService",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "geminiTemplateKey",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "getConvectionGeminiKeyQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "getConvectionGeminiKeyQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "getConvectionGeminiKeyQuery",
    "id": "d2759d79e2c03e7a4f20054093419f41",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a7ffae2e10d304400de8792a31ce20ff';
export default node;
