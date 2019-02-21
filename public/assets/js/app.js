$(() => {
  $.get('/dota', data => {
    console.log('Client data received successfully.');
    console.log('Data: \n', data);

    $.each(data, (i, item) => {
      let li = $('<li>').addClass('li');
      let title = $('<h3>')
        .addClass('title')
        .text(`${item.title}`);
      let date = $('<h5>')
        .addClass('date')
        .text(`${item.date}`);
      let link = $('<a>')
        .addClass('link')
        .attr('href', `${item.link}`)
        .text('Click here for more');
      let img = $('<img>')
        .addClass('img')
        .attr('src', `${item.img}`);
      let summary = $('<p>')
        .addClass('summary')
        .text(`${item.summary}`);

      li.append(title)
        .append(date)
        .append(link)
        .append(img)
        .append(summary);

      $('#root').append(li);
    });
  });
});
