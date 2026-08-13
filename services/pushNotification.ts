import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FetchData, GetEncrypt } from '../components/helper';

export const initPushNotification = async (accessToken: string) => {
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') {
    console.log('Push permission denied');
    return;
  }

  await LocalNotifications.requestPermissions();
  await LocalNotifications.createChannel({
    id: 'default',
    name: 'Default',
    importance: 5,
    visibility: 1,
  });

  await PushNotifications.register();

  PushNotifications.addListener('registration', async token => {
    console.log('FCM TOKEN:', token.value);

    // ── Simpan token ke backend ────────────────────────────────────────
    try {
      const payload = GetEncrypt(JSON.stringify({ fcm_token: token.value }));
      await FetchData('/cms/user/fcm-token', 'POST', payload, false, accessToken, null, '');
    } catch (e) {
      console.error('Gagal simpan FCM token:', e);
    }
  });

  PushNotifications.addListener('pushNotificationReceived', async notification => {
    console.log('PUSH RECEIVED', notification);
    await LocalNotifications.schedule({
      notifications: [
        {
          title: notification.title || 'Notification',
          body: notification.body || '',
          id: Math.floor(Math.random() * 100000),
          channelId: 'default',
          smallIcon: 'ic_launcher',
          schedule: { at: new Date(Date.now() + 1000) },
        },
      ],
    });
  });

  // ── Handle tap notifikasi → navigate ke halaman terkait ───────────
  PushNotifications.addListener('pushNotificationActionPerformed', action => {
    const data = action.notification.data;

    if (data?.type === 'hk_assignment') {
      // Navigate ke list room status dengan date filter
      window.location.href = `/house-keeping/room-status?parent=172&date=${data.date}`;
    } else if (data?.type === 'inspection_required') {
      // Navigate langsung ke detail room yang perlu inspeksi
      window.location.href = `/house-keeping/room-status?parent=172&data=${data.room_id}&view=1`;
    }
  });
};
// import { PushNotifications } from '@capacitor/push-notifications';
// import { FetchData, GetEncrypt } from '../components/helper';

// export const initPushNotification = async (accessToken: string) => {

//   const permission = await PushNotifications.requestPermissions();

//   if (permission.receive !== 'granted') {

//     console.log('Push permission denied');

//     return;

//   }

//   await PushNotifications.register();

//   PushNotifications.addListener('registration', async token => {

//     console.log('FCM TOKEN:', token.value);

//     try {

//       const payload = GetEncrypt(
//         JSON.stringify({
//           fcm_token: token.value
//         })
//       );

//       await FetchData(
//         '/cms/user/fcm-token',
//         'POST',
//         payload,
//         false,
//         accessToken,
//         null,
//         ''
//       );

//     } catch (e) {

//       console.error('Gagal simpan FCM token:', e);

//     }
//   });

//   PushNotifications.addListener(
//     'pushNotificationReceived',
//     notification => {

//       console.log('PUSH RECEIVED', notification);

//     }
//   );

//   PushNotifications.addListener(
//     'pushNotificationActionPerformed',
//     action => {

//       const data = action.notification.data;

//       console.log('NOTIFICATION CLICKED', data);

//       if (data?.type === 'hk_assignment') {

//         window.location.href =
//           `/house-keeping/room-status?parent=172&date=${data.date}`;

//       } else if (data?.type === 'inspection_required') {

//         window.location.href =
//           `/house-keeping/room-status?parent=172&data=${data.room_id}&view=1`;

//       }
//     }
//   );
// };