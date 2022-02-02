import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { APIError, TaskInfo } from './types';
import { checkRequired } from './utils/helpers';

/**
 * The task manager allows you to manually trigger service executions of your scheduled tasks which actually ran periodically at fixed times, dates, or intervals.
 *
 * Typically, a scheduled tasks runs according to its defined execution schedule. However, with Altogic's client API by calling the {@link runOnce} method, you can manually run scheduled tasks ahead of their actual execution schedule.
 *
 * @export
 * @class TaskManager
 */
export class TaskManager extends APIBase {
   /**
    * Creates an instance of TaskManager to trigger execution of scheduled tasks.
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    */
   constructor(fetcher: Fetcher) {
      super(fetcher);
   }

   /**
    * Triggers the execution of the specified task. After the task is triggered, the routed service defined in your scheduled task configuration is invoked. This routed service executes the task and performs necessary actions defined in its service flow.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    * @param {string} queueNameOrId The name or id of the message queue.
    * @returns If successful, returns information about the triggered task. You can use `taskId` to check the exectuion status of your task by calling {@link getTaskStatus} method. In case of errors, returns the errors that occurred.
    */
   async runOnce(
      taskNameOrId: string
   ): Promise<{ info: TaskInfo | null; errors: APIError | null }> {
      checkRequired('taskNameOrId', taskNameOrId);

      let { data, errors } = await this.fetcher.post('/_api/rest/v1/task', {
         taskNameOrId,
      });

      return { info: data, errors: errors };
   }

   /**
    * Gets the latest status of the task.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    * @param {string} taskId The id of the task
    * @returns If successful, returns status information about the triggered task
    */
   async getTaskStatus(
      taskId: string
   ): Promise<{ info: TaskInfo | null; errors: APIError | null }> {
      checkRequired('messageId', taskId);

      let { data, errors } = await this.fetcher.get(`/_api/rest/v1/task/${taskId}`);

      return { info: data, errors: errors };
   }
}
