$(function() {


    //create event listener for delete article button
    $('.deleteArticleButton').on('click', function(event) {
        event.preventDefault();

        let articleId = $(this).data('id');

        //ajax call to delete article from DB
        $.ajax("/api/delete/article/" + articleId, {
            type: "PUT"
        }).then(function() {
            //show delete modal
            $('#articleDeletedModal').modal('show');
        })


    });



    //create event listener for Notes button
    $('.notesButton').on('click', function(event) {
        event.preventDefault();
        
        let articleId = $(this).data('id');

        //first empty the note modal contents
        $('.noteModalBody').empty();
        $('.noteModalTitle').empty();

        //ajax call to update the note modal contents
        $.ajax("/api/notes/" + articleId, {
            type: "GET"
        }).then(function(result) {
            console.log("Ajax call has completed");

            //append the article title to the modal body
            $('.noteModalTitle').append(`<h2>${result.title}</h2>`);
            $('.saveNoteButton').attr("data-id", result._id)

            //display existing notes
            console.log("Here is the notes AJAX call result: ");
            console.log(result);

            // console.log("Result note length: ");
            // console.log(result.note.length);

            // for (let i=0; i<result.note.length; i++) {
                console.log("Notes are interating");
                let newCard = $(`
                <div class="card">
                    <div class="card-header">
                        ${result.note.title}
                    </div>
                    <div class="card-body noteCardBody">
                        <p class="card-text">${result.note.body}</p>
                        <button type="button" class="btn btn-danger deleteNoteButton" data-id="">Delete Note</button>
                    </div>
                </div>
                `);
                console.log("hey this is a new card: ");
                console.log(newCard);
                $('.noteModalBody').append(newCard);
            // }


        }).then(
            //show note modal
            $('#noteModal').modal('show')
        )
        

    });


    //create event listener for save note button
    $('.saveNoteButton').on('click', function(event) {
        console.log($(this));
        let articleId = $(this).data('id');
        // let idString = JSON.stringify(articleId);
        console.log("printing id");
        console.log(articleId);

        //ajax call to create new note in db
        $.ajax('/api/create/notes/' + articleId, {
            type: 'POST',
            data: {
                title: $('#titleInput').val(),
                body: $('#bodyInput').val(),
                _articleId: articleId
                // _articleTitle: 
            }
        }).then(function(result) {
            let noteAdded = $('<p class="noteAlert">Your note has been saved</p>');
            $('.alertDiv').append(noteAdded);
            $('#titleInput').val('');
            $('#bodyInput').val('');
        })


    });


    //create event listener for delete button
    $(document).on("click", ".deleteNoteButton", function() {
        console.log("delete button clicked!");
        event.preventDefault();
        //ajax call to delete note 
        
        // $.ajax({
        //     method:'DELETE',
        //     url:'/tasks/' + $("#link").attr('data-mongo-id'),
      
        //       success : function( data) {
        //         console.log('success');
        //      },
        //     error : function() {
        //       console.log('error');
      
        //     }
        //   })
    })






})







