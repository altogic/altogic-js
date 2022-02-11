import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { APIError, TaskInfo } from './types';
/**
 * The task manager allows you to manually trigger service executions of your scheduled tasks which actually ran periodically at fixed times, dates, or intervals.
 *
 * Typically, a scheduled task runs according to its defined execution schedule. However, with Altogic's client API by calling the {@link runOnce} method, you can manually run scheduled tasks ahead of their actual execution schedule.
 *
 * @export
 * @class TaskManager
 */
export declare class TaskManager extends APIBase {
    /**
     * Creates an instance of TaskManager to trigger execution of scheduled tasks.
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(fetcher: Fetcher);
    /**
     * Triggers the execution of the specified task. After the task is triggered, the routed service defined in your scheduled task configuration is invoked. This routed service executes the task and performs necessary actions defined in its service flow.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} queueNameOrId The name or id of the message queue.
     * @throws Throws an exception if `taskNameOrId` is not specified
     * @returns If successful, returns information about the triggered task. You can use `taskId` to check the exectuion status of your task by calling {@link getTaskStatus} method. In case of errors, returns the errors that occurred.
     */
    runOnce(taskNameOrId: string): Promise<{
        info: TaskInfo | null;
        errors: APIError | null;
    }>;
    /**
     * Gets the latest status of the task. The last seven days message logs are kept. If you try to get the status of a task that has been triggered earlier, this method returns `null` for {@link TaskInfo}.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} taskId The id of the task
     * @throws Throws an exception if `taskId` is not specified
     * @returns If successful, returns status information about the triggered task
     */
    getTaskStatus(taskId: string): Promise<{
        info: TaskInfo | null;
        errors: APIError | null;
    }>;
}
//# sourceMappingURL=TaskManager.d.ts.map