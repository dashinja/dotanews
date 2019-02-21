$(() => {
  $.get('/dota', data => {
    // console.log('Client data received successfully.');
    // console.log('Data: \n', data);

    $.each(data, (i, item) => {
      let div = $('<div>').addClass('holder mt-5');
      let title = $('<h3>')
        .addClass('title')
        .attr('href', item.link);
      let date = $('<h5>')
        .addClass('date')
        .text(`${item.date}`);
      let img = $('<img>')
        .addClass('img rounded')
        .attr('src', `${item.img}`)
        .css('width', '30%');
      let summary = $('<p>')
        .addClass('summary w-25 mx-auto mb-1')
        .text(`${item.summary}`);
      let link = $('<a>')
        .addClass('link')
        .attr('href', `${item.link}`)
        .text('Click here for more');

      // let articleButton = $("<button>").attr()
      let articleButton = `<form action="/comments" class="form" method="post">
      <input type="text" class="name" name="username" id="user-name" />
      <input type="text" class="comment" name="usercomment" id="user-comment" />
      <button class="submit" id="btn-submit">Comment</button>
    </form>`;

      div
        .append(title)
        .append(date)
        .append(img)
        .append(summary)
        .append(link)
        .append(articleButton);

      $('#root').append(div);
    });
  });
});
