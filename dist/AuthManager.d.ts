import { APIBase } from './APIBase';
import { Fetcher } from './utils/Fetcher';
import { ClientOptions, User, Session, APIError } from './types';
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
export declare class AuthManager extends APIBase {
    #private;
    /**
     * Creates an instance of AuthManager to manage your application users and user sessions.
     * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
     * @param {ClientOptions} options Altogic client options
     */
    constructor(fetcher: Fetcher, { localStorage, signInRedirect }: ClientOptions);
    /**
     * Invalidates the current user session, removes local session data, and clears **Session** token request header in {@link Fetcher}. If **signInRedirect** is specified in {@link ClientOptions} when creating the Altogic api client and if the client is running in a browser, redirects the user to the sign in page.
     */
    invalidateSession(): void;
    /**
     * Returns the currently active session data from local storage.
     * @returns {(Session | null)}
     */
    getSession(): Session | null;
    /**
     * Returns the user data from local storage.
     * @returns {(User | null)}
     */
    getUser(): User | null;
    /**
     * Sets (overrides) the active user session. If you use the *signUp* or *signIn* methods of this client library, you do not need to call this method to set the user session, since the client library automatically manages user session data.
     *
     * However if you have more complex sign up or sign in logic, such as 2 factor authentication flow where you authenticate users using a short code, you might need to create your endpoints and associated services to handle these special cases. In those situations, this method becomes handy to update the session data of logged-in users so that the {@link Fetcher} can update its default headers to pass the correct session token in its RESTful API calls.
     *
     * When you use custom authentication logic in your apps, you need to call this service to update session data so that your calls to your app endpoints that require a valid session token do not fail.
     * @returns {void}
     */
    setSession(session: Session): void;
    /**
     * Saves the user data to local storage. If you use the *signUp* or *signIn* methods of this client library, you do not need to call this method to set the user data, since the client library automatically manages user data.
     *
     * However, if you have not used the *signUp* or *signIn* methods of this client library, this method enables you to update locally stored user data.
     * @returns {void}
     */
    setUser(user: User): void;
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
    signUpWithEmail(email: string, password: string, name?: string): Promise<{
        user: User | null;
        session: Session | null;
        errors: APIError | null;
    }>;
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
    signUpWithPhone(phone: string, password: string, name?: string): Promise<{
        user: User | null;
        session: Session | null;
        errors: APIError | null;
    }>;
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
    signInWithEmail(email: string, password: string): Promise<{
        user: User | null;
        session: Session | null;
        errors: APIError | null;
    }>;
    /**
     * Log in an existing user using phone number and password. In order to use phone and password based log in, the authentication provider needs to be Altogic, meaning a user with phone and password credentials exists in the app database.
     *
     * If phone number confirmation is **enabled** in your app authentication settings and if the phone of the user has not been verified yet, this method will return an error message.
     *
     * @param {string} phone Phone of the user
     * @param {string} password Password of the user
     * @throws Throws an exception if `phone` or `password` is not specified
     */
    signInWithPhone(phone: string, password: string): Promise<{
        user: User | null;
        session: Session | null;
        errors: APIError | null;
    }>;
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
    signInWithCode(phone: string, code: string): Promise<{
        user: User | null;
        session: Session | null;
        errors: APIError | null;
    }>;
    /**
     * Signs in a user using the Oauth2 flow of the specified provider. Calling this method with the name of the sign in provider will redirect user to the relevant login page of the provider.
     *
     * If the provider sign in completes successfully, Altogic directs the user to the redirect URL with an access token that you can use to fetch the authentication grants (e.g., user and session data).
     *
     * If this is the first time a user is using this provider then a new user record is creted in the database, otherwise the lastLoginAt field value of the existing user record is updated.
     * @param {string} provider
     * @throws Throws an exception if `provider` is not specified
     */
    signInWithProvider(provider: 'google' | 'facebook' | 'twitter' | 'discord' | 'github'): void;
    /**
     * If an input token is <u>not</u> provided, signs out the user from the current session, clears user and session data in local storage and removes the **Session** header in {@link Fetcher}. Otherwise, signs out the user from the session identified by the input token.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} [token] Session token which uniquely identifies a user session
     */
    signOut(sessionToken?: string): Promise<{
        errors: APIError | null;
    }>;
    /**
     * A user can have multiple active sessions (e.g., logged in form multiple different devices, browsers). This method signs out users from all their active sessions. For the client that triggers this method, also clears user and session data in local storage, and removes the **Session** header in {@link Fetcher}.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    signOutAll(): Promise<{
        errors: APIError | null;
    }>;
    /**
     * Signs out users from all their active sessions except the current one which makes the api call.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    signOutAllExceptCurrent(): Promise<{
        errors: APIError | null;
    }>;
    /**
     * Gets all active sessions of a user.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    getAllSessions(): Promise<{
        sessions: Session[] | null;
        errors: APIError | null;
    }>;
    /**
     * Retrieves the user associated with the active session from the database.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     */
    getUserFromDB(): Promise<{
        user: User | null;
        errors: APIError | null;
    }>;
    /**
     * Changes the password of the user.
     *
     * > *An active user session is required (e.g., user needs to be logged in) to call this method.*
     * @param {string} newPassword The new password of the user
     * @param {string} oldPassword The current password of the user
     * @throws Throws an exception if `newPassword` or `oldPassword` is not specified
     */
    changePassword(newPassword: string, oldPassword: string): Promise<{
        errors: APIError | null;
    }>;
    /**
     * Retrieves the authorization grants of a user using the specified input `accessToken`. If no `accessToken` specified as input, tries to retrieve the `accessToken` from the browser url query string parameter named 'access_token'.
     *
     * If successful this method also saves the user and session data to local storage and sets the **Session** header in {@link Fetcher}
     * @param {string} accessToken The access token that will be used to get the authorization grants of a user
     * @throws Throws an exception if `accessToken` is not specified
     */
    getAuthGrant(accessToken?: string): Promise<{
        user: User | null;
        session: Session | null;
        errors: APIError | null;
    }>;
    /**
     * Resends the email to verify the user's email address. If the user's email has already been validated or email confirmation is **disabled** in your app authentication settings, it returns an error.
     * @param {string} email The email address of the user to send the verification email
     * @throws Throws an exception if `email` is not specified
     */
    resendVerificationEmail(email: string): Promise<{
        errors: APIError | null;
    }>;
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
    sendMagicLinkEmail(email: string): Promise<{
        errors: APIError | null;
    }>;
    /**
     * Sends an email with a link to reset password.
     *
     * This method works only if email confirmation is **enabled** in your app authentication settings and the user's email address has already been verified.
     *
     * When the user clicks on the link in email, Altogic verifies the validity of the reset-password link and if successful redirects the user to the redirect URL specified in you app authentication settings with an access token in a query string parameter named 'access_token.' At this state your app needs to detect `action=reset-pwd` in the redirect URL and display a password reset form to the user. After getting the new password from the user, you can call {@link resetPassword} method with the access token and new password to change the password of the user.
     *
     * If email confirmation is **disabled** in your app authentication settings or if the user's email has not been verified, it returns an error.
     * @param {string} email The email address of the user to send the verification email
     * @throws Throws an exception if `email` is not specified
     */
    sendResetPwdEmail(email: string): Promise<{
        errors: APIError | null;
    }>;
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
    sendSignInCode(phone: string): Promise<{
        errors: APIError | null;
    }>;
    /**
     * Resets the password of the user using the access token provided through the {@link sendResetPwdEmail} flow.
     * @param {string} accessToken The access token that is retrieved from the redirect URL query string parameter
     * @param {string} newPassword The new password of the user
     * @throws Throws an exception if `accessToken` or `newPassword` is not specified
     */
    resetPassword(accessToken: string, newPassword: string): Promise<{
        errors: APIError | null;
    }>;
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
    changeEmail(currentPassword: string, newEmail: string): Promise<{
        user: User | null;
        errors: APIError | null;
    }>;
    /**
     * Verifies the phone number using code sent in SMS and if verified, returns the auth grants (e.g., session) of the user.
     *
     * If the code is invalid or expired, it returns an error message.
     * @param {string} phone The mobile phone number of the user where the SMS code was sent
     * @param {string} code The code sent in SMS (e.g., 6-digit number)
     * @throws Throws an exception if `phone` or `code` is not specified
     */
    verifyPhone(phone: string, code: string): Promise<{
        user: User | null;
        session: Session | null;
        errors: APIError | null;
    }>;
}
//# sourceMappingURL=AuthManager.d.ts.map