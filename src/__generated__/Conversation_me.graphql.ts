/* tslint:disable */

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



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Conversation_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "conversationID",
      "type": "String!"
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "conversation",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "id",
          "variableName": "conversationID"
        }
      ],
      "concreteType": "Conversation",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "internalID",
          "args": null,
          "storageKey": null
        },
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
          "name": "lastMessageID",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "unread",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "to",
          "storageKey": null,
          "args": null,
          "concreteType": "ConversationResponder",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "name",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "from",
          "storageKey": null,
          "args": null,
          "concreteType": "ConversationInitiator",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "email",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "FragmentSpread",
          "name": "Messages_conversation",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '453817fb6e16a3de8ec1ba95936c0a8a';
export default node;
