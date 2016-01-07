/* stuQuery */
var eventcache={};function S(g){function a(n,m){var j=false;if(m[0]=="."){m=m.substr(1);for(var l=0;l<n.classList.length;l++){if(n.classList[l]==m){return true}}}else{if(m[0]=="#"){if(n.id==m.substr(1)){return true}}else{if(n.tagName==m.toUpperCase()){return true}}}return false}function c(p,o){var n=-1;var l=new Array();if(o.indexOf(":eq")>0){var j=o.replace(/(.*)\:eq\(([0-9]+)\)/,"$1 $2").split(" ");o=j[0];n=parseInt(j[1])}if(o[0]=="."){els=p.getElementsByClassName(o.substr(1))}else{if(o[0]=="#"){els=p.getElementById(o.substr(1))}else{els=p.getElementsByTagName(o)}}if(!els){els=[]}if(els.nodeName&&els.nodeName=="SELECT"){l.push(els)}else{if(typeof els.length!=="number"){els=[els]}for(k=0;k<els.length;k++){l.push(els[k])}if(n>=0&&l.length>0){if(n<l.length){l=[l[n]]}else{l=[]}}}return l}function d(p){if(typeof p==="string"){var e,p,q,o,m,l,n;e=p.split(" ");for(o=0;o<e.length;o++){if(o==0){p=c(document,e[o])}else{q=new Array();for(m=0;m<p.length;m++){q=q.concat(c(p[m],e[o]))}p=q.splice(0)}}}this.e=[];if(!p){return this}if(typeof p.length!=="number"){p=[p]}this.e=p;return this}d.prototype.ready=function(e){/in/.test(document.readyState)?setTimeout("S(document).ready("+e+")",9):e()};d.prototype.html=function(j){if(typeof j==="number"){j=""+j}if(typeof j!=="string"&&this.e.length==1){return this.e[0].innerHTML}if(typeof j==="string"){for(var e=0;e<this.e.length;e++){this.e[e].innerHTML=j}}return this};d.prototype.append=function(j){if(!j&&this.e.length==1){return this.e[0].innerHTML}if(j){for(var e=0;e<this.e.length;e++){this.e[e].innerHTML+=j}}return this};function h(e,l){if(e&&e.length>0){for(var j=0;j<e.length;j++){if(e[j].node==l){return{success:true,match:j}}}}return{success:false}}function f(n,l,j,i,m){if(!eventcache[l]){eventcache[l]=new Array()}eventcache[l].push({node:n,fn:j,fn2:i,data:m})}function b(j){if(eventcache[j.type]){var i=h(eventcache[j.type],j.currentTarget);if(i.success){if(i.match.data){j.data=eventcache[j.type][i.match].data}return{fn:eventcache[j.type][i.match].fn,data:j}}}return function(){return{fn:""}}}d.prototype.off=function(l){if(typeof Element.prototype.removeEventListener!=="function"){Element.prototype.removeEventListener=function(r,o){if(!oListeners.hasOwnProperty(r)){return}var n=oListeners[r];for(var i=-1,m=0;m<n.aEls.length;m++){if(n.aEls[m]===this){i=m;break}}if(i===-1){return}for(var q=0,p=n.aEvts[i];q<p.length;q++){if(p[q]===o){p.splice(q,1)}}}}for(var j=0;j<this.e.length;j++){var e=h(eventcache[l],this.e[j]);if(e.success){this.e[j].removeEventListener(l,eventcache[l][e.match].fn2,false);eventcache[l].splice(e.match,1)}}return this};d.prototype.on=function(m,n,l){m=m||window.event;this.cache=[4,5,6];if(typeof n==="function"&&!l){l=n;n=""}if(typeof l!=="function"){return this}if(this.e.length>0){var o=this;var e=function(i){var p=b({currentTarget:this,type:m,data:n,originalEvent:i});if(typeof p.fn==="function"){return p.fn.call(o,p.data)}};for(var j=0;j<this.e.length;j++){f(this.e[j],m,l,e,n);if(this.e[j].addEventListener){this.e[j].addEventListener(m,e,false)}else{if(this.e[j].attachEvent){this.e[j].attachEvent(m,e)}}}}return this};d.prototype.trigger=function(m){var l;if(document.createEvent){l=document.createEvent("HTMLEvents");l.initEvent(m,true,true)}else{l=document.createEventObject();l.eventType=m}l.eventName=m;for(var j=0;j<this.e.length;j++){if(document.createEvent){this.e[j].dispatchEvent(l)}else{this.e[j].fireEvent("on"+l.eventType,l)}}return this};d.prototype.focus=function(){if(this.e.length==1){this.e[0].focus()}return this};d.prototype.blur=function(){if(this.e.length==1){this.e[0].blur()}return this};d.prototype.remove=function(){if(!this.e){return this}for(var e=this.e.length-1;e>=0;e--){if(!this.e[e]){return}if(typeof this.e[e].remove==="function"){this.e[e].remove()}else{if(typeof this.e[e].parentElement.removeChild==="function"){this.e[e].parentElement.removeChild(this.e[e])}}}return S(this.e)};d.prototype.hasClass=function(j){var e=true;for(var l=0;l<this.e.length;l++){if(!this.e[l].className.match(new RegExp("(\\s|^)"+j+"(\\s|$)"))){e=false}}return e};d.prototype.toggleClass=function(e){for(var j=0;j<this.e.length;j++){if(this.e[j].className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))){this.e[j].className=this.e[j].className.replace(new RegExp("(\\s|^)"+e+"(\\s|$)","g")," ").replace(/ $/,"")}else{this.e[j].className=(this.e[j].className+" "+e).replace(/^ /,"")}}return S(this.e)};d.prototype.addClass=function(e){for(var j=0;j<this.e.length;j++){if(!this.e[j].className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))){this.e[j].className=(this.e[j].className+" "+e).replace(/^ /,"")}}return S(this.e)};d.prototype.removeClass=function(e){for(var j=0;j<this.e.length;j++){while(this.e[j].className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))){this.e[j].className=this.e[j].className.replace(new RegExp("(\\s|^)"+e+"(\\s|$)","g")," ").replace(/ $/,"").replace(/^ /,"")}}return S(this.e)};d.prototype.css=function(m){var o;for(var l=0;l<this.e.length;l++){o={};var n=this.e[l].getAttribute("style");if(n){var q=this.e[l].getAttribute("style").split(";");for(var j=0;j<q.length;j++){var p=q[j].split(":");if(p.length==2){o[p[0]]=p[1]}}}if(typeof m==="object"){for(key in m){o[key]=m[key]}var e="";for(key in o){if(e){e+=";"}if(o[key]){e+=key+":"+o[key]}}this.e[l].setAttribute("style",e)}}if(this.e.length==1&&typeof m==="string"){return o[m]}return S(this.e)};d.prototype.parent=function(){var j=[];for(var e=0;e<this.e.length;e++){j.push(this.e[e].parentElement)}return S(j)};d.prototype.children=function(m){if(typeof m==="string"){var e=[];for(var j=0;j<this.e.length;j++){for(var l=0;l<this.e[j].children.length;l++){if(a(this.e[j].children[l],m)){e.push(this.e[j].children[l])}}}return S(e)}else{for(var j=0;j<this.e.length;j++){this.e[j]=(this.e[j].children.length>m?this.e[j].children[m]:this.e[j])}return S(this.e)}};d.prototype.find=function(j){var m=[];var e=[];for(var l=0;l<this.e.length;l++){m=c(this.e[l],j);for(k=0;k<m.length;k++){e.push(m[k])}}return S(e)};d.prototype.attr=function(e,m){var l=[];for(var j=0;j<this.e.length;j++){l.push(this.e[j].getAttribute(e));if(typeof m==="string"||typeof m==="number"){this.e[j].setAttribute(e,m)}}if(l.length==1){l=l[0]}if(typeof m==="undefined"){return l}else{return S(this.e)}};d.prototype.prop=function(e,m){var l=[];for(var j=0;j<this.e.length;j++){l.push(this.e[j].getAttribute(e));if(typeof m==="boolean"){if(m){this.e[j].setAttribute(e,e)}else{this.e[j].removeAttribute(e)}}}if(l.length==1){l=l[0]}return l};d.prototype.clone=function(){var e=document.createElement("div");e.appendChild(this.e[0].cloneNode(true));return e.innerHTML};d.prototype.replaceWith=function(j){var l=document.createElement("span");l.innerHTML=j;var m=S(this.e);for(var e=0;e<this.e.length;e++){m.e[0].parentNode.replaceChild(l,m.e[0])}return m};d.prototype.ajax=function(l,j){if(typeof l!=="string"){return false}if(!j){j={}}j.url=l;var n=(window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");n.addEventListener("load",e);n.addEventListener("error",i);function e(o){if(n.status===200){if(typeof j.complete==="function"){j.complete.call((j["this"]?j["this"]:this),(j.dataType=="json")?JSON.parse(n.responseText):n.responseText,j)}}else{i(o)}}function i(o){if(typeof j.error==="function"){j.error.call((j["this"]?j["this"]:this),o,j)}}try{n.open("GET",l)}catch(m){i(m)}try{n.send()}catch(m){i(m)}return this};d.prototype.loadJSON=function(i,j,e){if(!e){e={}}e.dataType="json";e.complete=j;this.ajax(i,e);return this};return new d(g)};

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

		g = { 'm': 0, 'f': 0, 'u': 0 };
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
		if(g.f+g.m < d.size){ g.u = d.size-g.f-g.m; }
		d.episodes[i].gender = g;
		// Build episode split
		hf = Math.round(h*g.f/(g.f+g.m+g.u));
		hm = Math.round(h*g.m/(g.f+g.m+g.u));
		hu = h-hm-hf;
		ep = d.episodes[i].id;

		if(d.episodes[i].date) ep += ' ('+d.episodes[i].date.toLocaleDateString()+')'
		ep += ': ';
		html += '<div class="col" style="width:'+w+'%;"><div class="female" title="'+ep+g.f+' '+(g.f > 1 ? 'women':'woman')+'" style="height:'+hf+'px"></div><div class="male" title="'+ep+g.m+' '+(g.m > 1 ? 'men':'man')+'" style="height:'+hm+'px"></div><div class="unknown" title="'+ep+g.u+' unknown" style="height:'+hu+'px"></div></div>';
	}

	if(html != ""){
		var el = document.getElementById(d.id+"_graph");
		el.innerHTML = "<h3>Episode-by-episode breakdown</h3>"+html;
	}
	return d;
}

var shows;
var fulldata = new Array();

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
			var lines = d.data.split(/\n/);
			var size = 0;
			for(var i = 0; i < lines.length; i++){
				if(lines[i].indexOf("Size")>=0) size = lines[i].substring(lines[i].indexOf(":")+2);
			}
			loadFile('data/'+d.id+'.csv',{id:d.id,size:size},function(d){
				d.episodes = CSV2JSON(d.data,[{'name':'id','format':'string'},{'name':'date','format':'date'},{'name':'people','format':'string'}],1);
				fulldata.push(parseShow(d));
				finish();
			});
		});
	}
});
