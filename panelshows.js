// Function to load a file (same domain)
function loadFile(file,attrs,fn){
	if(!attrs) attrs = {};
	if(typeof attrs==="function"){
		fn = attrs;
		attrs = {};
	}
	attrs['_file'] = file;
	var error = "";
	var xhr = new XMLHttpRequest();
	if(attrs.error && typeof attrs.error==="function") error = function(e){ attrs.error.call((attrs.context ? attrs.context : this),e,attrs) }
	if(error){ xhr.addEventListener("error", error, false); xhr.addEventListener("abort", error, false); }
	xhr.onreadystatechange = function(){ if(xhr.readyState==4){ if(typeof fn==="function"){ attrs.data = xhr.responseText; fn.call((attrs.context ? attrs.context : this),attrs); } } }
	xhr.open("GET", file, true);
	try { xhr.send(); } catch(e) { attrs.e = e; attrs.error = error; if(error) attrs.error.call((attrs.context ? attrs.context : this),attrs); }
}


function CSV2JSON(data,format,start,end){

	if(typeof start!=="number") start = 1;
	if(typeof data==="string") data = data.split(/[\n\r]+/);
	if(typeof end!=="number") end = data.length;
	var line,datum;
	var newdata = new Array();

	for(var i = start; i < end; i++){
		line = data[i].split(/,/);
		datum = {};
		for(var j=0; j < line.length; j++){
			if(format[j]){
				if(format[j].format=="number"){ if(line[j]!=""){ if(line[j]=="infinity" || line[j]=="Inf"){ datum[format[j].name] = Number.POSITIVE_INFINITY; }else{ datum[format[j].name] = parseFloat(line[j]); }}}
				else if(format[j].format=="eval"){ if(line[j]!="") datum[format[j].name] = eval(line[j]); }
				else if(format[j].format=="date"){ datum[format[j].name] = new Date(line[j].replace(/^"/,"").replace(/"$/,"")); }
				else if(format[j].format=="boolean"){ if(line[j]=="1" || line[j]=="true"){ datum[format[j].name] = true; }else if(line[j]=="0" || line[j]=="false"){ datum[format[j].name] = false; }else{ datum[format[j].name] = null;} }
				else{ datum[format[j].name] = (line[j][0]=='"' && line[j][line[j].length-1]=='"') ? line[j].substring(1,line[j].length-1) : line[j]; }
			}else{
				datum[j] = (line[j][0]=='"' && line[j][line[j].length-1]=='"') ? line[j].substring(1,line[j].length-1) : line[j];
			}
		}
		newdata.push(datum);
	}
	return newdata;
}

function parseShow(d){
	var bits,p,g,a,b,w,hm,hf,hu,h,ep;
	var html = "";
	w = Math.floor(100*100/Math.min(d.episodes.length,200))/100;
	h = 100;
	// Work out the series number, episode number, gender, role, and name
	for(var i = 0; i < d.episodes.length; i++){
		bits = d.episodes[i].id.split(/x/);
		d.episodes[i].s = parseInt(bits[0]);
		d.episodes[i].e = parseInt(bits[1]);
		// Remove trailing semi-colon
		if(d.episodes[i].people && d.episodes[i].people.indexOf(";")>=0) d.episodes[i].people = d.episodes[i].people.replace(/\;$/);

		if(d.episodes[i].people) d.episodes[i].people = d.episodes[i].people.split(/;/);
		else d.episodes[i].people = [];

		g = { 'm': 0, 'f': 0, 'o': 0, 'u': 0 };
		for(var p = 0; p < d.episodes[i].people.length; p++){
			s = d.episodes[i].people[p]+""; 
			d.episodes[i].people[p] = { 'gender':'','name':'','id':'','role':'' };
			d.episodes[i].people[p].gender = (s.indexOf('Himself') > 0) ? "male" : (s.indexOf('Herself') > 0) ? "female" : "other";
			if(d.episodes[i].people[p].gender=="male") g.m++;
			if(d.episodes[i].people[p].gender=="female") g.f++;
			if(d.episodes[i].people[p].gender=="other") g.o++;
			var j = s.indexOf(":");
			var k = s.indexOf(" (");

			d.episodes[i].people[p].name = s.substr(j+1,k-j-1);
			d.episodes[i].people[p].id = s.substr(0,j);
			s = s.replace(/ ?\-? ?(Herself|Himself) ?\-? ?/,'').replace(/\(\)/,'');
			if(s.indexOf("(")>0){
				a = s.indexOf("(")+1;
				b = s.indexOf(")");
				d.episodes[i].people[p].role = s.substr(a,b-a);
			}
		}
		if(g.f+g.m+g.o < d.size){ g.u = d.size-g.f-g.m-g.o; }
		d.episodes[i].gender = g;
		// Build episode split
		hf = Math.round(h*g.f/(g.f+g.m+g.u+g.o));
		hm = Math.round(h*g.m/(g.f+g.m+g.u+g.o));
		ho = Math.round(h*g.o/(g.f+g.m+g.u+g.o));
		// Stop the height going over 100% due to rounding
		if(hm+hf+ho > h){ hm = h - hf - ho; }
		hu = h-hm-hf-ho;
		ep = d.episodes[i].id;

		if(d.episodes[i].date) ep += ' ('+d.episodes[i].date.toLocaleDateString()+')'
		ep += ': ';
		var ref = (d.episodes[i].ref ? (d.episodes[i].ref.indexOf(" ") > 0 ? d.episodes[i].ref.substr(0,d.episodes[i].ref.indexOf(" ")) : d.episodes[i].ref) : '')
		html += '<a '+(ref ? 'href="'+ref+'" ' : '')+'class="col" style="width:'+w+'%;" data-id="'+i+'">';
		if(ho > 0) html += '<div class="other" title="'+ep+g.o+'" style="height:'+ho+'px"></div>';
		if(hf > 0) html += '<div class="female" title="'+ep+g.f+' '+(g.f > 1 ? 'women':'woman')+'" style="height:'+hf+'px"></div>';
		if(hm > 0) html += '<div class="male" title="'+ep+g.m+' '+(g.m > 1 ? 'men':'man')+'" style="height:'+hm+'px"></div>';
		if(hu > 0) html += '<div class="unknown" title="'+ep+g.u+' unknown" style="height:'+hu+'px"></div>';
		html += '</a>';
	}

	if(html != ""){
		var el = document.getElementById(d.id+"_graph");
		el.innerHTML = "<h3>Episode-by-episode breakdown</h3>"+html;
		S('.col').on('mouseenter',function(e){
			var id = parseInt(S(e.currentTarget).attr('data-id'));
			if(id != over){
				// Remove any existing infobubbles
				S('.infobubble').remove();
				var html = "";
				for(var p = 0 ; p < d.episodes[id].people.length; p++){
					html += '<li><a href="../people/'+d.episodes[id].people[p].id+'.html" class="'+d.episodes[id].people[p].gender+'">'+d.episodes[id].people[p].name+"</a></li>";
				}
				if(html) html = "<ul>"+html+"</ul>";
				html = '<h3>'+d.episodes[id].id+' (<time datetime="'+d.episodes[id].date.toISOString()+'">'+d.episodes[id].date.toISOString().substr(0,10)+'</time>)</h3>'+html;
				S(e.currentTarget).append('<div class="infobubble"><div class="infobubble_inner">'+html+'</div></div>')
				over = id;
			}
		});
		S('.graph').on('mouseleave',function(e){
			// Remove any existing infobubbles
			//S('.infobubble').remove();
		});
	}
	return d;
}

var shows;
var fulldata = new Array();
var over = -1;

function finish(){
	if(shows.length == fulldata.length){
		var n = 0;
		var m = 0;
		var s;
		var stat = []
		for(var i = 0 ; i < fulldata.length; i++){
			for(var e = 0; e < fulldata[i].episodes.length; e++){
				s = fulldata[i].episodes[e].gender.m/(fulldata[i].episodes[e].gender.m+fulldata[i].episodes[e].gender.f);
				if(s > 0.4){
					n++;
				}
				m++;
			}
		}
		if(location.hash){
			function simulateClick(cb) {
				var event = new MouseEvent('click', {
					'view': window,
					'bubbles': true,
					'cancelable': true
				});
				var canceled = !cb.dispatchEvent(event);
			}
			var els = S('table a');
			var el;
			for(var i = 0; i < els.e.length; i++){
				el = S(els.e[i]);
				if(el.attr('href') == location.hash){
					el.trigger('click');
					simulateClick(els.e[i])
				}
			}
		}
	}
}

S(document).ready(function(){
	shows = document.querySelectorAll(".show");
	for(var i = 0 ; i < shows.length; i++){
		loadFile('data/'+shows[i].id+'.md',{id:shows[i].id},function(d){
			// Loaded MD file
			var lines = d.data.split(/[\n\r]*/);
			var size = 0;
			for(var i = 0; i < lines.length; i++){
				if(lines[i].indexOf("Size")>=0) size = lines[i].substring(lines[i].indexOf(":")+2);
			}
			loadFile('data/'+d.id+'.csv',{id:d.id,size:size},function(d){
				d.episodes = CSV2JSON(d.data,[{'name':'id','format':'string'},{'name':'date','format':'date'},{'name':'people','format':'string'},{'name':'ref','format':'string'}],1);
				fulldata.push(parseShow(d));
				finish();
			});
		});
	}
});
