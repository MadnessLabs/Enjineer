importScripts("workbox-v4.3.1/workbox-sw.js");
importScripts("https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAPtD0LZ9w_wTRoyPLrD9HKxAHfM46lURE",
  authDomain: "madnessenjineer.firebaseapp.com",
  databaseURL: "https://madnessenjineer.firebaseio.com",
  projectId: "madnessenjineer",
  storageBucket: "madnessenjineer.appspot.com",
  messagingSenderId: "33508338596",
  appId: "1:33508338596:web:f58443691f8fad905d6f31",
});

const messaging = firebase.messaging();

self.addEventListener("message", ({ data }) => {
  if (data === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener("notificationclick", function (event) {
  if (
    event.action === "open" &&
    event?.notification?.data?.FCM_MSG?.data?.url
  ) {
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
        })
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (
              client.url == event.notification.data.FCM_MSG.data.url &&
              "focus" in client
            ) {
              return client.focus();
            }
          }
          if (clients.openWindow)
            return clients.openWindow(event.notification.data.FCM_MSG.data.url);
        })
    );
  }

  event.notification.close();
});

self.workbox.precaching.precacheAndRoute([]);
