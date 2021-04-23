/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 5aa1bfc9148a5b903c0e2955d9bca1e4 */

import { ConcreteRequest } from "relay-runtime";
export type FollowGeneInput = {
    clientMutationId?: string | null;
    geneID?: string | null;
    unfollow?: boolean | null;
};
export type HeaderFollowGeneMutationVariables = {
    input: FollowGeneInput;
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "FollowGenePayload",
    "kind": "LinkedField",
    "name": "followGene",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Gene",
        "kind": "LinkedField",
        "name": "gene",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isFollowed",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HeaderFollowGeneMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HeaderFollowGeneMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "5aa1bfc9148a5b903c0e2955d9bca1e4",
    "metadata": {},
    "name": "HeaderFollowGeneMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '82fdf8dee7dfed66c7ac38b813cedd21';
export default node;
