/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Conversation_me = {
    readonly conversation: {
        readonly internalID: string | null;
        readonly id: string;
        readonly lastMessageID: string | null;
        readonly unread: boolean | null;
        readonly to: {
            readonly name: string;
        };
        readonly from: {
            readonly email: string;
        };
        readonly " $fragmentRefs": FragmentRefs<"Messages_conversation">;
    } | null;
    readonly " $refType": "Conversation_me";
};
export type Conversation_me$data = Conversation_me;
export type Conversation_me$key = {
    readonly " $data"?: Conversation_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Conversation_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "conversationID"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Conversation_me",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "id",
          "variableName": "conversationID"
        }
      ],
      "concreteType": "Conversation",
      "kind": "LinkedField",
      "name": "conversation",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        },
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
          "name": "lastMessageID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "unread",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ConversationResponder",
          "kind": "LinkedField",
          "name": "to",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ConversationInitiator",
          "kind": "LinkedField",
          "name": "from",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "email",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "Messages_conversation"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '453817fb6e16a3de8ec1ba95936c0a8a';
export default node;
