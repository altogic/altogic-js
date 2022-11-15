import io from "socket.io-client";
import { APIBase } from "./APIBase";
import { Fetcher } from "./utils/Fetcher";
import {
  ClientOptions,
  RealtimeOptions,
  ListenerFunction,
  MemberData,
  UserEventListenerFunction,
} from "./types";
import { checkRequired, parseRealtimeEnvUrl } from "./utils/helpers";
import { APIError } from "./types";

const RECONNECTION_DELAY = 1000;
const TIMEOUT = 20000;
const AWAIT_TIMEOUT = 5000;
/**
 * The realtime manager allows realtime publish and subscribe (pub/sub) messaging through websockets.
 *
 * Realtime makes it possible to open a two-way interactive communication session between the user's device (e.g., browser, smartphone) and a server. With realtime, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.
 *
 * The configuration parameters of the realtime module is specified when creating the Altogic client library instance. In particular three key parameters affect how realtime messaging works in your apps.
 *
 * - `echoMessages` -  This boolean parmeter enables or prevents realtime messages originating from this connection being echoed back on the same connection. By default messsages are echoed back.
 * - `bufferMessages` -  By default, any event emitted while the realtime socket is not connected will be buffered until reconnection. You can turn on/off the message buffering using this parameter. While enabiling this festure is useful in most cases (when the reconnection delay is short), it could result in a huge spike of events when the connection is restored.
 * - `autoJoinChannels` -  This parameter enables or disables automatic join to channels already subscribed in case of websocket reconnection. When websocket is disconnected, it automatically leaves subscribed channels. This parameter helps re-joining to already joined channels when the connection is restored. If this parameter is set to false, you need to listen to `connect` and `disconnect` events to manage your channel subscriptions.
 *
 * @export
 * @class RealtimeManager
 */
export class RealtimeManager extends APIBase {
  /**
   * The web socket object which is basically an `EventEmitter` which sends events to and receive events from the server over the network.
   * @type {object}
   */
  #socket: any;

  /**
   * The flag to enable or prevent automatic join to channels already subscribed in case of websocket reconnection. When websocket is disconnected, it automatically leaves subscribed channels. This parameter helps re-joining to already joined channels when the connection is restored.
   * @type {boolean}
   */
  #autoJoinChannels: boolean;

  /**
   * The default setting whether to enable or prevent realtime messages originating from this connection being echoed back on the same connection.
   * @type {object}
   */
  #echoMessages: boolean;

  /**
   * By default, any event emitted while the realtime socket is not connected will be buffered until reconnection. You can turn on/off the message buffering using this parameter.
   * @type {number}
   */
  #bufferMessages: boolean;

  /**
   * Keeps the list of channels this socket is subscribed to. In case of a reconnect, if `autoJoinChannels` is enabled then joins to the list of channels specified in this map.
   * @type {Map}
   */
  #channels: Map<string, boolean>;

  /**
   * Keeps a reference to the latest user data that is updated using the {@link update} method.
   * @type {number}
   */
  #userData: any;

  /**
   * Creates an instance of RealtimeManager to manage pub/sub messaging.
   * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
   * @param {ClientOptions} [options] Configuration options for the realtime connection
   */
  constructor(fetcher: Fetcher, { realtime }: ClientOptions) {
    super(fetcher);

    this.#autoJoinChannels = realtime?.autoJoinChannels ?? true;
    this.#echoMessages = realtime?.echoMessages ?? true;
    this.#bufferMessages = realtime?.bufferMessages ?? true;
    this.#channels = new Map();
    this.#userData = null;
    this.#establishConnection(realtime);
  }

  /**
   * Connects to the realtime server
   */
  #establishConnection(realtime: RealtimeOptions | undefined): void {
    const urlInfo = parseRealtimeEnvUrl(this.fetcher.getBaseUrl());

    this.#socket = io(urlInfo.realtimeUrl, {
      reconnection: true,
      reconnectionDelay: realtime?.reconnectionDelay ?? RECONNECTION_DELAY,
      timeout: realtime?.timeout ?? TIMEOUT,
      transports: ["websocket", "polling"],
      auth: {
        echoMessages: this.#echoMessages,
        subdomain: urlInfo.subdomain,
        envId: urlInfo.envId,
        clientKey: this.fetcher.getClientKey(),
        Session: this.fetcher.getSessionToken(),
      },
    });

    // Register the event listeners
    this.#socket.io.on("reconnect", () => {
      // If autojoin channels enabled then join already subscribed channels
      if (this.#autoJoinChannels) this.#joinChannels();
    });
  }

  /**
   * In case of a reconnect, if `autoJoinChannels` is enabled in realtime configuration settings, then re-joins to the list of channels already subscribed.
   *
   * @returns {void}
   */
  #joinChannels(): void {
    // In case of reconnection we should also update the user data to its latest value
    if (this.#userData) this.updateProfile(this.#userData, this.#echoMessages);
    this.#channels.forEach((echo, channel) => {
      this.join(channel, echo);
    });
  }

  /**
   * Callback function fired upon successfull realtime connection, including a successful reconnection.
   * @param {function} listener The listener function.
   * @returns {void}
   */
  onConnect(listener: () => void): void {
    // Register the event listener
    if (listener) this.#socket.on("connect", listener);
  }

  /**
   * Callback function fired upon an attempt to reconnect. Passes the reconnection attempt number as a parameter to the callback function.
   * @param {function} listener The listener function.
   * @returns {void}
   */
  onReconnectAttempt(listener: (attemptNumber: number) => void): void {
    // Register the event listener
    if (listener) this.#socket.io.on("reconnect_attempt", listener);
  }

  /**
   * Callback function fired upon realtime disconnection. Passes the diconnection `reason` as a string parameter to the callback function.
   * @param {function} listener The listener function.
   * @returns {void}
   */
  onDisconnect(listener: (reason: string) => void): void {
    // Register the event listener
    if (listener) this.#socket.on("disconnect", listener);
  }

  /**
   * Callback function fired upon a realtime connection error. Passes the `error` as a parameter to the callback function.
   * @param {function} listener The listener function.
   * @returns {void}
   */
  onError(listener: (error: any) => void): void {
    // Register the event listener
    if (listener) this.#socket.on("connect_error", listener);
  }

  /**
   * Manually open the realtime connection, connects the socket.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @returns {void}
   */
  open(): void {
    if (this.#socket.disconnected) this.#socket.open();
  }

  /**
   * Manually closes the realtime connection. In this case, the socket will not try to reconnect.
   * @returns {void}
   */
  close(): void {
    if (this.#socket.connected) this.#socket.close();
  }

  /**
   * Returns the unique identifier of the underlying websocket
   * @returns {string} The socket id
   */
  getSocketId(): string {
    return this.#socket.id;
  }

  /**
   * Returns true if the realtime socket is connected otherwise false
   * @returns {boolean}
   */
  isConnected(): boolean {
    return this.#socket.connected;
  }

  /**
   * Register a new listener function for the given event.
   * @returns {void}
   */
  on(eventName: string, listener: ListenerFunction): void {
    if (listener) this.#socket.on(eventName, listener);
  }

  /**
   * Registers a new catch-all listener function. This listener function is triggered for all messages sent to this socket.
   * @param {ListenerFunction} listener The listener function.
   * @returns {void}
   */
  onAny(listener: ListenerFunction): void {
    if (listener) this.#socket.onAny(listener);
  }

  /**
   * Adds a one-time listener function for the event named `eventName`. The next time `eventName` is triggered, this listener is removed and then invoked.
   * @param {string} eventName The name of the event.
   * @param {ListenerFunction} listener The listener function.
   * @returns {void}
   */
  once(eventName: string, listener: ListenerFunction): void {
    if (listener) this.#socket.once(eventName, listener);
  }

  /**
   * Removes the specified listener function from the listener array for the event named `eventName`.
   *
   * If `listener` is not specified, it removes all listeners for for the event named `eventName`.
   *
   * If neither `eventName` nor `listener` is specified, it removes all listeners for all events.
   *
   * @param {string} eventName The name of the event.
   * @param {ListenerFunction} listener The listener function.
   * @returns {void}
   */
  off(eventName?: string, listener?: ListenerFunction): void {
    this.#socket.off(eventName, listener);
  }

  /**
   * Removes the previously registered listener function. If no listener is provided, all catch-all listener functions are removed.
   *
   * @param {ListenerFunction} listener The listener function.
   * @returns {void}
   */
  offAny(listener?: ListenerFunction): void {
    this.#socket.off(listener);
  }

  /**
   * Returns the array of listener functions for the event named `eventName`.
   * @param {string} eventName The name of the event.
   * @returns {ListenerFunction[]} Array of listener functions
   */
  getListeners(eventName: string): ListenerFunction[] {
    return this.#socket.listeners(eventName);
  }

  /**
   * Sends the message identified by the `eventName` to all connected members of the app. All serializable datastructures are supported for the `message`, including `Buffer`.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} eventName The name of the event.
   * @param {any} message The message payload/contents.
   * @param {boolean} echo Override the echo flag specified when creating the websocket to enable or prevent realtime messages originating from this connection being echoed back on the same connection.
   * @returns {void}
   * @throws Throws an exception if `eventName` is not specified
   */
  broadcast(eventName: string, message: any, echo?: boolean): void {
    checkRequired("eventName", eventName, true);
    if (this.#bufferMessages)
      this.#socket.emit("message", { eventName, message });
    else this.#socket.volatile.emit("message", { eventName, message, echo });
  }

  /**
   * Sends the message identified by the `eventName` to the provided channel members only. All serializable datastructures are supported for the `message`, including `Buffer`.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} channel The name of the channel.
   * @param {string} eventName The name of the event.
   * @param {any} message The message payload/contents.
   * @param {boolean} echo Override the echo flag specified when creating the websocket to enable or prevent realtime messages originating from this connection being echoed back on the same connection.
   * @returns {void}
   * @throws Throws an exception if `channel` or `eventName` is not specified
   */
  send(channel: string, eventName: string, message: any, echo?: boolean): void {
    checkRequired("channel", channel, true);
    checkRequired("eventName", eventName, true);
    if (this.#bufferMessages)
      this.#socket.emit("message", { channel, eventName, message });
    else
      this.#socket.volatile.emit("message", {
        channel,
        eventName,
        message,
        echo,
      });
  }

  /**
   * Adds the realtime socket to the specified channel. As a result of this action a `channel:join` event is sent to all members of the channel notifying the new member arrival.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} channel The name of the channel.
   * @param {boolean} echo Override the echo flag specified when creating the websocket to enable or prevent `channel:join` event originating from this connection being echoed back on the same connection.
   * @returns {void}
   * @throws Throws an exception if `channel` is not specified
   */
  join(channel: string, echo?: boolean): void {
    checkRequired("channel", channel, true);
    this.#socket.emit("join", { channel, echo });

    // Add channel to joined channels list
    this.#channels.set(channel, echo ?? this.#echoMessages);
  }

  /**
   * Removes the realtime socket from the specified channel. As a result of this action a `channel:leave` event is sent to all members of the channel notifying the departure of existing member.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} channel The name of the channel.
   * @param {boolean} echo Override the echo flag specified when creating the websocket to enable or prevent `channel:leave` event originating from this connection being echoed back on the same connection.
   * @returns {void}
   * @throws Throws an exception if `channel` is not specified
   */
  leave(channel: string, echo?: boolean): void {
    checkRequired("channel", channel, true);
    this.#socket.emit("leave", { channel, echo });

    // Remove channel from joined channels list
    this.#channels.delete(channel);
  }

  /**
   * Update the current realtime socket member data and broadcast an update event to each joined channel so that other channel members can get the information about the updated member data. Whenever the socket joins a new channel, this updated member data will be broadcasted to channel members. As a result of this action a `channel:update` event is sent to all members of the subscribed channels notifying the member data update.
   *
   * As an example if you are developing a realtime chat application it might be a good idea to store the username and user profile picture URL in member data so that joined chat channels can get updated user information.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {any} data data payload for the current member. The supported payload types are Strings, JSON objects and arrays, buffers containing arbitrary binary data, and null.
   * @param {boolean} echo Override the echo flag specified when creating the websocket to enable or prevent `channel:update` event originating from this connection being echoed back on the same connection.
   * @returns {void}
   */
  updateProfile(data: any, echo?: boolean): void {
    this.#socket.emit("update", { data, echo });

    // Keep reference to latest user data
    this.#userData = data;
  }

  /**
   * Convenience method which registers a new listener function for `channel:join` events which are emitted when a new member joins a channel.
   * @param {ListenerFunction} listener The listener function.
   * @returns {void}
   */
  onJoin(listener: ListenerFunction): void {
    if (listener) this.#socket.on("channel:join", listener);
  }

  /**
   * Convenience method which registers a new listener function for `channel:leave` events which are emitted when an existing member leaves a channel.
   * @param {ListenerFunction} listener The listener function.
   * @returns {void}
   */
  onLeave(listener: ListenerFunction): void {
    if (listener) this.#socket.on("channel:leave", listener);
  }

  /**
   * Convenience method which registers a new listener function for `channel:update` events which are emitted when a channel member updates its member data.
   * @param {ListenerFunction} listener The listener function.
   * @returns {void}
   */
  onUpdate(listener: ListenerFunction): void {
    if (listener) this.#socket.on("channel:update", listener);
  }

  /**
   * Returns the members of the specified channel.
   *
   * > *If the client library key is set to **enforce session**, an active user session is required (e.g., user needs to be logged in) to call this method.*
   * @param {string} channel The name of the channel.
   * @returns Returns array of channel member data. If no channel members then returns and empty array []
   * @throws Throws an exception if `channel` is not specified
   */
  async getMembers(
    channel: string
  ): Promise<{ data: boolean | null; errors: APIError | null }> {
    checkRequired("channel", channel, true);
    return await this.fetcher.post(`/_api/rest/v1/realtime/get-members`, {
      channel,
    });
  }

  /**
   * Registers a method to listen to main user events. The following events will be listened:
   *
   * | Event | Description |
   * | :--- | :--- |
   * | user:signin |  Triggered whenever a new user session is created. |
   * | user:signout | Triggered when a user session is deleted. If {@link AuthManager.signOutAll} or {@link AuthManager.signOutAllExceptCurrent} method is called then for each deleted sesssion a separate `user:signout` event is triggered. |
   * | user:update | Triggered whenever user data changes including password, email and phone number updates. |
   * | user:delete | Triggered when the user data is deleted from the database. |
   * | user:pwdchange |  Triggered when the user password changes, either through direct password update or password reset. |
   * | user:emailchange |  Triggered whenever the email of the user changes. |
   * | user:phonechange |  Triggered whenever the phone number of the user changes. |
   *
   * > *Please note that `user:update` and `user:delete` events are fired only when a specific user with a known _id is updated or deleted in the database. For bulk user update or delete operations these events are not fired.*
   * @param {ListenerFunction} listener The listener function. This function gets two input parameters the name of the event that is being triggered and the user session object that has triggered the event. If the event is triggered by the user without a session, then the session value will be `null`.
   * @returns {void}
   */
  onUserEvent(listener: UserEventListenerFunction): void {
    if (listener) {
      this.#socket.on("user:signin", listener);
      this.#socket.on("user:signout", listener);
      this.#socket.on("user:update", listener);
      this.#socket.on("user:delete", listener);
      this.#socket.on("user:pwdchange", listener);
      this.#socket.on("user:emailchange", listener);
      this.#socket.on("user:phonechange", listener);
    }
  }
}
