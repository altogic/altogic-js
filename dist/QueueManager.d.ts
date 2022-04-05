import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { APIError, MessageInfo } from './types';
/**
 * The queue manager allows different parts of your application to communicate and perform activities asynchronously.
 *
 * A message queue provides a buffer that temporarily stores messages and dispatches them to their consuming service. The messages are usually small, and can be things like requests, replies or error messages, etc.
 *
 * Typically, in Altogic, you submit messages to a queue in your backend app services using the **Submit Message to Queue** node. However, with Altogic's client API by calling the {@link submitMessage} method, you can manually send messages to your selected queue for processing.
 *
 * @export
 * @class QueueManager
 */
export declare class QueueManager extends APIBase {
    /**
     * Creates an instance of QueueManager to submit messages to your backend app message queues.
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(fetcher: Fetcher);
    /**
     * Submits a message to the specified message queue for asychronous processing. After the message is submitted, the routed service defined in your message queue configuration is invoked. This routed service processes the input message and performs necessary tasks defined in its service flow.
     *
     * The structure of the message (e.g., key-value pairs) is defined by the *Start Node* of your queue service.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} queueNameOrId The name or id of the message queue.
     * @param {object} message The message payload (JSON object) that will be submitted to the message queue
     * @throws Throws an exception if `queueNameOrId` or `message` not specified
     * @returns If successful, returns information about the submitted message. You can use `messageId` to check the processing status of your message by calling {@link getMessageStatus} method. In case of an errors, returns the errors that occurred.
     */
    submitMessage(queueNameOrId: string, message: object): Promise<{
        info: MessageInfo | null;
        errors: APIError | null;
    }>;
    /**
     * Gets the latest status of the message. The last seven days message queue logs are kept. If you try to get the status of a message that has been submitted earlier, this method returns `null` for {@link MessageInfo}.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} messageId The id of the message
     * @throws Throws an exception if `messageId` not specified
     * @returns If successful, returns status information about the submitted message
     */
    getMessageStatus(messageId: string): Promise<{
        info: MessageInfo | null;
        errors: APIError | null;
    }>;
}
//# sourceMappingURL=QueueManager.d.ts.map