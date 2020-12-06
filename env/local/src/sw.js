importScripts("workbox-v4.3.1/workbox-sw.js");
importScripts("https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAPtD0LZ9w_wTRoyPLrD9HKxAHfM46lURE",
  authDomain: "madnessenjineer.firebaseapp.com",
  databaseURL: "https://madnessenjineer.firebaseio.com",
  projectId: "madnessenjineer",
  storageBucket: "madnessenjineer.appspot.com",
  messagingSenderId: "33508338596",
  appId: "1:33508338596:web:f58443691f8fad905d6f31",
});

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener("push", function (event) {
  // Skip if event is our own custom event
  if (e.custom) return;

  // Create a new event to dispatch
  var newEvent = new Event("push");
  newEvent.waitUntil = e.waitUntil.bind(e);
  newEvent.data = {
    json: function () {
      var newData = e.data.json();
      newData._notification = newData.notification;
      delete newData.notification;
      return newData;
    },
  };
  newEvent.custom = true;

  // Stop event propagation
  e.stopImmediatePropagation();

  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
  // console.log(event);
  // event.waitUntil(self.registration.showNotification(title, {
  //   body: message
  // }));
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  console.log("[Service Worker] Push Received.");
  console.log(payload);
  const data = payload.data
    ? payload.data
    : {
        url: "http://localhost:3333",
      };

  const options = {
    actions: data.actions ? data.actions : [],
    body: data.body,
    image: data.image ? data.image : null,
    icon: data.icon ? data.icon : "assets/icon/icon192.png",
    data,
  };

  return self.registration.showNotification(payload.data.title, options);
});

self.addEventListener("message", ({ data }) => {
  if (data === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url));
});

self.workbox.precaching.precacheAndRoute([]);
