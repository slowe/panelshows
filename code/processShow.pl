
sub processShow(){
	local($file,$typ,$inbody,$dir,$timestamp,$regular,$anchor,$output,$tname,$pfile,$channel,$production,$datafile,$peoplepershow,$shows,$years,@lines,$line,$str,@rows,$row,$i,$r,$notes,$title,$country,$url,$urlcast,@urls,$urlperson,$bracket,$name,$url,$gender,$role,@roles,$namedroles,$allroles,$ep,$eptotal,$years,$dev,$ino,$mode,$nlink,$uid,$gid,$rdev,$size,$atime,$mtime,$ctime,$blksize,$blocks,$sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst,@bins,$addedpersontototal,%data);
	$file = $_[0];
	$anchor = $_[1];
	$typ = $_[2];
	$shows = 0;
	
	open(FILE,$file);
	@lines = <FILE>;
	close(FILE);
	
	$dir = $file;
	$dir =~ s/^(.*\/).*$/$1/;
	($dev,$ino,$mode,$nlink,$uid,$gid,$rdev,$size,$atime,$mtime,$ctime,$blksize,$blocks) = stat($file);

	$output = "";
	$str = "";
	$inbody = 0;

	for($i = 0; $i < @lines ; $i++){
		$lines[$i] =~ s/[\n\r]//g;

		if($inbody == 2){ $notes .= $lines[$i]."\n"; }

		if($lines[$i] =~ /^Country\:\t(.*)$/){ $country = $1; }
		if($lines[$i] =~ /^Title\:\t(.*)$/){ $title = $1; }
		if($lines[$i] =~ /^Type\:\t(.*)$/ && !$typ){ $typ = $1; }
		if($lines[$i] =~ /^Regulars\:\t(.*)$/){ $regular = $1; }
		if($lines[$i] =~ /^Source\:\t(.*)$/){
			$url = $1;
			$urlcast = $url;
		}
		if($lines[$i] =~ /^Production\:\t(.*)$/){ ($channel,@production) = split(/;/,$1); }
		if($lines[$i] =~ /^Years\:\t(.*)$/){ $years = $1; }
		if($lines[$i] =~ /^Size\:\t(.*)$/){ 
			($peoplepershow,$shows) = split(/\//,$1);
			if(!$peoplepershow || $peoplepershow < 2){ $peoplepershow = 7; }
		}
		if($lines[$i] =~ /^Data\:\t(.*)$/){ $str .= $1; }
		if($lines[$i] =~ /^\-\-\-/){ $inbody++; }
	}
	$notes = Markdown2HTML($notes);

	# Remove any quotes around the title used to escape colons
	$title =~ s/^\"//g;
	$title =~ s/\"$//g;

	$url =~ s/[\[\]]//g;
	@urls = split(/ , /,$url);
	for($j = 0; $j < @urls; $j++){
		$urls[$j] =~ s/fullcredits.*$//i;
	}
	if(!$typ){ $typ = "comedy"; }

	$git = "";
	$mtime = 0;
	if($str !~ /\<table class\=\"cast_list\"\>/ || length($str) < 100){
		$str =~ s/[\n\r]//g;
		if($str =~ /\.csv/){
			$git = "https://github.com/slowe/panelshows/blob/master/data/$str";
		}
		($dev,$ino,$mode,$nlink,$uid,$gid,$rdev,$size,$atime,$mtime,$ctime,$blksize,$blocks) = stat($dir.$str);
		print "Processing CSV for $str\n";
		
		$datafile = $dir.$str;
		if(!$programmes{$datafile}){ $programmes{$datafile} = {}; }
		$programmes{$datafile}{'title'} = $title." ($channel)";
		$programmes{$datafile}{'anchor'} = $anchor;
		$str = processDB($datafile,$typ);
	}

	$prod = "";
	for($i = 0; $i < @production; $i++){
		if($prod){ $prod .= "/"; }
		$prod .= $production[$i];
	}
	$production =~ s/;/\//g;
	#$output .= "\t\t\t<h2><a href=\"$urls[0]\">$title</a> ($channel".($prod ? "/".$prod : "")."; $years)</h2>\n";
	(@rows) = split(/\n/,$str);
	
	$genders{'male-guest'} = 0;
	$genders{'female-guest'} = 0;
	$genders{'none-guest'} = 0;
	$genders{'male-all'} = 0;
	$genders{'female-all'} = 0;
	$genders{'none-all'} = 0;
	$genders{'male-appearance-guest'} = 0;
	$genders{'female-appearance-guest'} = 0;
	$genders{'none-appearance-guest'} = 0;
	$genders{'male-appearance'} = 0;
	$genders{'female-appearance'} = 0;
	$genders{'none-appearance'} = 0;
	$total{'guest'} = 0;
	$total{'all'} = 0;
	$total{'appearance'} = 0;
	$total{'appearance-guest'} = 0;

	$ignorelist = "";
	@bins = ();
	
	for($i = 0 ; $i < (@rows);$i++){

		$rows[$i] =~ s/\&nbsp\;//g;

		($id,$tname,$eptotal,$role) = split(/\t/,$rows[$i]);

		$urlperson = "";
		@roles = split(/\;/,$role);

		$addedpersontototal = 0;
		$namedroles = "";
		$allroles = "";
		for($r = 0; $r < (@roles);$r++){

			$role = $roles[$r];
			$role =~ s/\&nbsp\;//;
			$role =~ s/ \/ \.\.\.//g;

			if($role =~ /Keith/ && $role !~ /Himself/){ $role = "Himself - ".$role.""; }
			if($role =~ /(Himself|Herself|Themself)[\s\t]*([^\(]*)\(([^\)]*)\)/){

				$gender = $1;
				$role = $2;
				$ep = $3;
				#$years = $2;

				if($ep > $shows){ $shows = $ep; }
				if($gender eq "Himself"){ $gender = "male"; }
				if($gender eq "Herself"){ $gender = "female"; }
				if($gender ne "male" && $gender ne "female"){ $gender = "none"; }

				$role =~ s/\/ \.\.\.[\s\t]+//;
				$role =~ s/^[\-\/] //g;
				$role =~ s/ $//g;
				$role =~ s/\/ (Him|Her)self//g;
				$role =~ s/^(Him|Her)self \- //g;
				if($role eq " "){ $role = ""; }

				# Fixes for regulars
				if($regular ne "manual"){
					if(!$role && $ep > $shows*0.35 && $shows > 6){ $role = "Regular"; }
				}
				
				if($role =~ /voice[\s\-]?over/i){ next; }
				if($role =~ /audience/i){ next; }
				if($role =~ /mystery guest/i){ next; }
				if($role =~ /cameraman/i){ next; }

				if($role eq ""){
					$total{'guest'}++;
					$genders{$gender.'-guest'}++;

					if($bins[$ep]){
						$bins[$ep]{$gender}++;
					}else{
						$bins[$ep] = { 'male' => 0, 'female' => 0 };
						$bins[$ep]{$gender} = 1;
					}
				}else{
					if($namedroles){ $namedroles .= ", "; }
					$namedroles .= "$role &times; $ep";
				}
				if($allroles){ $allroles .= ", "; }
				$allroles .= ($role ? $role : "Panellist")." &times; $ep";

				if($addedpersontototal==0){
					$total{'all'}++;
					$genders{$gender.'-all'}++;
					$addedpersontototal++;
				}
				
				if($role eq ""){
					$total{'appearance-guest'} += $ep;
					$genders{$gender.'-appearance-guest'} += $ep;
				}
				$total{'appearance'} += $ep;
				$genders{$gender.'-appearance'} += $ep;
			}
		}
		# If they've been on more than 4 episodes and at least 10% of the shows we add them to the displayed list
		if(($namedroles && $eptotal > $shows*0.02) || ($eptotal > 4 && $eptotal > $shows*0.1)){
			if($ignorelist ne ""){ $ignorelist .= ", "; }
			$pfile = "people/$id.html";
			$tname = safeHTML($tname);
			if(-e $basedir.$pfile){ $urlperson = "../".$pfile; }
			if($urlperson){
				$ignorelist .= "<a href=\"$urlperson\">$tname</a> ($allroles)";
			}else{
				$ignorelist .= "$tname ($allroles)";
			}
		}

	}

	print "$title - $shows\n";
	if($total{'appearance'}==0){ print "No appearances in $title\n"; }

	$missing = 100*($peoplepershow*$shows-$total{'appearance'})/($peoplepershow*$shows);
	$output .= "\t\t\t<p>It seems there may have been at least <strong>$shows shows</strong> and $total{'appearance'} listed appearances. With $peoplepershow people per show, ";

	$source = "";
	for($j = 0; $j < @urls; $j++){
		if($source ne ""){ $source .= " and "; }
		$source .= "<a href=\"$urls[$j]\">".getSourceFromURL($urls[$j])."</a>";
	}
	
	if($missing > 0){
		$output .= "$source ".(@urls > 1 ? "are":"is")." <strong>missing at least ".sprintf("%.0f",$missing)."% of appearances</strong> (and probably a similar percent of people). ";
	}else{
		if($missing!=0){
			$output .= "$source ".(@urls > 1 ? "have":"has")." <strong>".sprintf("%.0f",-$missing)."% more appearances listed than required</strong> (and probably a similar percent of people) perhaps due to listing special guests. ";
		}else{
			$output .= "$source ".(@urls > 1 ? "have":"has")." all appearances listed. ";
		}
	}
	$output .= "The host/captains/regulars have included $ignorelist.</p>\n";# Source: <a href=\"$urlcast\">Cast list for $title from $source</a>.</p>\n";
	$output .= "\t\t\t<h3>Appearances</h3>\n";
	$output .= "\t\t\t<p class=\"label\">Total appearances:</p>\n";

	if($total{'appearance'}==0){
		$total{'appearance'} = 1;	
	}
	if($total{'appearance-guest'}==0){
		$total{'appearance-guest'} = 1;
	}
	if($total{'all'}==0){
		$total{'all'} = 1;
	}
	if($total{'guest'}==0){
		$total{'guest'} = 1;
	}
	$output .= "\t\t\t<div class=\"bar\"><div class=\"male\" style=\"width:".sprintf("%.1f",(100*$genders{'male-appearance'}/($total{'appearance'})))."%\" title=\"".sprintf("%.1f",(100*$genders{'male-appearance'}/($total{'appearance'})))."% male\">".sprintf("%.1f",(100*$genders{'male-appearance'}/($total{'appearance'})))."% ($genders{'male-appearance'})</div><div class=\"female\" style=\"width:".sprintf("%.1f",(100*$genders{'female-appearance'}/($total{'appearance'})))."%\" title=\"".sprintf("%.1f",(100*$genders{'female-appearance'}/($total{'appearance'})))."% female\">".sprintf("%.1f",(100*$genders{'female-appearance'}/($total{'appearance'})))."\% ($genders{'female-appearance'})</div>".(($genders{'none-appearance'} > 0) ? "<div class=\"other\" style=\"width:".sprintf("%.1f",(100*$genders{'none-appearance'}/($total{'appearance'})))."%\">$genders{'none-appearance'}</div>":"")."</div>\n";
	$output .= "\t\t\t<p class=\"label\">Guest appearances i.e. ignoring the host/captains/regulars:</p>\n";
	print "APPEARANCE GUEST: $total{'appearance-guest'}\n";
	$pcm = sprintf("%.1f",(100*$genders{'male-appearance-guest'}/($total{'appearance-guest'})))."%";
	$pcf = sprintf("%.1f",(100*$genders{'female-appearance-guest'}/($total{'appearance-guest'})))."%";
	$output .= "\t\t\t<div class=\"bar\"><div class=\"male\" style=\"width:$pcm\" title=\"$pcm male\">$pcm ($genders{'male-appearance-guest'})</div><div class=\"female\" style=\"width:$pcf\" title=\"$pcf female\">$pcf ($genders{'female-appearance-guest'})</div>".(($genders{'none-appearance-guest'} > 0) ? "<div class=\"other\" style=\"width:".sprintf("%.1f",(100*$genders{'none-appearance-guest'}/($total{'appearance-guest'})))."%\">$genders{'none-appearance-guest'}</div>":"")."</div>\n";
	$output .= "\t\t\t<h3>People</h3>\n";
	$output .= "\t\t\t<p class=\"label\">All people:</p>\n";
	$pcm = sprintf("%.1f",(100*$genders{'male-all'}/($total{'all'})))."%";
	$pcf = sprintf("%.1f",(100*$genders{'female-all'}/($total{'all'})))."%";
	$output .= "\t\t\t<div class=\"bar\"><div class=\"male\" style=\"width:$pcm\" title=\"$pcm male\">$pcm ($genders{'male-all'})</div><div class=\"female\" style=\"width:$pcf\" title=\"$pcf female\">$pcf ($genders{'female-all'})</div>".(($genders{'none-all'} > 0) ? "<div class=\"other\" style=\"width:".sprintf("%.1f",(100*$genders{'none-all'}/($total{'all'})))."%\">$genders{'none-all'}</div>":"")."</div>\n";
	$output .= "\t\t\t<p class=\"label\">Guests i.e. ignoring the host/captains/regulars:</p>\n";
	$pcm = sprintf("%.1f",(100*$genders{'male-guest'}/($total{'guest'})))."%";
	$pcf = sprintf("%.1f",(100*$genders{'female-guest'}/($total{'guest'})))."%";
	$output .= "\t\t\t<div class=\"bar\"><div class=\"male\" style=\"width:$pcm\" title=\"$pcm male\">$pcm ($genders{'male-guest'})</div><div class=\"female\" style=\"width:$pcf\" title=\"$pcf female\">$pcf ($genders{'female-guest'})</div>".(($genders{'none-guest'} > 0) ? "<div class=\"other\" style=\"width:".sprintf("%.1f",(100*$genders{'none-guest'}/($total{'guest'})))."%\">$genders{'none-guest'}</div>":"")."</div>\n";
	$output .= "\t\t\t<div id=\"".$anchor."_graph\" class=\"graph\"></div>";
	if($notes){
		$output .= "\t\t\t<h3>Notes</h3>\n\t\t\t<p>".$notes."</p>\n";
	}
	if($git){
		$output .= "\t\t\t<div class=\"git\"><a href=\"$git\" class=\"repo\">Edit <em>$title</em> cast list</a></div>\n";
	}
	($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime($mtime);
	$year += 1900;
	$output .= "\t\t\t<p>Last updated: ".sprintf("%04d/%02d/%02d",$year,$mon+1,$mday)."</p>\n";


	$data{'title'} = $title." ($channel)";
	$data{'h1'} = "<a href=\"$urls[0]\">$title</a> (".safeHTML($channel)."".($prod ? "/".$prod : "")."; $years)";
	$data{'html'} = $output;
	$data{'li'} = "\t\t<li id=\"$anchor\" class=\"show\">\n"."\t\t\t<h2>$data{'h1'}</h2>\n".$output."\t\t</li>\n";
	$data{'tot'} = $total{'appearance'};
	$data{'tot_g'} = $total{'appearance-guest'};
	$data{'gen'} = sprintf("%.1f",(100*$genders{'female-appearance'}/($total{'appearance'})));
	$data{'gen2'} = sprintf("%.1f",(100*$genders{'female-appearance-guest'}/($total{'appearance-guest'})));
	$data{'s'} = $shows;
	$data{'w_a'} = $genders{'female-appearance'};
	$data{'w_g'} = $genders{'female-appearance-guest'};
	$data{'typ'} = $typ;
	$data{'mtime'} = $mtime;
	$data{'datafile'} = $datafile;
	$data{'country'} = $country;
	return %data;

}

# A simplistic converter
sub Markdown2HTML {
	my $md = $_[0];
	# Convert italic
	$md =~ s/(^|\W)\_\_/$1<em>/g;
	$md =~ s/\_\_(\W|$)/<\/em>$1/g;
	# Convert bold
	$md =~ s/(^|\W)\*\*/$1<strong>/g;
	$md =~ s/\*\*(\W|$)/<\/strong>$1/g;
	# Make blockquotes
	$md =~ s/\n[\s\t]+\> ([^\n\r]*)\n/\n<blockquote>$1<\/blockquote>/g;
	# Add paragraph splits
	$md =~ s/\n\n/<\/p><p>/g;
	$md =~ s/\[([^\]]*)\]\(([^\)]*)\)/<a href="$2">$1<\/a>/g;
	return $md;
}


sub processDB {
	my($file,$typ,$showkey,@lines,$line,$n,$id,$i,$date,$c,$ref,$castlist,$castl,@epcast,$epc,@cast,%people,$person,$role,$roles,$gender,$html,$y,$yy,$mm,$dd,$ep_m,$ep_f,$split);
	$file = $_[0];
	$typ = $_[1];
	if(!-e $file){ return ""; }
	$file =~ /\/([^\/]+)\.csv/;
	$showkey = $1;
	
	open(FILE,$file);
	@lines = <FILE>;
	close(FILE);
	
	$i = 0;

	foreach $line (@lines){
		$line =~ s/[\n\r]//g;
		if($line !~ /^Episode/){
			($n,$date,$c,$ref) = split(/\,/,$line);
			$castlist = $c;
			@cast = split(/;/,$c);
			$ep_m = 0;
			$ep_f = 0;
			($yy,$mm,$dd) = split(/-/,$date);
			foreach $c (@cast){
				$role = "";
				$gender = "";
				$id = "0";
				if($c =~ s/^([^\s]{8})\://g){
					$id = $1;
				}else{
					print "ERROR: Can't find ID for $c\n";
				}
				if($c =~ /(Himself)/){
					$gender = $1;
					$ep_m++;
				}elsif($c =~ /(Herself)/){
					$gender = $1;
					$ep_f++;
				}
				$c =~ s/\( ?\- ?/\(/;
				if($c =~ s/ *\(([^\)]*)\)//){
					$role = $1;
					$role =~ s/Performer - //i;	# We don't want to treat Performers on Loose Women as regulars
				}
				$c =~ s/ *$//;	# Remove trailing spaces
				$name = updateName($c);
				if($typ eq "comedy"){
					if($db{$id}){
						if($gender ne $db{$id}{'gender'}){
							print "WARNING: In $file the gender of $name seems to have changed to $gender around line $i.\n";
						}
						$db{$id}{'appearances'}++;
					}else{
						$db{$id}{'gender'} = $gender;
						$db{$id}{'name'} = $name;
						$db{$id}{'appearances'} = 1;
					}
					if($byyear{$yy}{$gender}){
						$byyear{$yy}{$gender}++;
						$byyear{'All'}{$gender}++;
					}else{
						$byyear{$yy}{$gender} = 1;
						$byyear{'All'}{$gender} = 1;
					}
					
				}
				if($people{$id}){
					$people{$id}{'appearances'}++;
				}else{
					$people{$id}{'name'} = $name;
					$people{$id}{'appearances'} = 1;
				}
				$tname = updateName($name);

				# Remove political titles (as these aren't consistently applied)
				$tname =~ s/ (MP|MEP|MSP|AM) ?$//g;
				$tname =~ s/ (OBE|CBE|MBE) ?$//g;
				$tname =~ s/^Prof\. /Professor /g;
				if($tname =~ /^Professor\.? (.*)$/){
					if($performers{$id}{'appearances'}){
						$tname = $1;
					}
				}
				$performers{$id}{'appearances'} .= "$date=$file=$n;";
				if(!$performers{$id}{'knownfor'}{$file}){ $performers{$id}{'knownfor'}{$file} = 0; }
				$performers{$id}{'knownfor'}{$file}++;
				if(!$performers{$id}{'ranking'}){ $performers{$id}{'ranking'} = 0; }
				$performers{$id}{'ranking'}++;

				if($typ eq "comedy"){
					if($performers{$id}{'birthdate'}){
						$age = int( (getJulianFromISO($date)-getJulianFromISO($performers{$id}{'birthdate'}))/365.25 );
						if(!$byyear{$yy}{'age'}{$age}){ $byyear{$yy}{'age'}{$age} = 0; }
						if(!$byyear{'All'}{'age'}{$age}){ $byyear{'All'}{'age'}{$age} = 0; }
						$byyear{$yy}{'age'}{$age}++;
						$byyear{'All'}{'age'}{$age}++;
						if($gender eq "Himself"){
							if(!$byyear{$yy}{'age-m'}{$age}){ $byyear{$yy}{'age-m'}{$age} = 0; }
							if(!$byyear{'All'}{'age-m'}{$age}){ $byyear{'All'}{'age-m'}{$age} = 0; }
							$byyear{$yy}{'age-m'}{$age}++;
							$byyear{'All'}{'age-m'}{$age}++;
						}elsif($gender eq "Herself"){
							if(!$byyear{$yy}{'age-f'}{$age}){ $byyear{$yy}{'age-f'}{$age} = 0; }
							if(!$byyear{'All'}{'age-f'}{$age}){ $byyear{'All'}{'age-f'}{$age} = 0; }
							$byyear{$yy}{'age-f'}{$age}++;
							$byyear{'All'}{'age-f'}{$age}++;
						}
					}else{
						#print "No age for $performers{$id}{'name'} ($id)\n";
						if(!$byyear{$yy}{'noage'}){ $byyear{$yy}{'noage'} = 0; };
						if(!$byyear{'All'}{'noage'}){ $byyear{'All'}{'noage'} = 0; };
						$byyear{$yy}{'noage'}++;
						$byyear{'All'}{'noage'}++;
						if($gender eq "Himself"){
							if(!$byyear{$yy}{'noage-m'}){ $byyear{$yy}{'noage-m'} = 0; };
							if(!$byyear{'All'}{'noage-m'}){ $byyear{'All'}{'noage-m'} = 0; };
							$byyear{$yy}{'noage-m'}++;
							$byyear{'All'}{'noage-m'}++;
						}elsif($gender eq "Herself"){
							if(!$byyear{$yy}{'noage-f'}){ $byyear{$yy}{'noage-f'} = 0; };
							if(!$byyear{'All'}{'noage-f'}){ $byyear{'All'}{'noage-f'} = 0; };
							$byyear{$yy}{'noage-f'}++;
							$byyear{'All'}{'noage-f'}++;
						}
					}
				}

				$castl = $castlist;
				$castl =~ s/\:[^\(]+ \([^\)]+\)(;|$)/;/g;	# Remove name and bracketed part
				$castl =~ s/(^|;)$id//g;
				$castl =~ s/^\;//g;
				$castl =~ s/\;$//g;
				@epcast = split(/;/,$castl);
				foreach $epc (@epcast){
					if(!$performers{$id}{'link'}{$epc}){ $performers{$id}{'link'}{$epc} = 0; }
					$performers{$id}{'link'}{$epc}++;
				}
				$performers{$id}{'others'} .= "$castl;";
				$performers{$id}{'gender'} = ($gender eq "Herself" ? "female" : ($gender eq "Himself" ? "male" : "other"));
				# If the name isn't defined, we'll use the one we have
				if(!$performers{$id}{'name'}){ $performers{$id}{'name'} = $tname; }
				#if(!$role){ $role = $gender; }
				if(!$people{$id}{'roles'} || $people{$id}{'roles'} !~ /$role/){
					if($people{$id}{'roles'}){ $people{$id}{'roles'} .= " / "; }
					$people{$id}{'roles'} .= "$role";
				}
				if(!$people{$id}{'role'}){ $people{$id}{'role'} = {}; }
				$role =~ s/\=//g;	# Remove equals signs as they'll be used as separators
				$role =~ s/\;/\:/g;	# Remove semi-colons as they'll be used as separators 
				if(!$people{$id}{'role'}{$role}){ $people{$id}{'role'}{$role} = 0; }
				$people{$id}{'role'}{$role}++;

				if($date =~ /([0-9]{4})/){
					$y = $1;
					if($people{$id}{'yearstart'}==0 || $people{$id}{'yearstart'} > $y){ $people{$id}{'yearstart'} = $y; }
					if($people{$id}{'yearend'}==0 || $people{$id}{'yearend'} < $y){ $people{$id}{'yearend'} = $y; }
				}
			}
			if($typ eq "comedy"){
				# Only make by year stats for comedy panel shows
				$split = 0;
				if($ep_f+$ep_m > 0){
					$split = int($divs*($ep_f/($ep_m+$ep_f)))/$divs;
					# Bring entirely female-episodes into the final bin
					if($split == 1){ $split -= (1/$divs); }
					$byyear{$yy}{'gender'}{$split}++;
					$byyear{'All'}{'gender'}{$split}++;
				}
			}
		}
		$i++;
	}
	$shows = $i-1;
	
	$html = "";
	foreach $id (reverse(sort { $people{$a}{'appearances'} <=> $people{$b}{'appearances'} } keys(%people) )){
		$roles = "";
		foreach $role (reverse(sort { $people{$id}{'role'}{$a} <=> $people{$id}{'role'}{$b} } keys(%{$people{$id}{'role'}}) )){
			if($roles){ $roles .= ";"; }
			$roles .= "$role ($people{$id}{'role'}{$role})";
		}
		$html .= "$id\t$people{$id}{'name'}\t$people{$id}{'appearances'}\t$roles\n";
	}



	return $html;
}