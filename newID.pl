#!/usr/bin/perl

$name = $ARGV[0];

open(FILE,"people/people.tsv");
@lines = <FILE>;
close(FILE);

$lookup = {};
$keys = {};

for($i = 1; $i < (@lines);$i++){
	$lines[$i] =~ s/[\n\r]//g;
	($id,$p,$imdb,$w,$c,$g,$ref) = split(/\t/,$lines[$i]);
	$lookup{$p} = $id;
	$keys{$id} = $p;
}

if($name && $lookup{$name}){
	print "$name already exists with ID $lookup{$name}\n";
}

$key = generate_random_string($name);
while($keys{$key}){
	$key = generate_random_string();
}
print "If you need a new key use: $key\n";


sub generate_random_string {
	# Create a seed for the random number generator
	#  based on the numbers in the input
	my $seed = $_[0];
	my $length_of_randomstring = ($_[1] ? $_[1] : 8);
	my $n = 0;
	my $i;
	if($seed){
		my $a2n = {};

		my @string = split("", $seed);
		$seed = 0;
		$n = @string;
		for($i = 0; $i < @string ; $i++){
			$seed += (ord($string[$i])/256)**($n-$i);
		}
		$seed =~ s/[^0-9]//g;
		$seed =~ s/^0//g;
		srand($seed);
	}

	my @chars=('a'..'z','0'..'9');
	$n = @chars;
	my $random_string;
	foreach(1..$length_of_randomstring){
		$random_string .= $chars[rand @chars];
	}
	return $random_string;
}
