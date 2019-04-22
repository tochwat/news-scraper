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
      $('#articles').empty();
      

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
                      newText.text(numberChanged + " new articles scraped!")
                      $('.articlesScrapedBody').append(newText)
                      $('#scrapeArticlesModal').modal('show');
                  }

              })

          })
      })

  });


  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Clear the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // Then add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h3>" + data.title + "</h3>");
        // Input for note title
        $("#notes").append("<input id='titleinput' name='title' >");
        // Textarea for note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // Button to submit note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's already a note in the article
        if (data.note) {
          // Place the note title in the title input
          $("#titleinput").val(data.note.title);
          // Place note body in the textarea for the note body
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Clear the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });


  // When you click the clear button
  $(document).on("click", "#clear-articles-btn", function() {
    console.log("Clicked CLEAR BUTTON!");
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost/unit18Populater";

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("articles").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Collection deleted");
        db.close();
      });
    });


  });

})