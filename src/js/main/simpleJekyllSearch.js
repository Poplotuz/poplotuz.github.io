(function($) {
    $.fn.simpleJekyllSearch = function(options) {
        function clear_search() {
            clearSearchResults();
            $('.search-field').val('');
        }
    
        $(".icon-remove-sign").on('click', clear_search);
        var settings = $.extend({
            jsonFile        : '/search.json',
            jsonFormat      : 'title,tags,categories,url,date',
            template : '<li><article><a href="{url}">{title} </a></article></li>',
            searchResults   : '.search-results',
            limit           : '10',
            noResults       : '<p>Oh no! We didn\'t find anything :(</p>'
        }, options);

        var properties = settings.jsonFormat.split(',');

        var jsonData = [],
            origThis = this,
            searchResults = $(settings.searchResults);

        if(settings.jsonFile.length && searchResults.length){
            $.ajax({
                type: "GET",
                url: settings.jsonFile,
                dataType: 'json',
                success: function(data, textStatus, jqXHR) {
                    jsonData = data;
                    registerEvent();
                },
                error: function(x,y,z) {
                    console.log("***ERROR in simpleJekyllSearch.js***");
                    console.log(x);
                    console.log(y);
                    console.log(z);
                    // x.responseText should have what's wrong
                }
            });
        }


        function registerEvent(){
            origThis.keyup(function(e){
                if($(this).val().length){
                    writeMatches( performSearch($(this).val()));
                }else{
                    clearSearchResults();
                }
            });
        }

        function performSearch(str){
            var matches = [];
            console.log("perfom search")
            $.each(jsonData,function(i,entry){
                for(var i=0;i<properties.length;i++)
                    if(entry[properties[i]] !== undefined && entry[properties[i]].toLowerCase().indexOf(str.toLowerCase()) !== -1){
                        matches.push(entry);
                        i=properties.length;
                    }
            });
            return matches;

        }

        function writeMatches(m) {
            clearSearchResults();
            searchResults.append( $(settings.searchResultsTitle) );

            if (m.length) {
                $.each(m,function(i,entry){
                    if(i<settings.limit){
                        var output=settings.template;
                        for(var i=0;i<properties.length;i++){
                            var regex = new RegExp("\{" + properties[i] + "\}", 'g');
                            output = output.replace(regex, entry[properties[i]]);
                        }
                        searchResults.append($(output));
                    }
                });
            }else{
                searchResults.append( settings.noResults );
            }


        }

        function clearSearchResults(){
            searchResults.children().remove();
        }
    }
}(Zepto));
