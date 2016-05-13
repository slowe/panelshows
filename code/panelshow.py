# Tools to process panel show appearance data

import csv
import collections
from datetime import datetime


class Show:
    """
    Represents the appearance data for a panel show.
    """

    def __init__(self, filename):
        """
        Reads data for a show from the given CSV file.
        """
        with open(filename, "rt") as csvfile:
            self.people = {}
            self.appearances = collections.defaultdict(list)
            for record in csv.DictReader(csvfile):
                date = record["Date"]
                guests = record["Guests (Himself/Herself - Role)"]
                for item in guests[:-1].split(";"):
                    key, person = item.split(":")
                    self.people[key] = person
                    self.appearances[key].append(date)

    def host_appearances(self):
        """
        Yields appearance counts and person details for show hosts.
        """
        for key, dates in self.appearances.items():
            person = self.people[key]
            if person.endswith("Host)"):
                yield len(dates), person

    def guest_appearances(self):
        """
        Yields appearance counts and person details for show guests.
        """
        for key, dates in self.appearances.items():
            person = self.people[key]
            if not person.endswith("Host)"):
                yield len(dates), person


    def guest_appearances_per_year(self):
        """
        Yields average 'appearances per year' and person details for
        show guests.  Note: this will only yield data for guests
        who have appeared more than once.
        """
        for key, dates in self.appearances.items():
            person = self.people[key]
            if len(dates) > 1 and not person.endswith("Host)"):
                earliest = datetime.strptime(min(dates), "%Y-%m-%d")
                latest = datetime.strptime(max(dates), "%Y-%m-%d")
                delta = latest - earliest
                per_year = 365.0 * len(dates) / delta.days
                yield per_year, person


def male(data):
    """
    Filters appearance counts and person details to include only men.
    """
    for value, person in data:
        if "(Him" in person:
            yield value, person


def female(data):
    """
    Filters appearance counts and person details to include only women.
    """
    for value, person in data:
        if "(Her" in person:
            yield value, person


def name(person):
    """
    Returns a person's name, given their details.
    """
    index = person.find("(Him")
    if index == -1:
        index = person.find("(Her")
    return person[:index-1]
