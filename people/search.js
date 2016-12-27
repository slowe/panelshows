S(document).ready(function(){

	var db = new Array();
	var ids = {};
	var loaded = {};
	var dir = "";
	S('#searchpeople').after('<button><img src="'+(location.href.indexOf("/people/") > 0 ? '../':'')+'search.png"></button>')
	S('#searchpeople').on('keyup',function(e){
		if(e.originalEvent.keyCode==40 || e.originalEvent.keyCode==38){
			// Down=40
			// Up=38
			var li = S('.searchresults li');
			var s = -1;
			for(var i = 0; i < li.e.length; i++){
				if(S(li.e[i]).hasClass('selected')) s = i;
			}
			if(e.originalEvent.keyCode==40) s++;
			else s--;
			if(s < 0) s = li.e.length-1;
			if(s >= li.e.length) s = 0;
			S('.searchresults .selected').removeClass('selected');
			S(li.e[s]).addClass('selected');
		}else if(e.originalEvent.keyCode==13){
			selectName(S('.searchresults .selected'))
		}else{
			// Need to load the data file for the first letter
			var name = this.e[0].value.toLowerCase();
			var fl = name[0];
			if(fl && fl.match(/[a-zA-Z]/i)){
				if(!loaded[fl]){
					dir = (location.href.indexOf("/people/") > 0 ? '':'people/')
					S().ajax(dir+'ranked-'+fl+'.csv',{
						'complete': function(data){
							var line,i;
							if(typeof data==="string") data = data.replace(/\r/,'').split(/[\n]/);
							for(i = 0; i < data.length; i++){
								line = CSVtoArray(data[i]);
								if(line[0] && typeof ids[line[0]]==="undefined"){
									db.push({'id':line[0],'name':line[1],'n':line[2]});
									ids[line[0]] = db.length-1;
								}
							}
							loaded[fl] = true;
							processResult(name);
						},
						'error': function(e){ console.log(e); }
					});
				}else processResult(name);
			}else processResult('');
		}
	});

	// Select one of the people in the drop down list
	function selectName(selected){
		// Get the ID from the DOM element's data-id attribute
		// Use that to find the index that corresponds to in the "db" hash
		var id = ids[selected.attr('data-id')];
		location.href = dir+""+db[id].id+".html";
	}

	function processResult(name){
		var html = "";
		var tmp = new Array();
		var li = S('.searchresults li');
		for(var i = 0 ; i < li.e.length ; i++) S(li.e[i]).off('click');
		name = name.toLowerCase();
		if(name.length >= 1){
			var names = name.split(/ /);
			var n = names.length;
			var mx = 0;
			for(var i = 0; i < db.length; i++){
				if(db[i].n > mx) mx = db[i].n;
				db[i].rank = 0;
			}
			for(var i = 0; i < db.length; i++){
				rank = 0;
				for(m = 0; m < n ; m++){
					if(db[i].name.toLowerCase().indexOf(names[m]) >= 0) rank++;
					else rank--;
				}
				if(rank > 0){
					datum = db[i];
					datum.rank = rank*db[i].n/mx;
					tmp.push(datum);
				}
			}
			tmp = sortBy(tmp,'rank');
			if(tmp.length > 0){
				S('.searchresults li').off('click');
				html = "<ol>";
				var n = Math.min(tmp.length,10);
				for(var i = 0; i < n; i++){
					html += '<li data-id="'+tmp[i].id+'" '+(i==0 ? ' class="selected"':'')+'"><div class="name">'+tmp[i].name+(tmp[i].dob ? ' ('+tmp[i].dob.substr(0,4)+')' : "")+"</div></li>";
				}
				html += "</ol>";
			}
		}
		S('.searchresults').html(html);
		var li = S('.searchresults li');
		for(var i = 0 ; i < li.e.length ; i++) S(li.e[i]).on('click',function(){ selectName(this); });
	}

	// Sort the data
	function sortBy(arr,i){
		yaxis = i;
		return arr.sort(function (a, b) {
			return a[i] < b[i] ? 1 : -1;
		});
	}

	// Return array of string values, or NULL if CSV string not well formed.
	function CSVtoArray(text) {
		var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
		var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
		// Return NULL if input string is not well formed CSV string.
		if (!re_valid.test(text)) return null;
		var a = [];                     // Initialize array to receive values.
		text.replace(re_value, // "Walk" the string using replace with callback.
			function(m0, m1, m2, m3) {
				// Remove backslash from \' in single quoted values.
				if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
				// Remove backslash from \" in double quoted values.
				else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
				else if (m3 !== undefined) a.push(m3);
				return ''; // Return empty string.
			});
		// Handle special case of empty last value.
		if (/,\s*$/.test(text)) a.push('');
		return a;
	};
});