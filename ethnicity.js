function ready(f){
	if(/in/.test(document.readyState)) setTimeout('ready('+f+')',9);
	else f();
};

ready(function(){

	var eth = ['A','B','M','O','U','W'];
	var rows = [];

	people = document.querySelectorAll('.ethnicity-U .breakdown .person');
	if(people.length > 0){

		document.querySelectorAll('.bar').forEach(function(el){
			el.addEventListener('click',function(e){
				bar = e.target.closest('.bar');
				// Remove active elements
				a = document.querySelectorAll('.active')
				if(a) a.forEach(function(el){ el.classList.remove('active'); });
				bar.querySelector('.ethnicity-U .breakdown').classList.add('active')
			})
		});

		people.forEach(function(el){
			row = {'el':el,'inps':[]};
			yy = el.closest('.ethnicity-U').getAttribute('data');
			pid = el.getAttribute('data');
			id = yy+'-'+pid;
			row.pid = pid;
			row.id = id;
			row.year = yy;
			row.name = el.getAttribute('data-name');
			row.form = el.closest('form');
			// Build checkboxes
			html = "";
			div = document.createElement('div');
			div.style['grid-template-columns'] = 'repeat('+eth.length+',1fr)';
			div.style['white-space'] = 'nowrap';
			for(e = 0; e < eth.length; e++){
				fid = id+'-'+eth[e];
				inp = document.createElement('input');
				inp.setAttribute('type','radio');
				inp.setAttribute('id',fid);
				inp.setAttribute('name',id);
				inp.setAttribute('value',eth[e]);
				inp.setAttribute('data-year',yy);
				inp.setAttribute('data-pid',pid);
				if(eth[e]=="?") inp.setAttribute('selected','selected');
				lbl = document.createElement('label');
				lbl.setAttribute('for',fid);
				lbl.innerHTML = eth[e];
				row.inps.push({'el':inp,'lbl':lbl});
				div.appendChild(inp);
				div.appendChild(lbl);
			}
			row.form.style['display'] = 'grid';
			row.form.style['grid-template-columns'] = 'auto 1fr'
			el.style['white-space'] = 'nowrap';
			el.insertAdjacentElement('afterend',div);
			el.innerHTML += ' | <a href="https://duckduckgo.com/?q='+encodeURI(row.name)+'&iar=images" target="_new">Search</a>';
			re = new RegExp(row.pid);
			el.innerHTML = el.innerHTML.replace(re,'<a href="people/'+row.pid+'.html" target="_person">'+row.pid+'</a>');
			rows.push(row);
		});

		function reset(){
			for(r = 0; r < rows.length; r++){
				id = rows[r].id;
				if(rows[r].form[id].value){
					ele = rows[r].form[id];
					for(var i=0;i<ele.length;i++) rows[r].form[id][i].checked = false;
				}
			}
		}
		function summary(){
			txt = '';
			ids = {};
			for(r = 0; r < rows.length; r++){
				id = rows[r].id;
				v = rows[r].form[id].value;
				//console.log(r,id,v);
				if(v) console.log(r,rows[r],rows[r].id,rows[r].form,v);
				if(v){
					pid = rows[r].pid;
					if(!ids[pid]){
						ids[pid] = v;
					}else{
						console.warn('Already set '+pid);
					}
				}
			}
			for(i in ids){
				txt += i+'\t'+ids[i]+'\n';
			}
			document.getElementById('text').innerHTML = txt;
		}

		btn = document.createElement('button');
		btn.innerHTML = "Summary";
		btn.addEventListener('click',summary);
		rst = document.createElement('button');
		rst.innerHTML = "Reset";
		rst.addEventListener('click',reset);
		txt = document.createElement('textarea');
		txt.setAttribute('id','text');
		table = document.querySelector('.yearly');
		table.insertAdjacentElement('afterend', btn);
		btn.insertAdjacentElement('afterend', rst);
		rst.insertAdjacentElement('afterend',txt);
	}
});