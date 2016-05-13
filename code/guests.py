# Displays guests of a show, ranked by appearances

import sys
from appearances import (
    appearance_data, guest_appearances, male, female, name
)

try:
    filename = sys.argv[1]
except:
    sys.exit("Usage: python guests.py <csvfile>")

data = appearance_data(filename)
guests = sorted(guest_appearances(data), reverse=True)

line = " {:4d} {}"
print("Male guests:\n")
for appearances, person in male(guests):
    print(line.format(appearances, name(person)))

print("\nFemale guests:\n")
for appearances, person in female(guests):
    print(line.format(appearances, name(person)))
