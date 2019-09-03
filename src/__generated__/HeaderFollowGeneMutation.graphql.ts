/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FollowGeneInput = {
    readonly geneID?: string | null;
    readonly clientMutationId?: string | null;
};
export type HeaderFollowGeneMutationVariables = {
    readonly input: FollowGeneInput;
};
export type HeaderFollowGeneMutationResponse = {
    readonly followGene: {
        readonly gene: {
            readonly id: string;
            readonly isFollowed: boolean | null;
        } | null;
    } | null;
};
export type HeaderFollowGeneMutation = {
    readonly response: HeaderFollowGeneMutationResponse;
    readonly variables: HeaderFollowGeneMutationVariables;
};



/*
mutation HeaderFollowGeneMutation(
  $input: FollowGeneInput!
) {
  followGene(input: $input) {
    gene {
      id
      isFollowed
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "FollowGeneInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "followGene",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "FollowGenePayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gene",
        "storageKey": null,
        "args": null,
        "concreteType": "Gene",
        "plural": false,
        "selections": [
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
            "name": "isFollowed",
            "args": null,
            "storageKey": null
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
    "name": "HeaderFollowGeneMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "HeaderFollowGeneMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "HeaderFollowGeneMutation",
    "id": "5aa1bfc9148a5b903c0e2955d9bca1e4",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '82fdf8dee7dfed66c7ac38b813cedd21';
export default node;
