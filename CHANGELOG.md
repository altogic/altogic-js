# Changelog

All notable changes to this project will be documented in this file.

### 1.3.0 (2022-05-08)

-  Added `getStats` method to `CacheManager`
-  Updated CacheManager `delete` method, delete method now also accepts array of keys
-  Changed the error handling structure, now the client library does not throw any exceptions
   locally when checking required fields of a method. Only exclusion to this is the `createClient`
   method which can throw an exception in case of missing baseUrl or clientKey
-  Added `getStats` method to `DatabaseManager`
-  Added two new methods to AuthManager `setSessionCookie` and `removeSessionCookie` to set the
   session token cookie that is passed between the client and server. Particularly useful in server
   side rendered apps (e.g., Next.js)

### 1.2.2 (2022-04-18)

-  Fixed the localstorage data deletion problem in `verifyPhone` method. With this fix, the
   verifyPhone method does not clear local session or user data in case the user's phone has been
   successfully changed.

### 1.2.1 (2022-04-11)

-  Fixed bug in error response format

### 1.2.0 (2022-04-09)

-  Added `changePhone` method to **auth** module which either initiaties the phone number change
   flow if phone number confirmation is enabled in app authentication settings otherwise, directly
   updates the phone number and retuns the updated user object
-  Updated `verifyPhone` method in **auth** module to accept SMS codes to process phone number
   changes
-  Added `sendResetPwdCode` method to **auth** module which sends an SMS code to reset user's
   password
-  Added `resetPwdWithCode` method to **auth** module which uses the SMS code sent using
   `sendResetPwdCode` method to reset the password of the user
-  Renamed method `resetPassword` to `resetPwdWithToken`
-  Added `createBucket` option to `FileUploadOptions` in `upload` method of **BucketManager**. With
   this new option while uploading a file, you can create a new bucket with the provided name if the
   bucket does not exists.
-  Added `30sec` `1min` `2mins` `5mins` `10mins` caching options

### 1.1.1 (2022-04-06)

-  Added `resendVerificationCode` to **auth** module which resends the phone number verification SMS
   message

### 1.1.0 (2022-04-05)

-  Added `clearLocalData` to **auth** module which deletes the locally stored user and session data

### 1.0.9 (2022-03-21)

-  Fixed a bug in `FileManager` `replace` method which prevented file being replaced with the new
   one one

### 1.0.8 (2022-02-19)

-  Added the new `search` method to the `db` module which performs a text search of string content

### 1.0.7 (2022-02-13)

-  Updates to documentation

### 1.0.6 (2022-02-12)

-  Added support for UMD (webpack added to development dependencies)

### 1.0.5 (2022-02-12)

-  Documetnation updated

### 1.0.4 (2022-02-11)

-  Initial version of Altogic client library
