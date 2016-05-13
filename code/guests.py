# Displays guests of a show, ranked by appearances

import sys
from appearances import Show, male, female, name

try:
    filename = sys.argv[1]
except:
    sys.exit("Usage: python guests.py <csvfile>")

show = Show(filename)
guests = sorted(show.guest_appearances(), reverse=True)

line = " {:4d} {}"
print("Male guests:\n")
for appearances, person in male(guests):
    print(line.format(appearances, name(person)))

print("\nFemale guests:\n")
for appearances, person in female(guests):
    print(line.format(appearances, name(person)))
