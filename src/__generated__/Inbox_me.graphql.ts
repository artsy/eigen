/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Inbox_me = {
    readonly lotStandingsExistenceCheck: {
        readonly edges: ReadonlyArray<{
            readonly cursor: string;
        } | null> | null;
    };
    readonly conversationsExistenceCheck: {
        readonly edges: ReadonlyArray<{
            readonly cursor: string;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Conversations_me" | "MyBids_me">;
    readonly " $refType": "Inbox_me";
};
export type Inbox_me$data = Inbox_me;
export type Inbox_me$key = {
    readonly " $data"?: Inbox_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Inbox_me">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "cursor",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Inbox_me",
  "selections": [
    {
      "alias": "lotStandingsExistenceCheck",
      "args": (v0/*: any*/),
      "concreteType": "AuctionsLotStandingConnection",
      "kind": "LinkedField",
      "name": "auctionsLotStandingConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "AuctionsLotStandingEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": (v1/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": "auctionsLotStandingConnection(first:1)"
    },
    {
      "alias": "conversationsExistenceCheck",
      "args": (v0/*: any*/),
      "concreteType": "ConversationConnection",
      "kind": "LinkedField",
      "name": "conversationsConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ConversationEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": (v1/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": "conversationsConnection(first:1)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Conversations_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyBids_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
})();
(node as any).hash = 'ad5400c5eb8366c25ea765a60b88736e';
export default node;
