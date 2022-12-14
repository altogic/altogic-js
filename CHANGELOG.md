# Changelog

All notable changes to this project will be documented in this file.

### 2.3.9 (2022-12-14)

-  Added XMLHttpRequest control to the `Fetcher.upload` method.

### 2.3.8 (2022-11-25)

-  Updated type definitions for typescript, marked fields which require object or array of objects.

### 2.3.7 (2022-11-25)

-  Updated type definitions for typescript, marked fields which are optional.

### 2.3.6 (2022-11-23)

-  Documentation updates. The `AuthManager.signUpWithEmail` and `AuthManager.signUpWithPhone` can now accept `emailVerified` and `phoneVerified` field values to be passed in the last parameter of the methods. If you set either `emailVerified` or `phoneVerified` to true, email or phone number verification step is bypassed even the email or phone verification is enabled in application authentication settings.

### 2.3.5 (2022-11-15)

-  Documentation updates.

### 2.3.4 (2022-11-15)

-  Support for sign in with Apple.

### 2.3.1 (2022-11-15)

-  Minor bug fix to join channels when reconnected.

### 2.3.0 (2022-11-15)

-  `RealtimeManager.getMembers` method has been updated to to use a REST API call to fetch channel members. As a response this method receives a JSON object with data and error fields. If successful data holds the array of channel member profiles and error is set to null/undefined. In case of error data is returned as null/undefined and error holds the error information.

### 2.2.3 (2022-10-17)

-  `BucketManager.upload` method has been updated to mark `FileUploadOptions` parameter as optional

### 2.2.2 (2022-09-11)

-  Fixed browser not found error when installing Altogic client library through CDN. 

### 2.2.1 (2022-09-09)

-  Fixed browser not found error when installing Altogic client library through CDN. 

### 2.2.0 (2022-09-07)

-  Added full-text (fuzzy) search method to `QueryBuilder`. 
-  The `QueryBuilder.compute` method now supports pagination. You can add `page` and `limit` modifiers to your `compute` methods. Additionally, you can also specify the sort direction (either `asc` or `desc`) in `GroupComputation`.

### 2.1.0 (2022-08-22)

-  Added delay parameter to `QueueManager.submitMessage` which delays the messages in queue by specified duration (in seconds) before dispatching them to their consuming service

### 2.0.1 (2022-08-08)

-  Minor documentation updates
-  Check for listeners in realtime module. If the listener is null or undefined, the realtime module does not register the listener anymore

### 2.0.0 (2022-08-08)

-  Added the new `RealtimeManager` module to support websockets based realtime apps
-  Updated the  `ClientOptions` to include realtime parameters
-  Updated `AuthManager.signUpWithEmail` and `AuthManager.signUpWithPhone` methods. Besides the name of the user, these methods now allow input of additional user field values during the sign up process.

### 1.4.0 (2022-05-27)

-  The bucket and file metadata now includes `tags` and `userId` fields. Tags are array of strings that you can use to assign custom information to your buckets and uploaded files. userId is used to store the identifier of the user that who has created the bucket or uploaded the file. If a new bucket or file is created in your app's cloud storage and if the related client library method is exectued within the context of a user session, then the userId field is automaticallly populated with the userId of the active sessions and added to respective bucket or file object
-  Updated `StorageManager.searchFiles`, `StorageManager.listBuckets` and `BucketManager.listFiles` methods. These methods can now accept `userId` and `tags` fields in filter expressions.
-  Added `updateInfo` method to `FileManager` which is used to update all file metadata `name`, `isPublic` and `tags` in a single call
-  Added `addTags` and `removeTags` methods to `FileManager` which are used to manage custom tags assigned to file objects
-  Added `tags` parameter to `FileUploadOptions` which helps to pass additional tag information when uploading a new file or replacing an existing one
-  Added `updateInfo` method to `BucketManager` which is used to update all bucket metadata `name`, `isPublic` and `tags` in a single call
-  Added `addTags` and `removeTags` methods to `BucketManager` which are used to manage custom tags assigned to buckets
-  Updated `StorageManager.createBucket` method. You can now pass bucket tags when creating a new bucket.

### 1.3.1 (2022-05-10)

-  Added `getUserFromDBbyCookie` method to `AuthManager` to get user data from the database using the session token stored in request cookies

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
