$(function() {

  // Grab the articles as a json
  // $.getJSON("/articles", function(data) {
  //   // For each one
  //   for (var i = 0; i < data.length; i++) {
  //     // Display the articles on the page
  //     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  //   }
  // });

  $('#scrape-articles-btn').on("click", function(event) {
      event.preventDefault();

      // $('.articlesScrapedBody').empty();
      $('.articlesScrapedBody').empty();
      

      $.ajax("/api/all", {
          type: "GET"
      }).then(function(response) {

          let oldLength = response;

          console.log(oldLength);

          $.ajax("/api/scrape", {
              type: "POST"
          }).then(function(response) {


              $.ajax("/api/reduce", {
                  type: "DELETE"
              }).then(function(response) {

                  let newText = $("<div>");
                  let newLength = response.length;

                  console.log(newLength);

                  let numberChanged = parseInt(newLength) - parseInt(oldLength);

                  if (numberChanged == 0) {
                      newText.text("Scraper is up to date")
                      $('.articlesScrapedBody').append(newText)
                      $('#scrapeArticlesModal').modal('show');
                  }

                  else {
                      newText.text(numberChanged + " new articles scraped")
                      $('.articlesScrapedBody').append(newText)
                      $('#scrapeArticlesModal').modal('show');
                  }

              })

          })
      })

  });

  // When you click the clear button
  $(document).on("click", "#clear-articles-btn", function() {
    event.preventDefault();
    console.log("Clicked CLEAR BUTTON!");
    $.ajax("/api/clear", {
      type: "GET"
    }).then(function(response) {
      $('#clearArticlesModal').modal('show');
    })

  });

  //Event listener for close-modal buttons
  $(".closeModalButton").on("click", function(event) {
    event.preventDefault();
    $.ajax("/", {
        type: "GET"
    }).then(function() {
        location.reload();
        console.log("page reloaded")
    })
  });


  //event listener for saveArticleButton
  $(".saveArticleButton").on("click", function(event) {
    event.preventDefault();
    let articleId = $(this).data("id");
    $.ajax("/api/save/article/" + articleId, {
      type: "PUT"
    }).then(function() {
      $('#articleSavedModal').modal('show');
    })

  });




  

})