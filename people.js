S(document).ready(function(){

	function processEntry(d){
		if(d.title && d.extract) S('h1').before('<div class="wikipedia">'+(d.thumbnail && d.thumbnail.source ? '<a href="'+wp+wiki+'"><img src="'+d.thumbnail.source+'" /></a>' : '')+'<p><strong>Biography:</strong> '+d.extract.substr(0,160)+'&#8230; <a href="'+wp+wiki+'" class="source">more from Wikipedia</a><br /></p></div>');
	}
	function processShows(d){
		var li = S('.episodes li');
		for(var i = 0; i < li.e.length; i++){
			href = S(li.e[i]).children('a').attr('href');
			var a = href.lastIndexOf('/')+1;
			var b = href.lastIndexOf('.html');
			href = href.substr(a,b-a)
			if(d[href]) S(li.e[i]).prepend('<img src="../images/'+d[href].country.toLowerCase()+'.png" class="flag" />')
		}
	}

	if(location.href.indexOf('file')!=0){
		var a = S('a');
		var wiki = "";
		var wp = "https://en.wikipedia.org/wiki/";

		// Loop over links and find the Wikipedia one
		for(var i = 0; i < a.e.length; i++){
			var href = S(a.e[i]).prop('href');
			if(href.indexOf(wp)==0) wiki = href.substr(wp.length);
		}

		// If we have a Wikipedia link we try to get the extract
		if(wiki){
			S().ajax('http://strudel.org.uk/cgi-bin/getwiki.pl?name='+encodeURIComponent(wiki)+'',{
				'complete': function(d){
					processEntry(JSON.parse(d.replace(/[\n\r]/,' ')));
				},
				'error': function(e){
					console.log(e)
				}
			})
		}
	}
	S().ajax('shows.json',{
		'complete': function(d){
			processShows(JSON.parse(d))
		},
		'error': function(e){
			console.log(e)
		}
	});

});