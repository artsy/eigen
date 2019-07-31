/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Message_message$ref } from "./Message_message.graphql";
export type SendConversationMessageMutationInput = {
    readonly id: string;
    readonly from: string;
    readonly bodyText: string;
    readonly replyToMessageID: string;
    readonly clientMutationId?: string | null;
};
export type SendConversationMessageMutationVariables = {
    readonly input: SendConversationMessageMutationInput;
};
export type SendConversationMessageMutationResponse = {
    readonly sendConversationMessage: {
        readonly messageEdge: {
            readonly node: {
                readonly impulse_id: string;
                readonly is_from_user: boolean | null;
                readonly body: string | null;
                readonly id: string;
                readonly " $fragmentRefs": Message_message$ref;
            } | null;
        } | null;
    } | null;
};
export type SendConversationMessageMutation = {
    readonly response: SendConversationMessageMutationResponse;
    readonly variables: SendConversationMessageMutationVariables;
};



/*
mutation SendConversationMessageMutation(
  $input: SendConversationMessageMutationInput!
) {
  sendConversationMessage(input: $input) {
    messageEdge {
      node {
        impulse_id: impulseID
        is_from_user: isFromUser
        body
        id
        ...Message_message
      }
    }
  }
}

fragment Message_message on Message {
  body
  created_at: createdAt
  is_from_user: isFromUser
  from {
    name
    email
  }
  invoice {
    payment_url: paymentURL
    ...InvoicePreview_invoice
    id
  }
  attachments {
    internalID
    content_type: contentType
    download_url: downloadURL
    file_name: fileName
    ...ImagePreview_attachment
    ...PDFPreview_attachment
    id
  }
}

fragment InvoicePreview_invoice on Invoice {
  payment_url: paymentURL
  state
  total
  lewitt_invoice_id: lewittInvoiceID
}

fragment ImagePreview_attachment on Attachment {
  download_url: downloadURL
  ...AttachmentPreview_attachment
}

fragment PDFPreview_attachment on Attachment {
  file_name: fileName
  ...AttachmentPreview_attachment
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "SendConversationMessageMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": "impulse_id",
  "name": "impulseID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": "is_from_user",
  "name": "isFromUser",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "body",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SendConversationMessageMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sendConversationMessage",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SendConversationMessageMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "messageEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "MessageEdge",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "Message",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "kind": "FragmentSpread",
                    "name": "Message_message",
                    "args": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SendConversationMessageMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sendConversationMessage",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SendConversationMessageMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "messageEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "MessageEdge",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "Message",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": "created_at",
                    "name": "createdAt",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "from",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MessageInitiator",
                    "plural": false,
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
                        "name": "email",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "invoice",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Invoice",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": "payment_url",
                        "name": "paymentURL",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "state",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "total",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "lewitt_invoice_id",
                        "name": "lewittInvoiceID",
                        "args": null,
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "attachments",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Attachment",
                    "plural": true,
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
                        "alias": "content_type",
                        "name": "contentType",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "download_url",
                        "name": "downloadURL",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "file_name",
                        "name": "fileName",
                        "args": null,
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "SendConversationMessageMutation",
    "id": "9a77342cc7cc7d86cdc13f792857a8f2",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'de9c31165ba6aff10f299db16ec743b0';
export default node;
