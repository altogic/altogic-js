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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AuthManager_instances, _AuthManager_localStorage, _AuthManager_signInRedirect, _AuthManager_deleteLocalData, _AuthManager_saveLocalData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthManager = void 0;
const APIBase_1 = require("./APIBase");
const helpers_1 = require("./utils/helpers");
/**
 * Handles the authentication process of your application users. Provides methods to manage users, sessions and authentication.
 *
 * You are free to design the way to authenticate your users and manage sessions in Altogic through defining your custom services. However, by default Altogic provides three methods to manage user accounts through the client library.
 *
 * 1. **Email and password based account management:** This is the default authentication method and it requires email address validation. You can customize to enable/disable email confirmations, use your own SMTP server to send email (by default signup email confirmation emails are sent from noreply@mail.app.altogic.com domain) and define your email templates.
 * 2. **Phone number and password based account management:** You can also allow your uses to sign up using their phone numbers and validate these phone numbers by sending a validation code through SMS. In order to use this method of authentication, you need to configure the SMS provider. Altogic currently supports Twilio, MessageBird, and Vonage for sending SMS messages.
 * 3. **Authentication through 3rd party Oauth providers** such as Google, Facebook, Twitter, GitHub, Discord: This method enables to run the oauth flow of specific provider in your front-end applications. In order to use this method you need to make specific configuration at the provider to retrieve client id and client secret.
 *
 * To use any of the above authentication methods you need to configure your app authentication settings. You can customize these settings in Altogic desigler under **App Settings/Authentication**.
 *
 * @export
 * @class AuthManager
 */
class AuthManager extends APIBase_1.APIBase {
    /**
     * Creates an instance of AuthManager to manage your application users and user sessions.
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     * @param {ClientOptions} options Altogic client options
     */
    constructor(fetcher, { localStorage, signInRedirect }) {
        super(fetcher);
        _AuthManager_instances.add(this);
        /**
         * Storage handler to manage local user and session data
         * @type {(ClientStorage)}
         */
        _AuthManager_localStorage.set(this, void 0);
        /**
         * Sign in page url to redirect when the user's session becomes invalid
         * @type {string}
         */
        _AuthManager_signInRedirect.set(this, void 0);
        __classPrivateFieldSet(this, _AuthManager_localStorage, localStorage, "f");
        __classPrivateFieldSet(this, _AuthManager_signInRedirect, signInRedirect, "f");
    }
    /**
     * By default Altogic saves the session and user data in local storage whenever a new session is created (e.g., through sign up or sign in methods). This method clears the locally saved session and user data. In contrast to {@link invalidateSession}, this method does not clear **Session** token request header in {@link Fetcher} and does not redirect to a sign in page.
     */
    clearLocalData() {
        __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
    }
    /**
     * Invalidates the current user session, removes local session data, and clears **Session** token request header in {@link Fetcher}. If **signInRedirect** is specified in {@link ClientOptions} when creating the Altogic api client and if the client is running in a browser, redirects the user to the sign in page.
     */
    invalidateSession() {
        __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
        this.fetcher.clearSession();
        if (globalThis.window && __classPrivateFieldGet(this, _AuthManager_signInRedirect, "f"))
            globalThis.window.location.href = __classPrivateFieldGet(this, _AuthManager_signInRedirect, "f");
    }
    /**
     * Returns the currently active session data from local storage.
     * @returns {(Session | null)}
     */
    getSession() {
        if (__classPrivateFieldGet(this, _AuthManager_localStorage, "f")) {
            const session = __classPrivateFieldGet(this, _AuthManager_localStorage, "f").getItem("session");
            return session ? JSON.parse(session) : null;
        }
        else
            return null;
    }
    /**
     * Returns the user data from local storage.
     * @returns {(User | null)}
     */
    getUser() {
        if (__classPrivateFieldGet(this, _AuthManager_localStorage, "f")) {
            const user = __classPrivateFieldGet(this, _AuthManager_localStorage, "f").getItem("user");
            return user ? JSON.parse(user) : null;
        }
        else
            return null;
    }
    /**
     * Sets (overrides) the active user session. If you use the *signUp* or *signIn* methods of this client library, you do not need to call this method to set the user session, since the client library automatically manages user session data.
     *
     * However if you have more complex sign up or sign in logic, such as 2 factor authentication flow where you authenticate users using a short code, you might need to create your endpoints and associated services to handle these special cases. In those situations, this method becomes handy to update the session data of logged-in users so that the {@link Fetcher} can update its default headers to pass the correct session token in its RESTful API calls.
     *
     * When you use custom authentication logic in your apps, you need to call this service to update session data so that your calls to your app endpoints that require a valid session token do not fail.
     * @returns {void}
     */
    setSession(session) {
        this.fetcher.setSession(session);
        if (__classPrivateFieldGet(this, _AuthManager_localStorage, "f") && session)
            __classPrivateFieldGet(this, _AuthManager_localStorage, "f").setItem("session", JSON.stringify(session));
    }
    /**
     * Saves the user data to local storage. If you use the *signUp* or *signIn* methods of this client library, you do not need to call this method to set the user data, since the client library automatically manages user data.
     *
     * However, if you have not used the *signUp* or *signIn* methods of this client library, this method enables you to update locally stored user data.
     * @returns {void}
     */
    setUser(user) {
        if (__classPrivateFieldGet(this, _AuthManager_localStorage, "f") && user)
            __classPrivateFieldGet(this, _AuthManager_localStorage, "f").setItem("user", JSON.stringify(user));
    }
    /**
     * Creates a new user using the email and password authentication method in the database.
     *
     * If email confirmation is **enabled** in your app authentication settings then a confirm sign up email will be sent to the user with a link to click and this method will return the user data with a `null` session. Until the user clicks this link, the email address will not be verified and a session will not be created. If a user tries to signIn to an account where email has not been confirmed yet, an error message will be retured asking for email verification.
     *
     * After user clicks on the link in confirmation email, Altogic verifies the verification token sent in the email and if the email is verified successfully redirects the user to the redirect URL specified in app authentication settings with an `access_token`. You can use this `access_token` token to get authentication grants, namely the user data and a new session object by calling the {@link getAuthGrant} method.
     *
     * If email confirmation is **disabled**, a newly created session object with the user data will be returned.
     * @param {string} email Unique email address of the user. If there is already a user with the provided email address then an error is reaised.
     * @param {string} password Password of the user, should be at least 6 characters long
     * @param {string} name Name of the user
     * @throws Throws an exception if `email` or `password` is not specified
     */
    signUpWithEmail(email, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("email", email);
            (0, helpers_1.checkRequired)("password", password);
            const { data, errors } = yield this.fetcher.post("/_api/rest/v1/auth/signup-email", {
                email,
                password,
                name,
            });
            if (errors)
                return { user: null, session: null, errors };
            // In case the email confirmation is disabled in app settings then Altogic returns the user and session data,
            // otherwise the session and user data will be null, since the user has to first confirm the email address
            if (data.session) {
                __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
                __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_saveLocalData).call(this, data.user, data.session);
                this.fetcher.setSession(data.session);
            }
            return { user: data.user, session: data.session, errors };
        });
    }
    /**
     * Creates a new user using the mobile phone number and password authentication method in the database.
     *
     * If phone number confirmation is **enabled** in your app authentication settings then a confirmation code SMS will be sent to the phone and this method will return the user data and a `null` session. Until the user validates this code by calling {@link verifyPhone}, the phone number will not be verified. If a user tries to signIn to an account where phone number has not been confirmed yet, an error message will be retured asking for phone number verification.
     *
     * If phone number confirmation is **disabled**, a newly created session object and the user data will be returned.
     * @param {string} phone Unique phone number of the user. If there is already a user with the provided phone number then an error is reaised.
     * @param {string} password Password of the user, should be at least 6 characters long
     * @param {string} name Name of the user
     * @throws Throws an exception if `phone` or `password` is not specified
     */
    signUpWithPhone(phone, password, name) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("phone", phone);
            (0, helpers_1.checkRequired)("password", password);
            const { data, errors } = yield this.fetcher.post("/_api/rest/v1/auth/signup-phone", {
                phone,
                password,
                name,
            });
            if (errors)
                return { user: null, session: null, errors };
            // In case the phone number confirmation is disabled in app settings then Altogic returns the user and session data,
            // otherwise the session and user data will be null, since the user has to first confirm the phone number
            if (data.session) {
                __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
                __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_saveLocalData).call(this, data.user, data.session);
                this.fetcher.setSession(data.session);
            }
            return { user: data.user, session: data.session, errors };
        });
    }
    /**
     * Log in an existing user using email and password. In order to use email and password based log in, the authentication provider needs to be Altogic, meaning a user with email and password credentials exists in the app database.
     *
     * If email confirmation is **enabled** in your app authentication settings and if the email of the user has not been verified yet, this method will return an error message.
     *
     * You cannot use this method to log in a user who has signed up with an Oauth2 provider such as Google, Facebook, Twitter etc.
     *
     * @param {string} email Email of the user
     * @param {string} password Password of the user
     * @throws Throws an exception if `email` or `password` is not specified
     */
    signInWithEmail(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("email", email);
            (0, helpers_1.checkRequired)("password", password);
            const { data, errors } = yield this.fetcher.post("/_api/rest/v1/auth/signin-email", {
                email,
                password,
            });
            if (errors)
                return { user: null, session: null, errors };
            __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
            __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_saveLocalData).call(this, data.user, data.session);
            this.fetcher.setSession(data.session);
            return { user: data.user, session: data.session, errors };
        });
    }
    /**
     * Log in an existing user using phone number and password. In order to use phone and password based log in, the authentication provider needs to be Altogic, meaning a user with phone and password credentials exists in the app database.
     *
     * If phone number confirmation is **enabled** in your app authentication settings and if the phone of the user has not been verified yet, this method will return an error message.
     *
     * @param {string} phone Phone of the user
     * @param {string} password Password of the user
     * @throws Throws an exception if `phone` or `password` is not specified
     */
    signInWithPhone(phone, password) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("phone", phone);
            (0, helpers_1.checkRequired)("password", password);
            const { data, errors } = yield this.fetcher.post("/_api/rest/v1/auth/signin-phone", {
                phone,
                password,
            });
            if (errors)
                return { user: null, session: null, errors };
            __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
            __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_saveLocalData).call(this, data.user, data.session);
            this.fetcher.setSession(data.session);
            return { user: data.user, session: data.session, errors };
        });
    }
    /**
     * Log in an existing user using phone number and SMS code (OTP - one time password) that is sent to the phone. In order to use phone and password based log in, the authentication provider needs to be Altogic, meaning a user with phone and password credentials exists in the app database and *sign in using authorization codes* needs to be **enabled** in your app authentication settings. Before calling this method, you need to call the {@link sendSignInCode} method to get the SMS code delivered to the phone.
     *
     * If successful, this method returns the authorization grants (e.g., session object) of the user.
     *
     * If phone number confirmation is **enabled** in your app authentication settings and if the phone of the user has not been verified yet, this method will return an error message.
     *
     * @param {string} phone Phone of the user
     * @param {string} code SMS code (OTP - one time password)
     * @throws Throws an exception if `phone` or `code` is not specified
     */
    signInWithCode(phone, code) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("phone", phone);
            (0, helpers_1.checkRequired)("code", code);
            const { data, errors } = yield this.fetcher.post(`/_api/rest/v1/auth/signin-code?code=${code}&phone=${encodeURIComponent(phone)}`);
            if (errors)
                return { user: null, session: null, errors };
            __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
            __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_saveLocalData).call(this, data.user, data.session);
            this.fetcher.setSession(data.session);
            return { user: data.user, session: data.session, errors };
        });
    }
    /**
     * Signs in a user using the Oauth2 flow of the specified provider. Calling this method with the name of the sign in provider will redirect user to the relevant login page of the provider.
     *
     * If the provider sign in completes successfully, Altogic directs the user to the redirect URL with an access token that you can use to fetch the authentication grants (e.g., user and session data).
     *
     * If this is the first time a user is using this provider then a new user record is creted in the database, otherwise the lastLoginAt field value of the existing user record is updated.
     * @param {string} provider
     * @throws Throws an exception if `provider` is not specified
     */
    signInWithProvider(provider) {
        (0, helpers_1.checkRequired)("provider", provider);
        if (globalThis.window)
            globalThis.window.location.href = `${this.fetcher.getBaseUrl()}/_auth/${provider}`;
    }
    /**
     * If an input token is <u>not</u> provided, signs out the user from the current session, clears user and session data in local storage and removes the **Session** header in {@link Fetcher}. Otherwise, signs out the user from the session identified by the input token.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} [token] Session token which uniquely identifies a user session
     */
    signOut(sessionToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { errors } = yield this.fetcher.post("/_api/rest/v1/auth/signout", {
                    token: sessionToken,
                });
                // Get current session
                const session = this.getSession();
                // Clear local user and session data if we are signing out from current session or signed out session token matches with current session token
                if (!errors &&
                    (!sessionToken || (session && sessionToken === session.token))) {
                    __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
                    this.fetcher.clearSession();
                }
                return { errors };
            }
            catch (err) {
                return { errors: null };
            }
        });
    }
    /**
     * A user can have multiple active sessions (e.g., logged in form multiple different devices, browsers). This method signs out users from all their active sessions. For the client that triggers this method, also clears user and session data in local storage, and removes the **Session** header in {@link Fetcher}.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    signOutAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const { errors } = yield this.fetcher.post("/_api/rest/v1/auth/signout-all");
            // Clear local user and session data
            if (!errors) {
                __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
                this.fetcher.clearSession();
            }
            return { errors };
        });
    }
    /**
     * Signs out users from all their active sessions except the current one which makes the api call.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    signOutAllExceptCurrent() {
        return __awaiter(this, void 0, void 0, function* () {
            const { errors } = yield this.fetcher.post("/_api/rest/v1/auth/signout-all-except");
            return { errors };
        });
    }
    /**
     * Gets all active sessions of a user.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    getAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, errors } = yield this.fetcher.get("/_api/rest/v1/auth/sessions");
            return { sessions: data, errors };
        });
    }
    /**
     * Retrieves the user associated with the active session from the database.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    getUserFromDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, errors } = yield this.fetcher.get("/_api/rest/v1/auth/user");
            return { user: data, errors };
        });
    }
    /**
     * Changes the password of the user.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} newPassword The new password of the user
     * @param {string} oldPassword The current password of the user
     * @throws Throws an exception if `newPassword` or `oldPassword` is not specified
     */
    changePassword(newPassword, oldPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("newPassword", newPassword);
            (0, helpers_1.checkRequired)("oldPassword", oldPassword);
            const { errors } = yield this.fetcher.post("/_api/rest/v1/auth/change-pwd", {
                newPassword,
                oldPassword,
            });
            return { errors };
        });
    }
    /**
     * Retrieves the authorization grants of a user using the specified input `accessToken`. If no `accessToken` specified as input, tries to retrieve the `accessToken` from the browser url query string parameter named 'access_token'.
     *
     * If successful this method also saves the user and session data to local storage and sets the **Session** header in {@link Fetcher}
     * @param {string} accessToken The access token that will be used to get the authorization grants of a user
     * @throws Throws an exception if `accessToken` is not specified
     */
    getAuthGrant(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenStr = accessToken ? accessToken : (0, helpers_1.getParamValue)("access_token");
            (0, helpers_1.checkRequired)("accessToken", tokenStr);
            const { data, errors } = yield this.fetcher.get(`/_api/rest/v1/auth/grant?key=${tokenStr}`);
            if (errors)
                return { user: null, session: null, errors };
            __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
            __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_saveLocalData).call(this, data.user, data.session);
            this.fetcher.setSession(data.session);
            return { user: data.user, session: data.session, errors };
        });
    }
    /**
     * Resends the email to verify the user's email address. If the user's email has already been validated or email confirmation is **disabled** in your app authentication settings, it returns an error.
     * @param {string} email The email address of the user to send the verification email
     * @throws Throws an exception if `email` is not specified
     */
    resendVerificationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("email", email);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/auth/resend?email=${email}`);
            return { errors };
        });
    }
    /**
     * Resends the code to verify the user's phone number. If the user's phone has already been validated or phone confirmation is **disabled** in your app authentication settings, it returns an error.
     * @param {string} phone The phone number of the user to send the verification SMS code
     * @throws Throws an exception if `phone` is not specified
     */
    resendVerificationCode(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("phone", phone);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/auth/resend-code?phone=${encodeURIComponent(phone)}`);
            return { errors };
        });
    }
    /**
     * Sends a magic link to the email of the user.
     *
     * This method works only if email confirmation is **enabled** in your app authentication settings and the user's email address has already been verified.
     *
     * When the user clicks on the link in email, Altogic verifies the validity of the magic link and if successful redirects the user to the redirect URL specified in you app authentication settings with an access token in a query string parameter named 'access_token.' You can call {@link getAuthGrant} method with this access token to create a new session object.
     *
     * If email confirmation is **disabled** in your app authentication settings or if the user's email has not been verified, it returns an error.
     * @param {string} email The email address of the user to send the verification email
     * @throws Throws an exception if `email` is not specified
     */
    sendMagicLinkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("email", email);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/auth/send-magic?email=${email}`);
            return { errors };
        });
    }
    /**
     * Sends an email with a link to reset password.
     *
     * This method works only if email confirmation is **enabled** in your app authentication settings and the user's email address has already been verified.
     *
     * When the user clicks on the link in email, Altogic verifies the validity of the reset-password link and if successful redirects the user to the redirect URL specified in you app authentication settings with an access token in a query string parameter named 'access_token.' At this state your app needs to detect `action=reset-pwd` in the redirect URL and display a password reset form to the user. After getting the new password from the user, you can call {@link resetPwdWithToken} method with the access token and new password to change the password of the user.
     *
     * If email confirmation is **disabled** in your app authentication settings or if the user's email has not been verified, it returns an error.
     * @param {string} email The email address of the user to send the verification email
     * @throws Throws an exception if `email` is not specified
     */
    sendResetPwdEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("email", email);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/auth/send-reset?email=${email}`);
            return { errors };
        });
    }
    /**
     * Sends an SMS code to reset password.
     *
     * This method works only if phone number confirmation is **enabled** in your app authentication settings and the user's phone number has already been verified.
     *
     * After sending the SMS code, you need to display a password reset form to the user. When you get the new password from the user, you can call {@link resetPwdWithCode} method with the phone number of the user, SMS code and new password.
     *
     * If phone number confirmation is **disabled** in your app authentication settings or if the user's phone has not been verified, it returns an error.
     * @param {string} phone The phone number of the user to send the reset password code
     * @throws Throws an exception if `phone` is not specified
     */
    sendResetPwdCode(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("phone", phone);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/auth/send-reset-code?phone=${encodeURIComponent(phone)}`);
            return { errors };
        });
    }
    /**
     * Sends an SMS code (OTP - one time password) that can be used to sign in to the phone number of the user.
     *
     * This method works only if sign in using authorization codes is **enabled** in your app authentication settings and the user's phone number has already been verified.
     *
     * After getting the SMS code you can call the {@link signInWithCode} method. Altogic verifies the validity of the code and if successful returns the auth grants (e.g., session) of the user.
     *
     * If sign in using authorization codes is **disabled** in your app authentication settings or if the user's phone has not been verified, it returns an error.
     * @param {string} phone The phone number of the user to send the SMS code
     * @throws Throws an exception if `phone` is not specified
     */
    sendSignInCode(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("phone", phone);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/auth/send-code?phone=${encodeURIComponent(phone)}`);
            return { errors };
        });
    }
    /**
     * Resets the password of the user using the access token provided through the {@link sendResetPwdEmail} flow.
     * @param {string} accessToken The access token that is retrieved from the redirect URL query string parameter
     * @param {string} newPassword The new password of the user
     * @throws Throws an exception if `accessToken` or `newPassword` is not specified
     */
    resetPwdWithToken(accessToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("accessToken", accessToken);
            (0, helpers_1.checkRequired)("newPassword", newPassword);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/auth/reset-pwd?key=${accessToken}`, {
                newPassword,
            });
            return { errors };
        });
    }
    /**
     * Resets the password of the user using the SMS code provided through the {@link sendResetPwdCode} method.
     * @param {string} phone The phone number of the user
     * @param {string} code The SMS code that is sent to the users phone number
     * @param {string} newPassword The new password of the user
     * @throws Throws an exception if `phone`, `code` or `newPassword` is not specified
     */
    resetPwdWithCode(phone, code, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("phone", phone);
            (0, helpers_1.checkRequired)("code", code);
            (0, helpers_1.checkRequired)("newPassword", newPassword);
            const { errors } = yield this.fetcher.post(`/_api/rest/v1/auth/reset-pwd-code?phone=${encodeURIComponent(phone)}&code=${code}`, {
                newPassword,
            });
            return { errors };
        });
    }
    /**
     * Changes the email of the user to a new one.
     *
     * If email confirmation is **disabled** in your app authentication settings, it immediately updates the user's email and returns back the updated user data.
     *
     * If email confirmation is **enabled** in your app authentication settings, it sends a confirmation email to the new email address with a link for the user to click and returns the current user's info. Until the user clicks on the link, the user's email address will not be changed to the new one.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} currentPassword The password of the user
     * @param {string} newEmail The new email address of the user
     * @throws Throws an exception if `currentPassword` or `newEmail` is not specified
     */
    changeEmail(currentPassword, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("currentPassword", currentPassword);
            (0, helpers_1.checkRequired)("newEmail", newEmail);
            const { data, errors } = yield this.fetcher.post(`/_api/rest/v1/auth/change-email`, {
                currentPassword,
                newEmail,
            });
            return { user: data, errors };
        });
    }
    /**
     * Changes the phone number of the user to a new one.
     *
     * If phone number confirmation is **disabled** in your app authentication settings, it immediately updates the user's phone number and returns back the updated user data.
     *
     * If phone number confirmation is **enabled** in your app authentication settings, it sends a confirmation SMS code to the new phone number and returns the current user's info. After sending the SMS code by calling this method, you need to show a form to the user to enter this SMS code and call `verifyPhone` method with the new phone number and the code to change user's phone number to the new one.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} currentPassword The password of the user
     * @param {string} newPhone The new phone number of the user
     * @throws Throws an exception if `currentPassword` or `newPhone` is not specified
     */
    changePhone(currentPassword, newPhone) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("currentPassword", currentPassword);
            (0, helpers_1.checkRequired)("newPhone", newPhone);
            const { data, errors } = yield this.fetcher.post(`/_api/rest/v1/auth/change-phone`, {
                currentPassword,
                newPhone,
            });
            return { user: data, errors };
        });
    }
    /**
     * Verifies the phone number using code sent in SMS and if verified, returns the auth grants (e.g., user and session data) of the user if the phone is verified due to a new sign up. If the phone is verified using the code send as a result of calling the `changePhone` method, returns the updated user data only.
     *
     * If the code is invalid or expired, it returns an error message.
     * @param {string} phone The mobile phone number of the user where the SMS code was sent
     * @param {string} code The code sent in SMS (e.g., 6-digit number)
     * @throws Throws an exception if `phone` or `code` is not specified
     */
    verifyPhone(phone, code) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, helpers_1.checkRequired)("phone", phone);
            (0, helpers_1.checkRequired)("code", code);
            const { data, errors } = yield this.fetcher.post(`/_api/rest/v1/auth/verify-phone?code=${code}&phone=${encodeURIComponent(phone)}`);
            if (errors)
                return { user: null, session: null, errors };
            // If user sign up with phone
            if (data.session) {
                __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_deleteLocalData).call(this);
                __classPrivateFieldGet(this, _AuthManager_instances, "m", _AuthManager_saveLocalData).call(this, data.user, data.session);
                this.fetcher.setSession(data.session);
                return { user: data.user, session: data.session, errors };
            }
            else {
                // If user phone change
                return { user: data.user, session: null, errors };
            }
        });
    }
}
exports.AuthManager = AuthManager;
_AuthManager_localStorage = new WeakMap(), _AuthManager_signInRedirect = new WeakMap(), _AuthManager_instances = new WeakSet(), _AuthManager_deleteLocalData = function _AuthManager_deleteLocalData() {
    if (__classPrivateFieldGet(this, _AuthManager_localStorage, "f")) {
        __classPrivateFieldGet(this, _AuthManager_localStorage, "f").removeItem("session");
        __classPrivateFieldGet(this, _AuthManager_localStorage, "f").removeItem("user");
    }
}, _AuthManager_saveLocalData = function _AuthManager_saveLocalData(user, session) {
    if (__classPrivateFieldGet(this, _AuthManager_localStorage, "f")) {
        if (session)
            __classPrivateFieldGet(this, _AuthManager_localStorage, "f").setItem("session", JSON.stringify(session));
        if (user)
            __classPrivateFieldGet(this, _AuthManager_localStorage, "f").setItem("user", JSON.stringify(user));
    }
};
//# sourceMappingURL=AuthManager.js.map