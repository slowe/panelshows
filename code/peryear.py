# Displays guests of a show, ranked by 'appearances per year'

import sys
from appearances import (
    appearance_data, guest_appearances_per_year, male, female, name
)

try:
    filename = sys.argv[1]
except:
    sys.exit("Usage: python peryear.py <csvfile>")

data = appearance_data(filename)
guests = sorted(guest_appearances_per_year(data), reverse=True)

line = " {:6.3f} {}"
print("Male guests:\n")
for appearances, person in male(guests):
    print(line.format(appearances, name(person)))

print("\nFemale guests:\n")
for appearances, person in female(guests):
    print(line.format(appearances, name(person)))
