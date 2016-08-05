# Data format

The data are stored in csv files. Each line contains the episode ID, the air date, a list of participants, and a URL reference for the listing.

  * The episode ID is usually the series and the episode number within the series e.g. 2x05. Some shows don't really have easily identifiable series (e.g. Question Time) so other IDs have been used such as their episode ID on BBC iPlayer or the air date.
  * The date is stored as YYYY-MM-DD.
  * The participants are semi-colon separated. Each entry is in the form "xxxxxxxx:YYYYY ZZZZZZ (AAAAA - BBBBB)".
    * xxxxxxxx - a unique ID for the person. This is to help disambiguate people with the same name i.e. there are several different Peter Jones'. The IDs are in the [master list of people](../people/people.tsv).
    * YYYYY ZZZZZZZ - the participant's name (preferably as it appears in the listings). This will not be consistent between episodes as sometimes people are given titles (MP, MEP, MSP, Baroness, Lord etc) or change their name (marriage, stage/real names etc). The unique ID should be used to consistently match people across episodes/shows.
    * AAAAA - a gender signifier e.g. Himself/Herself/Themselves etc
    * BBBBB - an optional role they had in the episode e.g. "Host" or "Team Captain"
  * It is good to have references, so this field contains a link (or links) to sources on the web for this specific episode e.g. iPlayer, BBC Genome, comedy.co.uk etc
