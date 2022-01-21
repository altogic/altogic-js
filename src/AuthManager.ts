import { Fetcher } from './utils/Fetcher';
import { ClientOptions, ClientStorage, User, Session, APIError } from './types';
import { getParamValue, checkRequired } from './utils/helpers';

/**
 * Handles the authentication process of your application users. Provides methods to manage users, sessions and authentication.
 * @export
 * @class AuthManager
 */
export class AuthManager {
   /**
    * The http client to make RESTful API calls to the application's execution engine
    * @private
    * @type {Fetcher}
    */
   #fetcher: Fetcher;

   /**
    * Storage handler to manage local user and session data
    * @type {(ClientStorage)}
    */
   #localStorage?: ClientStorage;

   /**
    * Sign in page url to redirect when the user's session becomes invalid
    * @type {string}
    */
   #signInRedirect?: string;

   /**
    * Creates an instance of AuthManager to manage your application users and user sessions.
    * @param {Fetcher} fetcher The http client to make RESTful API calls to the application's execution engine
    * @param {ClientOptions} options Altogic client options
    */
   constructor(fetcher: Fetcher, { localStorage, signInRedirect }: ClientOptions) {
      this.#fetcher = fetcher;
      this.#localStorage = localStorage;
      this.#signInRedirect = signInRedirect;
   }

   /**
    * Deletes the currently active session and user data in local storage.
    */
   #deleteLocalData(): void {
      if (this.#localStorage) {
         this.#localStorage.removeItem('session');
         this.#localStorage.removeItem('user');
      }
   }

   /**
    * Saves the session and user data to the local storage.
    * @param {User} user The user data
    * @param {Session} session The session data
    */
   #saveLocalData(user: User, session: Session): void {
      if (this.#localStorage) {
         if (session) this.#localStorage.setItem('session', JSON.stringify(session));
         if (user) this.#localStorage.setItem('user', JSON.stringify(user));
      }
   }

   /**
    * Invalidates the current user session, removes local session data, and clears **Session** token request header in {@link Fetcher}. If **signInRedirect** is specified in {@link ClientOptions} when creating the Altogic api client and if the client is running in a browser, redirects the user to the sign in page.
    */
   invalidateSession(): void {
      this.#deleteLocalData();
      this.#fetcher.clearSession();

      if (globalThis.window && this.#signInRedirect)
         globalThis.window.location.href = this.#signInRedirect;
   }

   /**
    * Returns the currently active session data from local storage.
    * @returns {(Session | null)}
    */
   getSession(): Session | null {
      if (this.#localStorage) {
         let session = this.#localStorage.getItem('session');
         return session ? JSON.parse(session) : null;
      } else return null;
   }

   /**
    * Returns the user data from local storage.
    * @returns {(User | null)}
    */
   getUser(): User | null {
      if (this.#localStorage) {
         let user = this.#localStorage.getItem('user');
         return user ? JSON.parse(user) : null;
      } else return null;
   }

   /**
    * Sets (overrides) the active user session. If you use the *signUp* or *signIn* methods of this client library, you do not need to call this method to set the user session, since the client library automatically manages user session data.
    *
    * However if you have more complex sign up or sign in logic, such as 2 factor authentication flow where you authenticate users using a short code, you might need to create your endpoints and associated services to handle these special cases. In those situations, this method becomes handy to update the session data of logged-in users so that the {@link Fetcher} can update its default headers to pass the correct session token in its RESTful API calls.
    *
    * When you use custom authentication logic in your apps, you need to call this service to update session data so that your calls to your app endpoints that require a valid session token do not fail.
    * @returns {void}
    */
   setSession(session: Session): void {
      this.#fetcher.setSession(session);
      if (this.#localStorage && session)
         this.#localStorage.setItem('session', JSON.stringify(session));
   }

   /**
    * Saves the user data to local storage. If you use the *signUp* or *signIn* methods of this client library, you do not need to call this method to set the user data, since the client library automatically manages user data.
    *
    * However, if you have not used the *signUp* or *signIn* methods of this client library, this method enables you to update locally stored user data.
    * @returns {void}
    */
   setUser(user: User): void {
      if (this.#localStorage && user) this.#localStorage.setItem('user', JSON.stringify(user));
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
    */
   async signUpWithEmail(
      email: string,
      password: string,
      name?: string
   ): Promise<{ user: User | null; session: Session | null; errors: APIError | null }> {
      checkRequired('email', email);
      checkRequired('password', password);

      let { data, errors } = await this.#fetcher.post('/_api/rest/v1/auth/signup-email', {
         email,
         password,
         name,
      });

      if (errors) return { user: null, session: null, errors: errors };

      //In case the email confirmation is disabled in app settings then Altogic returns the user and session data,
      //otherwise the session and user data will be null, since the user has to first confirm the email address
      if (data.session) {
         this.#deleteLocalData();
         this.#saveLocalData(data.user, data.session);
         this.#fetcher.setSession(data.session);
      }

      return { user: data.user, session: data.session, errors: errors };
   }

   /**
    * Creates a new user using the mobile phone number and password authentication method in the database.
    *
    * If phone number confirmation is **enabled** in your app authentication settings then a confirmation code SMS will be sent to the phone and this method will return the user data and a `null` session. Until the user validates this code by calling {@link verifyPhone}, the phone number will not be verified. If a user tries to signIn to an account where phone number has not been confirmed yet, an error message will be retured asking for phone number verification.
    *
    * If phone number confirmation is **disabled**, a newly created session object and the user data will be returned.
    * @param {string} phone Unique email address of the user. If there is already a user with the provided email address then an error is reaised.
    * @param {string} password Password of the user, should be at least 6 characters long
    * @param {string} name Name of the user
    */
   async signUpWithPhone(
      phone: string,
      password: string,
      name?: string
   ): Promise<{ user: User | null; session: Session | null; errors: APIError | null }> {
      checkRequired('phone', phone);
      checkRequired('password', password);

      let { data, errors } = await this.#fetcher.post('/_api/rest/v1/auth/signup-phone', {
         phone,
         password,
         name,
      });

      if (errors) return { user: null, session: null, errors: errors };

      //In case the phone number confirmation is disabled in app settings then Altogic returns the user and session data,
      //otherwise the session and user data will be null, since the user has to first confirm the phone number
      if (data.session) {
         this.#deleteLocalData();
         this.#saveLocalData(data.user, data.session);
         this.#fetcher.setSession(data.session);
      }

      return { user: data.user, session: data.session, errors: errors };
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
    */
   async signInWithEmail(
      email: string,
      password: string
   ): Promise<{ user: User | null; session: Session | null; errors: APIError | null }> {
      checkRequired('email', email);
      checkRequired('password', password);

      let { data, errors } = await this.#fetcher.post('/_api/rest/v1/auth/signin-email', {
         email,
         password,
      });

      if (errors) return { user: null, session: null, errors: errors };

      this.#deleteLocalData();
      this.#saveLocalData(data.user, data.session);
      this.#fetcher.setSession(data.session);
      return { user: data.user, session: data.session, errors: errors };
   }

   /**
    * Log in an existing user using phone number and password. In order to use phone and password based log in, the authentication provider needs to be Altogic, meaning a user with phone and password credentials exists in the app database.
    *
    * If phone number confirmation is **enabled** in your app authentication settings and if the phone of the user has not been verified yet, this method will return an error message.
    *
    * @param {string} phone Phone of the user
    * @param {string} password Password of the user
    */
   async signInWithPhone(
      phone: string,
      password: string
   ): Promise<{ user: User | null; session: Session | null; errors: APIError | null }> {
      checkRequired('phone', phone);
      checkRequired('password', password);

      let { data, errors } = await this.#fetcher.post('/_api/rest/v1/auth/signin-phone', {
         phone,
         password,
      });

      if (errors) return { user: null, session: null, errors: errors };

      this.#deleteLocalData();
      this.#saveLocalData(data.user, data.session);
      this.#fetcher.setSession(data.session);
      return { user: data.user, session: data.session, errors: errors };
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
    */
   async signInWithCode(
      phone: string,
      code: string
   ): Promise<{ user: User | null; session: Session | null; errors: APIError | null }> {
      checkRequired('phone', phone);
      checkRequired('code', code);

      let { data, errors } = await this.#fetcher.post(
         `/_api/rest/v1/auth/signin-code?code=${code}&phone=${encodeURIComponent(phone)}`
      );

      if (errors) return { user: null, session: null, errors: errors };

      this.#deleteLocalData();
      this.#saveLocalData(data.user, data.session);
      this.#fetcher.setSession(data.session);
      return { user: data.user, session: data.session, errors: errors };
   }

   /**
    * Signs in a user using the Oauth2 flow of the specified provider. Calling this method with the name of the sign in provider will redirect user to the relevant login page of the provider.
    *
    * If the provider sign in completes successfully, Altogic directs the user to the redirect URL with an access token that you can use to fetch the authentication grants (e.g., user and session data).
    *
    * If this is the first time a user is using this provider then a new user record is creted in the database, otherwise the lastLoginAt field value of the existing user record is updated.
    * @param {string} provider
    */
   signInWithProvider(provider: 'google' | 'facebook' | 'twitter' | 'discord' | 'github'): void {
      checkRequired('provider', provider);

      if (globalThis.window)
         globalThis.window.location.href = `${this.#fetcher.getBaseUrl()}/_auth/${provider}`;
   }

   /**
    * If an input token is <u>not</u> provided, signs out the user from the current session, clears user and session data in local storage and removes the **Session** header in {@link Fetcher}. Otherwise, signs out the user from the session identified by the input token.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    * @param {string} [token] Session token which uniquely identifies a user session
    */
   async signOut(sessionToken?: string): Promise<{ errors: APIError | null }> {
      try {
         let { errors } = await this.#fetcher.post('/_api/rest/v1/auth/signout', {
            token: sessionToken,
         });

         //Get current session
         let session = this.getSession();
         //Clear local user and session data if we are signing out from current session or signed out session token matches with current session token
         if (!errors && (!sessionToken || (session && sessionToken === session.token))) {
            this.#deleteLocalData();
            this.#fetcher.clearSession();
         }

         return { errors };
      } catch (err) {
         return { errors: null };
      }
   }

   /**
    * A user can have multiple active sessions (e.g., logged in form multiple different devices, browsers). This method signs out users from all their active sessions. For the client that triggers this method, also clears user and session data in local storage, and removes the **Session** header in {@link Fetcher}.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    */
   async signOutAll(): Promise<{ errors: APIError | null }> {
      let { errors } = await this.#fetcher.post('/_api/rest/v1/auth/signout-all');

      //Clear local user and session data
      if (!errors) {
         this.#deleteLocalData();
         this.#fetcher.clearSession();
      }

      return { errors };
   }

   /**
    * Signs out users from all their active sessions except the current one which makes the api call.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    */
   async signOutAllExceptCurrent(): Promise<{ errors: APIError | null }> {
      let { errors } = await this.#fetcher.post('/_api/rest/v1/auth/signout-all-except');

      return { errors };
   }

   /**
    * Gets all active sessions of a user.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    */
   async getAllSessions(): Promise<{ sessions: Session[] | null; errors: APIError | null }> {
      let { data, errors } = await this.#fetcher.get('/_api/rest/v1/auth/sessions');
      return { sessions: data, errors: errors };
   }

   /**
    * Retrieves the user associated with the active session from the database.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    */
   async getUserFromDB(): Promise<{ user: User | null; errors: APIError | null }> {
      let { data, errors } = await this.#fetcher.get('/_api/rest/v1/auth/user');
      return { user: data, errors: errors };
   }

   /**
    * Changes the password of the user.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    * @param {string} newPassword The new password of the user
    * @param {string} oldPassword The current password of the user
    */
   async changePassword(
      newPassword: string,
      oldPassword: string
   ): Promise<{ errors: APIError | null }> {
      checkRequired('newPassword', newPassword);
      checkRequired('oldPassword', oldPassword);

      let { errors } = await this.#fetcher.post('/_api/rest/v1/auth/change-pwd', {
         newPassword,
         oldPassword,
      });
      return { errors: errors };
   }

   /**
    * Retrieves the authorization grants of a user using the specified input `accessToken`. If no `accessToken` specified as input, tries to retrieve the `accessToken` from the browser url query string parameter named 'access_token'.
    *
    * If successful this method also saves the user and session data to local storage and sets the **Session** header in {@link Fetcher}
    * @param {string} accessToken The access token that will be used to get the authorization grants of a user
    */
   async getAuthGrant(
      accessToken?: string
   ): Promise<{ user: User | null; session: Session | null; errors: APIError | null }> {
      let tokenStr = accessToken ? accessToken : getParamValue('access_token');
      checkRequired('accessToken', tokenStr);

      let { data, errors } = await this.#fetcher.get(`/_api/rest/v1/auth/grant?key=${tokenStr}`);

      if (errors) return { user: null, session: null, errors: errors };

      this.#deleteLocalData();
      this.#saveLocalData(data.user, data.session);
      this.#fetcher.setSession(data.session);
      return { user: data.user, session: data.session, errors: errors };
   }

   /**
    * Resends the email to verify the user's email address. If the user's email has already been validated or email confirmation is **disabled** in your app authentication settings, it returns an error.
    * @param {string} email The email address of the user to send the verification email
    */
   async resendVerificationEmail(email: string): Promise<{ errors: APIError | null }> {
      checkRequired('email', email);

      let { errors } = await this.#fetcher.post(`/_api/rest/v1/auth/resend?email=${email}`);
      return { errors: errors };
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
    */
   async sendMagicLinkEmail(email: string): Promise<{ errors: APIError | null }> {
      checkRequired('email', email);

      let { errors } = await this.#fetcher.post(`/_api/rest/v1/auth/send-magic?email=${email}`);
      return { errors: errors };
   }

   /**
    * Sends an email with a link to reset password.
    *
    * This method works only if email confirmation is **enabled** in your app authentication settings and the user's email address has already been verified.
    *
    * When the user clicks on the link in email, Altogic verifies the validity of the reset-password link and if successful redirects the user to the redirect URL specified in you app authentication settings with an access token in a query string parameter named 'access_token.' At this state your app needs to detect action=reset-password in the redirect URL and display a password reset form to the user. After getting the new password from the user, you can call {@link resetPassword} method with the access token and new password to change the password of the user.
    *
    * If email confirmation is **disabled** in your app authentication settings or if the user's email has not been verified, it returns an error.
    * @param {string} email The email address of the user to send the verification email
    */
   async sendResetPwdEmail(email: string): Promise<{ errors: APIError | null }> {
      checkRequired('email', email);

      let { errors } = await this.#fetcher.post(`/_api/rest/v1/auth/send-reset?email=${email}`);
      return { errors: errors };
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
    */
   async sendSignInCode(phone: string): Promise<{ errors: APIError | null }> {
      checkRequired('phone', phone);

      let { errors } = await this.#fetcher.post(
         `/_api/rest/v1/auth/send-code?phone=${encodeURIComponent(phone)}`
      );
      return { errors: errors };
   }

   /**
    * Resets the password of the user using the access token provided through the {@link sendResetPwdEmail} flow.
    * @param {string} accessToken The access token that is retrieved from the redirect URL query string parameter
    * @param {string} newPassword The new password of the user
    */
   async resetPassword(
      accessToken: string,
      newPassword: string
   ): Promise<{ errors: APIError | null }> {
      checkRequired('accessToken', accessToken);
      checkRequired('newPassword', newPassword);

      let { errors } = await this.#fetcher.post(`/_api/rest/v1/auth/reset-pwd?key=${accessToken}`, {
         newPassword,
      });
      return { errors: errors };
   }

   /**
    * Changes the email of the user to a new one.
    *
    * If email confirmation is **disabled** in your app authentication settings, it immediately updates the user's email and returns back the updated user data.
    *
    * If email confirmation is **enabled** in your app authentication settings, it sends a confirmation email to the new email address with a link for the user to click and returns the current user's info. Until the user clicks on the link, the user's email address will not be changed to the new one.
    *
    * *An active user session is required (e.g., user needs to be logged in) to call this method.*
    * @param {string} currentPassword The password of the user
    * @param {string} newEmail The new email address of the user
    */
   async changeEmail(
      currentPassword: string,
      newEmail: string
   ): Promise<{ user: User | null; errors: APIError | null }> {
      checkRequired('currentPassword', currentPassword);
      checkRequired('newEmail', newEmail);

      let { data, errors } = await this.#fetcher.post(`/_api/rest/v1/auth/change-email`, {
         currentPassword,
         newEmail,
      });

      return { user: data, errors: errors };
   }

   /**
    * Verifies the phone number using code sent in SMS and if verified, returns the auth grants (e.g., session) of the user.
    *
    * If the code is invalid or expired, it returns an error message.
    * @param {string} phone The mobile phone number of the user where the SMS code was sent
    * @param {string} code The code sent in SMS (e.g., 6-digit number)
    */
   async verifyPhone(
      phone: string,
      code: string
   ): Promise<{ user: User | null; session: Session | null; errors: APIError | null }> {
      checkRequired('phone', phone);
      checkRequired('code', code);

      let { data, errors } = await this.#fetcher.post(
         `/_api/rest/v1/auth/verify-phone?code=${code}&phone=${encodeURIComponent(phone)}`
      );

      if (errors) return { user: null, session: null, errors: errors };

      this.#deleteLocalData();
      this.#saveLocalData(data.user, data.session);
      this.#fetcher.setSession(data.session);
      return { user: data.user, session: data.session, errors: errors };
   }
}
