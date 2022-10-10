# Altogic Client Library

Javascript client for Altogic backend apps.

[Altogic](https://altogic.com) is a **backend application development and execution platform**,
enabling people and businesses to design, deploy and manage scalable applications. It simplifies
application development by eliminating repetitive tasks, providing pre-integrated and ready-to-use
execution environments, and automating key stages in the application development process.

For the Client Library guide with quickstarts and examples please visit [Client API Guide](https://altogic.com/client) and for detailed API documentation visit
[Client API reference](https://clientapi.altogic.com/v2.2.0/modules.html)

## Installation

In order to use the Altogic client library you need to <u>create an app and a client key in
Altogic</u>. Additionally, if you will be using the Authentication module of this library, you might
need to do additional configuration in your app settings.

### NPM

To install via [NPM](https://www.npmjs.com/)

```sh
npm install altogic
```

If you're using a bundler (like [webpack](https://webpack.js.org/)), you can import the Altogic and
create your Altogic client instance.

```js
import { createClient } from 'altogic';

//Create a client for interacting with backend app
//You need to provide envUrl and clientKey as input parameters
const altogic = createClient('http://fqle-avzr.c1-na.altogic.com', 'client-key');
```

### CDN

To install with a CDN (content delivery network) add the following script to import Altogic client
library.

```html
<script src="https://cdn.jsdelivr.net/npm/altogic"></script>
```

Then you can use it from a global `altogic` variable:

```html
<script>
   const { createClient } = altogic;
   //Create a client for interacting with backend app
   //You need to provide envUrl and clientKey as input parameters
   const client = createClient('http://fqle-avzr.c1-na.altogic.com', 'client-key');
</script>
```

As input to `createClient` you need to provide your environment base URL and client-key. You can
create a new environment or access your app `envUrl` from the **Environments** view and create a new
`clientKey` from **App Settings/Client library** view in Altogic Designer.

## Quick start

This guide will show you how to use the key modules of the client library to execute commands in
your backend app. For more in-depth coverage, see the
[Client API Guide](https://altogic.com/client).

### Authentication

#### **Sign up new users with email:**

If the email confirmation is **enabled** in your app authentication settings then a confirm sign-up
email will be sent to the user with a link to click and this method will return the user data with a
`null` session. Until the user clicks this link, the email address will not be verified and a
session will not be created. After the user clicks on the link in the confirmation email, Altogic verifies
the verification token sent in the email, and if the email is verified successfully redirects the
user to the redirect URL specified in app authentication settings with an `access_token` in the query
string parameter. You can use this `access_token` token to get authentication grants, namely the
user data and a new session object by calling the `getAuthGrant` method.

```js
//Sign up a new user with email and password
const { errors } = await altogic.auth.signUpWithEmail(email, password);

//... after email address verified, you can get user and session data using the accessToken
const { user, session, errors } = await altogic.auth.getAuthGrant(accessToken);

//After the users are created and their email verified, the next time the users wants to sign in to their account, you can use the sign in method to authenticate them
const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);
```

#### **Sign up new users with mobile phone number:**

If phone number confirmation is **enabled** in your app authentication settings then a confirmation
code SMS will be sent to the phone. Until the user validates this code by calling `verifyPhone`, the
phone number will not be verified.

```js
//Sign up a new user with mobile phone number and password
const { errors } = await altogic.auth.signUpWithPhone(phone, password);

//Verify the phone number using code sent in SMS and return the auth grants (e.g., session)
const { user, session, errors } = await altogic.auth.verifyPhone(phone, code);

//After the users are created and their phones numbers are verified, the next time the users wants to sign in to their account, you can use the sign in method to authenticate them
const { errors } = await altogic.auth.signInWithPhone(phone, password);
```

#### **Sign up/sign-in users with an oAuth provider:**

Signs in a user using the Oauth2 flow of the specified provider. Calling this method with the name
of the sign-in provider will redirect the user to the relevant login page of the provider. If the
provider sign-in completes successfully, Altogic directs the user to the redirect URL with an
`access_token` as a query string parameter that you can use to fetch the authentication grants (e.g.,
user and session data). Please note that you need to make a specific configuration at the provider to
retrieve the client id and client secret to use this method.

```js
//Sign in or sign up a user using Google as the oAuth provider
altogic.auth.signInWithProvider('google');

//... after oAuth provider sign-in, you can get user and session data using the accessToken
const { user, session, errors } = await altogic.auth.getAuthGrant(accessToken);
```

### Database

#### **Create a new object:**

To create a new object in one of your models in the database, you have two options. You can use the
query manager shown below:

```js
//Insert a new top-level model object to the database using the query builder
const { data, errors } = await altogic.db.model('userOrders').create({
   productId: 'prd000234',
   quantity: 12,
   customerId: '61fbf6ceeeed063ab062ac05',
   createdAt: '2022-02-09T10:55:34.562+00:00',
});
```

Or you can use an object manager:

```js
//Insert a new top-level model object to the database using the object manager
const { data, errors } = await altogic.db.model('userOrders').object().create({
   productId: 'prd000234',
   quantity: 12,
   customerId: '61fbf6ceeeed063ab062ac05',
   createdAt: '2022-02-09T10:55:34.562+00:00',
});
```

#### **Update an object:**

You can use two ways to update an object in the database. You can use an object manager shown below
to update an object.

```js
//Upates a users address identified by '61f958dc3692b8462a9d31a1' to a new one
const { data, errors } = await altogic.db
   .model('users.address')
   .object('61f958dc3692b8462a9d31a1')
   .update({
      city: 'Chicago',
      street: '1234 W Chestnut',
      zipcode: '60610',
      state: 'IL',
      country: 'US',
   });

//Increments the likeCount of a wallpost identified by id '62064c7eff64b91975a599b4' by 1
const { data, errors } = await altogic.db
   .model('wallposts')
   .object('62064c7eff64b91975a599b4')
   .updateFields({ field: 'likeCount', updateType: 'increment', value: 1 });
```

Or you can use a query manager to perform an update operation. The below examples perform exactly the same
updates as the above methods.

```js
//Upates the an object using a query builder
const result = await altogic.db
   .model('users.address')
   .filter('_id == "61f958dc3692b8462a9d31a1"')
   .update({
      city: 'Chicago',
      street: '1234 W Chestnut',
      zipcode: '60610',
      state: 'IL',
      country: 'US',
   });

//Increments the likeCount of a wallpost identified by id '62064c7eff64b91975a599b4' by 1 using the query builder
const { data, errors } = await altogic.db
   .model('wallposts')
   .filter('_id == "62064c7eff64b91975a599b4"')
   .updateFields({ field: 'likeCount', updateType: 'increment', value: 1 });
```

#### **Delete an object:**

```js
//Delete an order identified by id '62064163ae99b3a645705667' from userOrders
const { errors } = await altogic.db.model('userOrders').object('62064163ae99b3a645705667').delete();

//Alternatively you can use a query builder to delete an object
const { errors } = await altogic.db
   .model('userOrders')
   .filter('_id == "62064163ae99b3a645705667"')
   .delete();
```

#### **Query data:**

```js
//Gets the first 100 orders with basket size greater than $50 and having more than 3 items and sorts them by descending orderDate
await altogic.db
   .model('userOrders')
   .filter('totalAmount > 50 && totalQuantity > 3')
   .sort('orderDate', 'desc')
   .limit(100)
   .page(1)
   .get();
```

### Realtime

The realtime module of Altogic client library allows realtime publish and subscribe (pub/sub) messaging through WebSockets. Realtime makes it possible to open a two-way interactive communication session between the user's device (e.g., browser, smartphone) and a server. With realtime, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

```js
//Join to a channel
altogic.realtime.join('chat_room');

//Leave from a channel
altogic.realtime.leave('chat_room');

//Listen to a message chat message
altogic.realtime.on('chat_message', (payload) => console.log(payload.channel, payload.message));

//Send a message to all subscribers of a chat_room channel
altogic.realtime.send('chat_room', 'chat_message', 'hello there');

//Update user data and broadcast to all subscribed channel members
altogic.realtime.update({username: 'yoda', profileImgURL: 'https://www.mycloudstorage.com/yoda.png'})

//Listen to new channel member notifications
altogic.realtime.onJoin((payload) => console.log(payload.channel, payload.message));
//Listen channel member leave notifications
altogic.realtime.onLeave((payload) => console.log(payload.channel, payload.message));
//Listen to user data updates
altogic.realtime.onUpdate((payload) => console.log(payload.channel, payload.message));

```

### RESTful Endpoints (i.e., cloud functions)

In Altogic, you can define your app's RESTful endpoints and associated services. You can think of
services as your cloud functions and you define your app services in Altogic Designer. When the
endpoint is called, the associated service (i.e., cloud function) is executed. The client library
endpoints module provides the methods to make POST, PUT, GET and DELETE requests to your app
endpoints.

```js
//Make a GET request to /orders/{orderId} endpoint
//...
let orderId = '620949ee991edfba3ee644e7';
const { data, errors } = await altogic.endpoint.get(`/orders/${orderId}`);
```

```js
//Make a POST request to /wallposts/{postId}/comments endpoint
//...
let postId = '62094b43f7205e7d78082504';
const { data, errors } = await altogic.endpoint.post(`/wallposts/${postId}/comments`, {
   userId: '620949ee991edfba3ee644e7',
   comment: 'Awesome product. Would be better if you could add tagging people in comments.',
});
```

```js
//Make a DELETE request to /wallposts/{postId}/comments/{commentId} endpoint
//...
let postId = '62094b4dfcc106baba52c8ec';
let commentId = '62094b66fc475bdd5a2bfa48';
const { data, errors } = await altogic.endpoint.delete(`/wallpost/${postId}/comments/${commentId}`);
```

```js
//Make a PUT request to /users/{userId}/address
//...
let userId = '62094b734848b88ff50c2ab0';
const { data, errors } = await altogic.endpoint.put(`/users/${userId}/address`, {
   city: 'Chicago',
   street: '121 W Chestnut',
   zipcode: '60610',
   state: 'IL',
   country: 'US',
});
```

### Document storage

This module allows you to manage your app's cloud storage buckets and files. You store your files,
documents, images, etc. under buckets, which are the basic containers that hold your application
data. You typically create a bucket and upload files/objects to this bucket.

#### **Create a bucket:**

```js
/*
Creates a bucket names profile-images with default privacy setting of public, meaning that when you add a file to a bucket and if the file did not specify public/private setting, then it will be marked as publicly accessible through its URL
*/
await altogic.storage.createBucket('profile-images', true);
```

#### **Upload a file:**

```js
//Uploads a file to the profiles-images bucket
const fileToUpload = event.target.files[0];
const result = await altogic.storage
   .bucket('profile-images')
   .upload(fileToUpload.name, fileToUpload);

//If you would like to have a progress indicator during file upload you can also provide a callback function
const result = await altogic.storage
   .bucket('profile-images')
   .upload(fileToUpload.name, fileToUpload, {
      onProgress: (uploaded, total, percent) =>
         console.log(`progress: ${uploaded}/${total} ${percent}`),
   });
```

#### **List files in a bucket:**

```js
//Returns the list of files in bucket profile-images sorted by their size in ascending order
const result = await altogic.storage.bucket('profile-images').listFiles({
   returnCountInfo: true,
   sort: { field: 'size', direction: 'asc' },
});

/*
You can also apply filters and paginate over the files. Below call returns the first 100 files which are marked as public and sorted by their size in ascending order
*/
const result = await altogic.storage.bucket('profile-images').listFiles('isPublic == true', {
   returnCountInfo: true,
   limit: 100,
   page: 1,
   sort: { field: 'size', direction: 'asc' },
});
```

### Cache

You can use the Altogic client library to cache simple key-value pairs at a high-speed data storage
layer (Redis) to speed up the data set and get operations.

```js
//Store items in cache
const { errors } = await altogic.cache.set('lastUserOrder', {
   productId: 'prd000234',
   quantity: 12,
   customerId: '61fbf6ceeeed063ab062ac05',
   createdAt: '2022-02-09T10:55:34.562+00:00',
});

//Get the item stored in cache
const result = await altogic.cache.get('lastUserOrder');
```

### Message queue

The queue manager allows different parts of your application to communicate and perform activities
asynchronously. A message queue provides a buffer that temporarily stores messages and dispatches
them to their consuming service. With the client library, you can submit messages to a message queue
for asynchronous processing. After the message is submitted, the routed service defined in your
message queue configuration is invoked. This routed service processes the input message and performs
necessary tasks defined in its service flow.

```js
//Submit a message to a queuer for asynchronous processing
const { info, errors } = await altogic.queue.submitMessage(queueName, messageBody);

//Get the status of submitted message whether it has been completed processing or not
const result = await altogic.queue.getMessageStatus(info.messageId);
```

### Scheduled tasks (i.e., cron jobs)

The client library task manager allows you to manually trigger service executions of your scheduled
tasks that actually ran periodically at fixed times, dates, or intervals.

Typically, a scheduled task runs according to its defined execution schedule. However, with
Altogic's client library by calling the `runOnce` method, you can manually run scheduled tasks ahead
of their actual execution schedule.

```js
//Manually run a task
const { info, errors } = await altogic.queue.runOnce(taskName);

//Get the status of the manually triggered task whether it has been completed processing or not
const result = await altogic.queue.getTaskStatus(info.taskId);
```

## Learn more

You can use the following resources to learn more and get help

-  🚀 [Quick start](https://docs.altogic.com/quick-start)
-  📜 [Altogic Docs](https://docs.altogic.com)
-  💬 [Discord community](https://discord.gg/ERK2ssumh8)
-  💬 [Discussion forums](https://community.altogic.com)

## Bugs Report

Think you’ve found a bug? Please, open an issue on [GitHub repository](https://github.com/altogic/altogic-js/issues).

## Support / Feedback

For issues with, questions about, feedback for the client library, or want to see a new feature
please, send us an email support@altogic.com or reach out to our discussion forums
https://community.altogic.com
