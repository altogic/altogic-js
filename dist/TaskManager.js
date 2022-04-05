"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const APIBase_1 = require("./APIBase");
const helpers_1 = require("./utils/helpers");
/**
 * The task manager allows you to manually trigger service executions of your scheduled tasks which actually ran periodically at fixed times, dates, or intervals.
 *
 * Typically, a scheduled task runs according to its defined execution schedule. However, with Altogic's client API by calling the {@link runOnce} method, you can manually run scheduled tasks ahead of their actual execution schedule.
 *
 * @export
 * @class TaskManager
 */
class TaskManager extends APIBase_1.APIBase {
    /**
     * Creates an instance of TaskManager to trigger execution of scheduled tasks.
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     */
    constructor(fetcher) {
        super(fetcher);
    }
    /**
     * Triggers the execution of the specified task. After the task is triggered, the routed service defined in your scheduled task configuration is invoked. This routed service executes the task and performs necessary actions defined in its service flow.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} queueNameOrId The name or id of the message queue.
     * @throws Throws an exception if `taskNameOrId` is not specified
     * @returns If successful, returns information about the triggered task. You can use `taskId` to check the exectuion status of your task by calling {@link getTaskStatus} method. In case of errors, returns the errors that occurred.
     */
    runOnce(taskNameOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('taskNameOrId', taskNameOrId);
            const { data, errors } = yield this.fetcher.post('/_api/rest/v1/task', {
                taskNameOrId,
            });
            return { info: data, errors };
        });
    }
    /**
     * Gets the latest status of the task. The last seven days task execution logs are kept. If you try to get the status of a task that has been triggered earlier, this method returns `null` for {@link TaskInfo}.
     *
     * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} taskId The id of the task
     * @throws Throws an exception if `taskId` is not specified
     * @returns If successful, returns status information about the triggered task
     */
    getTaskStatus(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)('taskId', taskId);
            const { data, errors } = yield this.fetcher.get(`/_api/rest/v1/task/${taskId}`);
            return { info: data, errors };
        });
    }
}
exports.TaskManager = TaskManager;
//# sourceMappingURL=TaskManager.js.map