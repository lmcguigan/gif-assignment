//create an array of strings to hold all the possible topics
var topics = ["Audrey Hepburn", "Bette Davis", "Mae West", "Judy Garland", "Ginger Rogers", "Greta Garbo", "Elizabeth Taylor", "Vivien Leigh"];

//global variable to store number of gifs requested, set automatically to six and updated when user clicks dropdown
var numOfGifs = 6;

//click on x to close the modal
$(".close").click(function () {
    $(this).parents(".modal").css("display", "none");
});

//function to display gifs
function displayGifs() {
    var searchTerm = $(this).attr("data-topic");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        searchTerm + "&api_key=dc6zaTOxFJmzC&limit=" + numOfGifs;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            $("#gifHolder").empty();
            var gifResults = response.data;
            for (var i = 0; i < gifResults.length; i++) {
                //console.log(response);
                var newGifCol = $("<div>");
                newGifCol.addClass("gifDiv");
                var newGif = $("<img>");
                var newRating = $("<p>");
                newRating.text("Rating: " + gifResults[i].rating.toUpperCase());
                newRating.addClass("row");
                newGif.addClass("gif img-fluid");
                newGif.attr("src", gifResults[i].images.fixed_height_still.url);
                newGif.attr("data-still", gifResults[i].images.fixed_height_still.url);
                newGif.attr("data-animate", gifResults[i].images.fixed_height.url);
                newGif.attr("data-state", "still");
                newGifCol.append(newGif);
                newGifCol.append(newRating);
                $("#gifHolder").append(newGifCol);
            }
        });
}

//render buttons with a class of "gifRenderBtn" dynamically
function renderBtns() {
    //empty out the div
    $("#buttonHolder").empty();
    //add a button for every item in the array
    for (i = 0; i < topics.length; i++) {
        var newButton = $("<button>");
        newButton.addClass("gifRenderBtn");
        newButton.attr("data-topic", topics[i]);
        newButton.text(topics[i]);
        $("#buttonHolder").append(newButton);
    }
}

//function to add a new button when user searches
$("#add-star").on("click", function (event) {
    event.preventDefault();
    var newTopic = $("#search-input").val().trim();
    //if its not already in array
    if (topics.indexOf(newTopic) !== -1){
        //make this a modal
        $("#alreadyExists").css("display", "block");
    }
    else {
        topics.push(newTopic);
        renderBtns();
        //clear form
        $("#search-input").val("");
    }
    //if it is already in the array
});

//calls the displayGifs function every time a button with the gifRenderBtn class is clicked, rendering the gifs
$(document).on("click", ".gifRenderBtn", displayGifs);

//when user clicks on gif, the gif plays if state is still, goes back to still if clicked again
$("#gifHolder").on("click", ".gif", function (event) {
    event.preventDefault();
    var currentState = $(this).attr("data-state");
    if (currentState === "still") {
        //img src becomes the animated gif
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    }
    else {
        //img src goes back to the still
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});

//render btns
renderBtns();

$("select")
    .change(function () {
        $("select option:selected").each(function () {
            numOfGifs = $(this).val();
        });
        console.log(numOfGifs);
    })
    .trigger("change");