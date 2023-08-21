// const socket = new WebSocket('ws://localhost:8080');

// // WebSocket Method: [open, close, message, error]
// socket.addEventListener('open', () => {
//   console.log('Connected Websocket');
// });
// socket.addEventListener('close', () => {
//   console.log('Disconnected WebSocket');
// });
// socket.addEventListener('message', (data) => {
//   console.log('Client sent: ', data);
// });
// socket.addEventListener('error', (error) => {
//   console.log('Exception: ', error);
// });

// function sentEvent() {
//   const textInput = document.getElementById('textInput');
//   socket.send(
//     JSON.stringify({
//       event: 'events',
//       data: textInput.value || 'Default Value',
//     }),
//   );
// }
