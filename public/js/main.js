$( document ).ready(function() {

    $("#perPageSelect").change(function(){

        let urlString = window.location.href;
        let perPage = $(this).val();

        let url = new URL(urlString);
        let params = url.searchParams;

        params.set('perPage', perPage);

        if(urlString.indexOf('page')!= -1){
            params.set('page', 0);
        }

        let new_url = url.toString();

        window.location.replace(new_url);

    });

    $("#title-search-btn").click(function() {

        let urlString = window.location.href;
        let title = $("#title").val();

        let url = new URL(urlString);
        let params = url.searchParams;

        params.set('title', title);

        if(urlString.indexOf('page')!= -1){
            params.set('page', 0);
        }

        let new_url = url.toString();

        window.location.replace(new_url);
    });

    $("#pageSelect").change(function(){

        let urlString = window.location.href;
        let page = $(this).val();

        let url = new URL(urlString);
        let params = url.searchParams;

        params.set('page', page);

        let new_url = url.toString();

        window.location.replace(new_url);

    });

    $("#add-movie-btn").click(function() {
        window.location.replace("/addMovie");
    });

    $(".delete-movie-btn").click(function() {
        if(confirm("Delete movie?")) {

            let movie_id = $(this).children("p").html()
            
            $.ajax({
                url: '/api/movies/' + movie_id,
                type: 'DELETE',
                success: function(result) {
                    alert("Movie deleted successfully!");
                    location.reload();
                }
            });
        }
    });

    $(".update-movie-btn").click(function() {
        
        let movie_id = $(this).children("p").html()
        window.location.replace("/updateMovie/" + movie_id);
    });

    var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
        removeItemButton: true,
        //maxItemCount:10,
        //searchResultLimit:10,
        //renderChoiceLimit:10
      }); 
 
      var now = new Date();
  
      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
  
      var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  
    if($('#date').val()=='')
        $('#date').val(today); 
    
    if($('#date1').val()=='')
        $('#date1').val(today); 
    
    if($('#date2').val()=='')
        $('#date2').val(today); 
    
    if($('#date3').val()=='')
        $('#date3').val(today); 

     $("#add-movie-form-btn").click(function(){

        if(confirm("Add movie?")) {

            $.ajax({
                url: '/api/movies/',
                type: 'POST',
                data: {
                    title : $("[name='title']").val(),
                    plot : $("[name='plot']").val(),
                    fullplot : $("[name='fullplot']").val(),
                    poster : $("[name='poster']").val(),
                    genres : $("[name='genres']").val().toString(),
                    runtime : $("[name='runtime']").val(),
                    rated : $("[name='rated']").val(),
                    cast : $("[name='cast']").val(),
                    num_mflix_comments : $("[name='num_mflix_comments']").val(),
                    metacritic : $("[name='metacritic']").val(),
                    countries : $("[name='countries']").val().toString(),
                    languages : $("[name='languages']").val().toString(),
                    released : $("[name='released']").val(),
                    directors : $("[name='directors']").val(),
                    writers : $("[name='writers']").val(),
                    awards_wins : $("[name='awards_wins']").val(),
                    awards_nominations : $("[name='awards_nominations']").val(),
                    awards_text : $("[name='awards_text']").val(),
                    lastUpdated : $("[name='lastUpdated']").val(),
                    year : $("[name='year']").val(),
                    imdb_rating : $("[name='imdb_rating']").val(),
                    imdb_votes : $("[name='imdb_votes']").val(),
                    imdb_id : $("[name='imdb_id']").val(),
                    type : $("[name='type']").val(),
                    tomatoes_lastUpdated : $("[name='tomatoes_lastUpdated']").val(),
                    tomatoes_viewer_rating : $("[name='tomatoes_viewer_rating']").val(),
                    tomatoes_viewer_numReviews : $("[name='tomatoes_viewer_numReviews']").val(),
                    tomatoes_viewer_meter : $("[name='tomatoes_viewer_meter']").val(),
                    tomatoes_critic_rating : $("[name='tomatoes_critic_rating']").val(),
                    tomatoes_critic_numReviews : $("[name='tomatoes_critic_numReviews']").val(),
                    tomatoes_critic_meter : $("[name='tomatoes_critic_meter']").val(),
                    tomatoes_viewer_rating : $("[name='tomatoes_viewer_rating']").val(),
                    tomatoes_viewer_numReviews : $("[name='tomatoes_viewer_numReviews']").val(),
                    tomatoes_dvd : $("[name='tomatoes_dvd']").val(),
                    tomatoes_boxOffice : $("[name='tomatoes_boxOffice']").val(),
                    tomatoes_website : $("[name='tomatoes_website']").val(),
                    tomatoes_consensus: $("[name='tomatoes_consensus']").val(),
                    tomatoes_rotten : $("[name='tomatoes_rotten']").val(),
                    tomatoes_production : $("[name='tomatoes_production']").val(),
                    tomatoes_fresh : $("[name='tomatoes_fresh']").val(),
                },
                success: function(result) {
                    alert("Movie added successfully!");
                    window.location.replace("/");
                }
            });
        }

     });

    $("#update-movie-form-btn").click(function(){

        if(confirm("Update movie?")) {

            let movieId = window.location.pathname.split("/").pop();

            $.ajax({
                url: '/api/movies/' + movieId,
                type: 'PUT',
                data: {
                    title : $("[name='title']").val(),
                    plot : $("[name='plot']").val(),
                    fullplot : $("[name='fullplot']").val(),
                    poster : $("[name='poster']").val(),
                    genres : $("[name='genres']").val().toString(),
                    runtime : $("[name='runtime']").val(),
                    rated : $("[name='rated']").val(),
                    cast : $("[name='cast']").val(),
                    num_mflix_comments : $("[name='num_mflix_comments']").val(),
                    metacritic : $("[name='metacritic']").val(),
                    countries : $("[name='countries']").val().toString(),
                    languages : $("[name='languages']").val().toString(),
                    released : $("[name='released']").val(),
                    directors : $("[name='directors']").val(),
                    writers : $("[name='writers']").val(),
                    awards_wins : $("[name='awards_wins']").val(),
                    awards_nominations : $("[name='awards_nominations']").val(),
                    awards_text : $("[name='awards_text']").val(),
                    lastUpdated : $("[name='lastUpdated']").val(),
                    year : $("[name='year']").val(),
                    imdb_rating : $("[name='imdb_rating']").val(),
                    imdb_votes : $("[name='imdb_votes']").val(),
                    imdb_id : $("[name='imdb_id']").val(),
                    type : $("[name='type']").val(),
                    tomatoes_lastUpdated : $("[name='tomatoes_lastUpdated']").val(),
                    tomatoes_viewer_rating : $("[name='tomatoes_viewer_rating']").val(),
                    tomatoes_viewer_numReviews : $("[name='tomatoes_viewer_numReviews']").val(),
                    tomatoes_viewer_meter : $("[name='tomatoes_viewer_meter']").val(),
                    tomatoes_critic_rating : $("[name='tomatoes_critic_rating']").val(),
                    tomatoes_critic_numReviews : $("[name='tomatoes_critic_numReviews']").val(),
                    tomatoes_critic_meter : $("[name='tomatoes_critic_meter']").val(),
                    tomatoes_viewer_rating : $("[name='tomatoes_viewer_rating']").val(),
                    tomatoes_viewer_numReviews : $("[name='tomatoes_viewer_numReviews']").val(),
                    tomatoes_dvd : $("[name='tomatoes_dvd']").val(),
                    tomatoes_boxOffice : $("[name='tomatoes_boxOffice']").val(),
                    tomatoes_website : $("[name='tomatoes_website']").val(),
                    tomatoes_consensus: $("[name='tomatoes_consensus']").val(),
                    tomatoes_rotten : $("[name='tomatoes_rotten']").val(),
                    tomatoes_production : $("[name='tomatoes_production']").val(),
                    tomatoes_fresh : $("[name='tomatoes_fresh']").val(),
                },
                success: function(result) {
                    alert("Movie updated successfully!");
                    window.location.replace("/");
                }
            });
        }

    });

});