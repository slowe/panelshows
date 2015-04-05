function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}

// Function to load a file (same domain)
function loadFile(file,fn,attrs){
	if(!attrs) attrs = {};
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
	if(typeof data==="string") data = data.split(/[\n\r]/);
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
	var bits,p,g,a,b,w,hm,hf,h,ep;
	var html = "";
	w = Math.floor(100*100/Math.min(d.episodes.length,200))/100;
	h = 100;
	// Work out the series number, episode number, gender, role, and name
	for(var i = 0; i < d.episodes.length; i++){
		bits = d.episodes[i].id.split(/x/);
		d.episodes[i].s = parseInt(bits[0]);
		d.episodes[i].e = parseInt(bits[1]);
		if(d.episodes[i].people) d.episodes[i].people = d.episodes[i].people.split(/;/);
		else d.episodes[i].people = [];
		g = { 'm': 0, 'f': 0 };
		for(var p = 0; p < d.episodes[i].people.length; p++){
			s = d.episodes[i].people[p]+""; 
			d.episodes[i].people[p] = { 'gender':'','name':'','role':'' };
			d.episodes[i].people[p].gender = (s.indexOf('Himself') > 0) ? "m" : (s.indexOf('Herself') > 0) ? "f" : "";
			if(d.episodes[i].people[p].gender=="m") g.m++;
			if(d.episodes[i].people[p].gender=="f") g.f++;

			d.episodes[i].people[p].name = s.substr(0,s.indexOf(" ("));
			s = s.replace(/ ?\-? ?(Herself|Himself) ?\-? ?/,'').replace(/\(\)/,'');
			if(s.indexOf("(")>0){
				a = s.indexOf("(")+1;
				b = s.indexOf(")");
				d.episodes[i].people[p].role = s.substr(a,b-a);
			}
		}
		// Build episode split
		hf = Math.round(h*g.f/(g.f+g.m));
		hm = h-hf;
		ep = d.episodes[i].id;
		if(d.episodes[i].date) ep += ' ('+d.episodes[i].date.toLocaleDateString()+')'
		ep += ': ';
		html += '<div class="col" style="width:'+w+'%;"><div class="female" title="'+ep+g.f+' '+(g.f > 1 ? 'women':'woman')+'" style="height:'+hf+'px"></div><div class="male" title="'+ep+g.m+' '+(g.m > 1 ? 'men':'man')+'" style="height:'+hm+'px"></div></div>';
	}

	if(html != ""){
		var el = document.getElementById(d.id+"_graph");
		el.innerHTML = "<h3>Episode-by-episode breakdown</h3>"+html;
	}

}

r(function(){
	var shows = document.querySelectorAll(".show");
	for(var i = 0 ; i < shows.length; i++){
		loadFile(shows[i].id+'.csv',function(d){
			d.episodes = CSV2JSON(d.data,[{'name':'id','format':'string'},{'name':'date','format':'date'},{'name':'people','format':'string'}],1);
			parseShow(d);
		},{id:shows[i].id});
	}
});
