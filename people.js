// stuQuery
var eventcache={};function S(g){function a(n,m){var j=false;if(m[0]=="."){m=m.substr(1);for(var l=0;l<n.classList.length;l++){if(n.classList[l]==m){return true}}}else{if(m[0]=="#"){if(n.id==m.substr(1)){return true}}else{if(n.tagName==m.toUpperCase()){return true}}}return false}function c(p,o){var n=-1;var l=new Array();if(o.indexOf(":eq")>0){var j=o.replace(/(.*)\:eq\(([0-9]+)\)/,"$1 $2").split(" ");o=j[0];n=parseInt(j[1])}if(o[0]=="."){els=p.getElementsByClassName(o.substr(1))}else{if(o[0]=="#"){els=p.getElementById(o.substr(1))}else{els=p.getElementsByTagName(o)}}if(!els){els=[]}if(els.nodeName&&els.nodeName=="SELECT"){l.push(els)}else{if(typeof els.length!=="number"){els=[els]}for(k=0;k<els.length;k++){l.push(els[k])}if(n>=0&&l.length>0){if(n<l.length){l=[l[n]]}else{l=[]}}}return l}function d(p){if(typeof p==="string"){var e,p,q,o,m,l,n;e=p.split(" ");for(o=0;o<e.length;o++){if(o==0){p=c(document,e[o])}else{q=new Array();for(m=0;m<p.length;m++){q=q.concat(c(p[m],e[o]))}p=q.splice(0)}}}this.e=[];if(!p){return this}if(typeof p.length!=="number"){p=[p]}this.e=p;return this}d.prototype.ready=function(e){/in/.test(document.readyState)?setTimeout("S(document).ready("+e+")",9):e()};d.prototype.html=function(j){if(typeof j==="number"){j=""+j}if(typeof j!=="string"&&this.e.length==1){return this.e[0].innerHTML}if(typeof j==="string"){for(var e=0;e<this.e.length;e++){this.e[e].innerHTML=j}}return this};
d.prototype.before=function(t){
	var d = document.createElement('div');
	d.innerHTML = t;
	var e = d.childNodes;
	for(var i = 0 ; i < this.e.length ; i++){
		for(var j = 0; j < e.length; j++) this.e[i].parentNode.insertBefore(e[j], this.e[i]);
	}
};
d.prototype.prepend=function(j){if(!j&&this.e.length==1){return this.e[0].innerHTML}if(j){for(var e=0;e<this.e.length;e++){this.e[e].innerHTML=j+this.e[e].innerHTML}}return this};
d.prototype.append=function(j){if(!j&&this.e.length==1){return this.e[0].innerHTML}if(j){for(var e=0;e<this.e.length;e++){this.e[e].innerHTML+=j}}return this};function h(e,l){if(e&&e.length>0){for(var j=0;j<e.length;j++){if(e[j].node==l){return{success:true,match:j}}}}return{success:false}}function f(n,l,j,i,m){if(!eventcache[l]){eventcache[l]=new Array()}eventcache[l].push({node:n,fn:j,fn2:i,data:m})}function b(j){if(eventcache[j.type]){var i=h(eventcache[j.type],j.currentTarget);if(i.success){if(i.match.data){j.data=eventcache[j.type][i.match].data}return{fn:eventcache[j.type][i.match].fn,data:j}}}return function(){return{fn:""}}}d.prototype.off=function(l){if(typeof Element.prototype.removeEventListener!=="function"){Element.prototype.removeEventListener=function(r,o){if(!oListeners.hasOwnProperty(r)){return}var n=oListeners[r];for(var i=-1,m=0;m<n.aEls.length;m++){if(n.aEls[m]===this){i=m;break}}if(i===-1){return}for(var q=0,p=n.aEvts[i];q<p.length;q++){if(p[q]===o){p.splice(q,1)}}}}for(var j=0;j<this.e.length;j++){var e=h(eventcache[l],this.e[j]);if(e.success){this.e[j].removeEventListener(l,eventcache[l][e.match].fn2,false);eventcache[l].splice(e.match,1)}}return this};d.prototype.on=function(m,n,l){m=m||window.event;this.cache=[4,5,6];if(typeof n==="function"&&!l){l=n;n=""}if(typeof l!=="function"){return this}if(this.e.length>0){var o=this;var e=function(i){var p=b({currentTarget:this,type:m,data:n,originalEvent:i});if(typeof p.fn==="function"){return p.fn.call(o,p.data)}};for(var j=0;j<this.e.length;j++){f(this.e[j],m,l,e,n);if(this.e[j].addEventListener){this.e[j].addEventListener(m,e,false)}else{if(this.e[j].attachEvent){this.e[j].attachEvent(m,e)}}}}return this};d.prototype.trigger=function(m){var l;if(document.createEvent){l=document.createEvent("HTMLEvents");l.initEvent(m,true,true)}else{l=document.createEventObject();l.eventType=m}l.eventName=m;for(var j=0;j<this.e.length;j++){if(document.createEvent){this.e[j].dispatchEvent(l)}else{this.e[j].fireEvent("on"+l.eventType,l)}}return this};d.prototype.focus=function(){if(this.e.length==1){this.e[0].focus()}return this};d.prototype.blur=function(){if(this.e.length==1){this.e[0].blur()}return this};d.prototype.remove=function(){if(!this.e){return this}for(var e=this.e.length-1;e>=0;e--){if(!this.e[e]){return}if(typeof this.e[e].remove==="function"){this.e[e].remove()}else{if(typeof this.e[e].parentElement.removeChild==="function"){this.e[e].parentElement.removeChild(this.e[e])}}}return S(this.e)};d.prototype.hasClass=function(j){var e=true;for(var l=0;l<this.e.length;l++){if(!this.e[l].className.match(new RegExp("(\\s|^)"+j+"(\\s|$)"))){e=false}}return e};d.prototype.toggleClass=function(e){for(var j=0;j<this.e.length;j++){if(this.e[j].className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))){this.e[j].className=this.e[j].className.replace(new RegExp("(\\s|^)"+e+"(\\s|$)","g")," ").replace(/ $/,"")}else{this.e[j].className=(this.e[j].className+" "+e).replace(/^ /,"")}}return S(this.e)};d.prototype.addClass=function(e){for(var j=0;j<this.e.length;j++){if(!this.e[j].className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))){this.e[j].className=(this.e[j].className+" "+e).replace(/^ /,"")}}return S(this.e)};d.prototype.removeClass=function(e){for(var j=0;j<this.e.length;j++){while(this.e[j].className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))){this.e[j].className=this.e[j].className.replace(new RegExp("(\\s|^)"+e+"(\\s|$)","g")," ").replace(/ $/,"").replace(/^ /,"")}}return S(this.e)};d.prototype.css=function(m){var o;for(var l=0;l<this.e.length;l++){o={};var n=this.e[l].getAttribute("style");if(n){var q=this.e[l].getAttribute("style").split(";");for(var j=0;j<q.length;j++){var p=q[j].split(":");if(p.length==2){o[p[0]]=p[1]}}}if(typeof m==="object"){for(key in m){o[key]=m[key]}var e="";for(key in o){if(e){e+=";"}if(o[key]){e+=key+":"+o[key]}}this.e[l].setAttribute("style",e)}}if(this.e.length==1&&typeof m==="string"){return o[m]}return S(this.e)};d.prototype.parent=function(){var j=[];for(var e=0;e<this.e.length;e++){j.push(this.e[e].parentElement)}return S(j)};d.prototype.children=function(m){if(typeof m==="string"){var e=[];for(var j=0;j<this.e.length;j++){for(var l=0;l<this.e[j].children.length;l++){if(a(this.e[j].children[l],m)){e.push(this.e[j].children[l])}}}return S(e)}else{for(var j=0;j<this.e.length;j++){this.e[j]=(this.e[j].children.length>m?this.e[j].children[m]:this.e[j])}return S(this.e)}};d.prototype.find=function(j){var m=[];var e=[];for(var l=0;l<this.e.length;l++){m=c(this.e[l],j);for(k=0;k<m.length;k++){e.push(m[k])}}return S(e)};d.prototype.attr=function(e,m){var l=[];for(var j=0;j<this.e.length;j++){l.push(this.e[j].getAttribute(e));if(typeof m==="string"||typeof m==="number"){this.e[j].setAttribute(e,m)}}if(l.length==1){l=l[0]}if(typeof m==="undefined"){return l}else{return S(this.e)}};d.prototype.prop=function(e,m){var l=[];for(var j=0;j<this.e.length;j++){l.push(this.e[j].getAttribute(e));if(typeof m==="boolean"){if(m){this.e[j].setAttribute(e,e)}else{this.e[j].removeAttribute(e)}}}if(l.length==1){l=l[0]}return l};d.prototype.clone=function(){var e=document.createElement("div");e.appendChild(this.e[0].cloneNode(true));return e.innerHTML};d.prototype.replaceWith=function(j){var l=document.createElement("span");l.innerHTML=j;var m=S(this.e);for(var e=0;e<this.e.length;e++){m.e[0].parentNode.replaceChild(l,m.e[0])}return m};d.prototype.ajax=function(l,j){if(typeof l!=="string"){return false}if(!j){j={}}j.url=l;var n=(window.XMLHttpRequest)?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");n.addEventListener("load",e);n.addEventListener("error",i);function e(o){if(n.status===200){if(typeof j.complete==="function"){j.complete.call((j["this"]?j["this"]:this),(j.dataType=="json")?JSON.parse(n.responseText):n.responseText,j)}}else{i(o)}}function i(o){if(typeof j.error==="function"){j.error.call((j["this"]?j["this"]:this),o,j)}}try{n.open("GET",l)}catch(m){i(m)}try{n.send()}catch(m){i(m)}return this};d.prototype.loadJSON=function(i,j,e){if(!e){e={}}e.dataType="json";e.complete=j;this.ajax(i,e);return this};return new d(g)};

S(document).ready(function(){

	var a = S('a');
	var wiki = "";
	var wp = "https://en.wikipedia.org/wiki/";

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
	S().ajax('shows.json',{
		'complete': function(d){
			processShows(JSON.parse(d))
		},
		'error': function(e){
			console.log(e)
		}
	});
	S('#menu').append('<li class="search"><label>Search:</label><input type="text" name="searchpeople" id="searchpeople"></div><div class="searchresults"></li>')
		

	var db = new Array();
	var ids = {};
	var loaded = {};

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
			var name = this.e[0].value;
			var fl = name[0];
			if(fl && fl.match(/[a-zA-Z]/i)){
				if(!loaded[fl]){
					S().ajax('ranked-'+fl+'.csv',{
						'complete': function(data){
							var line,i;
							if(typeof data==="string") data = data.replace(/\r/,'').split(/[\n]/);
							for(i = 0; i < data.length; i++){
								line = data[i].split(",");
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
		location.href = ""+db[id].id+".html";
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

});