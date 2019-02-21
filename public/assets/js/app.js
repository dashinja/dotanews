$(() => {
  $.get('/dota', data => {
    console.log('Client data received successfully.');
    console.log('Data: \n', data);
  });
});
