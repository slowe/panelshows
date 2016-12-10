var colours = {
	"c1": { "bg": "#2254F4", "text": "white" },
	"c2": { "bg": "#178CFF", "text": "white" },
	"c3": { "bg": "#00B6FF", "text": "white" },
	"c4": { "bg": "#08DEF9", "text": "black" },
	"c5": { "bg": "#1DD3A7", "text": "white" },
	"c6": { "bg": "#0DBC37", "text": "white" },
	"c7": { "bg": "#67E767", "text": "white" },
	"c8": { "bg": "#722EA5", "text": "white" },
	"c9": { "bg": "#E6007C", "text": "white" },
	"c10": { "bg": "#EF3AAB", "text": "white" },
	"c11": { "bg": "#D73058", "text": "white" },
	"c12": { "bg": "#D60303", "text": "white" },
	"c13": { "bg": "#FF6700", "text": "white" },
	"c14": { "bg": "#F9BC26", "text": "black"}
}

function loadShows(data,attr){

	var dataset = new Array();

	for(var id in data){
		var series = new Array();
		if(data[id]){
			for(i = 0; i < data[id].episodes.length; i++){
				d = new Date(data[id].episodes[i][1]+'T00:00Z');
				d = new Date(d.getTime()+Math.random()*12*3600*1000);
				series.push({x:(d),y:data[id].episodes[i][2],'ep':data[id].episodes[i][0],'date':data[id].episodes[i][1]});
			}
			dataset.push({
				// Data in the form [{x:x1,y:y1,err:err1},...{x:xn,y:yn,err:errn}]
				data: series,
				color: (data[id].type == "comedy" ? '#ff0000' : '#666666'),
				points: { show: true, radius: 2.5 },
				lines: { show: false ,width: 1.5 },
				title: data[id].title,
				id: id,
				raw: data[id],
				channel: data[id].channel,
				clickable: false,
				hoverable: true,
				show: true,
				// Modify the default hover text with replacements
				hover: {
					text: '{{channel}}<br />Episode: {{ep}} ({{date}})<br />{{y}}% female',
					before: '<strong><a href="{{id}}.html">{{title}}</a></strong><br />'
				},
				css: {
				  'font-size': '0.8em',
				  'background-color': 'white',
				  'color': 'black',
				  'padding': '1em',
				  'border-radius': '0px'
				}
			})
		}
	}
	S('#graph').css({"width":"100%","height":"400px","margin-bottom":"16px"});
	graph = $.graph('graph', dataset, {
		xaxis: { mode:'time', 'label': 'Episode air/release date' },
		yaxis: { 'label': '% women' },
		zoommode: "x",
        hoverable: true,
		grid: { hoverable: true, clickable: true, show: false, background: 'transparent' }
	});


	var opts = {'bbc':true,'commercial':true,'radio':true,'tv':true,'podcast':true,'comedy':true,'general':true}

	var channels = {};
	for(var i = 0; i < dataset.length; i++){
		if(!channels[dataset[i].raw.channel]) channels[dataset[i].raw.channel] = 0;
		channels[dataset[i].raw.channel]++;
	}
	var keys = Object.keys(channels).sort();

	var b = "";
	for(var i = 0; i < keys.length; i++){
		c = keys[i].replace(/ /g,"");
		b += '<div class="button on"><input type="checkbox" id="channel-'+i+'" class="on" checked="checked" value="'+keys[i]+'" /><label for="channel-'+i+'">'+keys[i]+'</label></div>';
		opts['channel-'+i] = true;
		channels[keys[i]] = i;
	}
	S('#channels').append(b);
	for(var i = 0; i < keys.length; i++){
		S('#channel-'+i).on('click',function(e){ updateGraph(this); });
	}

	// Set button events
	S('#bbc').on('click',function(e){ updateGraph(this); });
	S('#commercial').on('click',function(e){ updateGraph(this); });
	S('#radio').on('click',function(e){ updateGraph(this); });
	S('#tv').on('click',function(e){ updateGraph(this); });
	S('#podcast').on('click',function(e){ updateGraph(this); });
	S('#comedy').on('click',function(e){ updateGraph(this); });
	S('#general').on('click',function(e){ updateGraph(this); });
	S('#allchannels').on('click',function(e){
		
		on = !(this.attr('on')=="true");
		if(on) this.html('Turn all channels off')
		else this.html('Turn all channels on');

		this.attr('on',(on ? "true" : "false"));
 
		for(var i = 0; i < keys.length; i++){
			el = S('#channel-'+i);
			if(el[0].checked != on){
				el[0].checked = on;
				opts['channel-'+i] = on;
				el.parent().toggleClass('on');
			}
		}
		updateGraph(this)
	});
	
	S('#general').trigger('click');
	S('#podcast').trigger('click');

	function updateGraph(el){
		if(!el.attr('on')) el.toggleClass('on');
		var p = el.parent();
		if(p.hasClass('button')){
			p.toggleClass('on');
		}
		var id = el.attr('id');
		opts[id] = !opts[id];
		for(var i = 0; i < graph.data.length; i++){
			var on = true;
			if(!opts.bbc && graph.data[i].raw.bbc) on = false;
			if(!opts.commercial && !graph.data[i].raw.bbc) on = false;
			if(!opts.radio && graph.data[i].raw.media=="Radio") on = false;
			if(!opts.tv && graph.data[i].raw.media=="TV") on = false;
			if(!opts.podcast && graph.data[i].raw.media=="Podcast") on = false;
			if(!opts.comedy && graph.data[i].raw.type=="comedy") on = false;
			if(!opts.general && graph.data[i].raw.type=="general") on = false;
			var j = channels[graph.data[i].raw.channel];
			if(!opts['channel-'+j] && graph.data[i].raw.channel==S('#channel-'+j)[0].value) on = false;
			graph.data[i].show = on;
		}
		graph.calculateData();
		graph.draw();
	}

	return;
}
var graph;


S(document).ready(function(){
	S(document).ajax('all.json',{'complete':loadShows,'dataType':'json','this':this,'cache':true,'error':function(e){ console.log('error',e) }});
});



