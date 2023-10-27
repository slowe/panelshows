# Displays hosts of a show, ranked by appearances

import sys
from panelshow import Show, male, female, name

try:
    filename = sys.argv[1]
except:
    sys.exit("Usage: python hosts.py <csvfile>")

show = Show(filename)
hosts = sorted(show.host_appearances(), reverse=True)

line = " {:4d} {}"
print("Male hosts:\n")
for appearances, person in male(hosts):
    print(line.format(appearances, name(person)))

print("\nFemale hosts:\n")
for appearances, person in female(hosts):
    print(line.format(appearances, name(person)))
