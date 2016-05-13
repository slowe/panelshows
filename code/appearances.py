# Functions to process panel show appearance data

import csv
import collections
from datetime import datetime


def appearance_data(filename):
    """
    Reads appearance data from the given CSV file, returning it as a
    dictionary.  Keys are the people appearing in the show, values are
    lists of the dates of their appearances.
    """
    with open(filename, "rt") as csvfile:
        data = collections.defaultdict(list)
        for record in csv.DictReader(csvfile):
            date = record["Date"]
            people = record["Guests (Himself/Herself - Role)"]
            for item in people[:-1].split(";"):
                _, person = item.split(":")
                data[person].append(date)
        return data


def host_appearances(data):
    """
    Generates appearance counts and person details for show hosts,
    given as input the dictionary produced by appearance_data.
    """
    for person, dates in data.items():
        if person.endswith("Host)"):
            yield len(dates), person


def guest_appearances(data):
    """
    Generates appearance counts and person details for show guests,
    given as input the dictionary produced by appearance_data.
    """
    for person, dates in data.items():
        if not person.endswith("Host)"):
            yield len(dates), person


def guest_appearances_per_year(data):
    """
    Generates approximate 'appearances per year' and person details for
    show guests, given as input the dictionary produced by appearance_data.
    This will only yield data for guests who have appeared more than once.
    """
    for person, dates in data.items():
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
