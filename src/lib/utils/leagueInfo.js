/*   STEP 1   */
export const leagueID = "1387919217067573248"; // your league ID
export const leagueName = "Noobie League Season 16"; // your league name
export const dues = 100; // (optional) used in template constitution page
export const dynasty = true; // true for dynasty leagues, false for redraft and keeper
export const enableBlog = false; // requires VITE_CONTENTFUL_ACCESS_TOKEN and VITE_CONTENTFUL_SPACE environment variables

/*   STEP 2   */
export const homepageText = `
  <p>Welcome back everyone to Noobie League Season 16!!</p>
  <p>I am pleasured to be back as commissioner once again along with co-commissioner/debt collector Jason. I hope that we all have a great season once again and have more shenanigans and a fun time.</p>
  <p>Last season, Mike Phan (@zodiacs) has claimed the championship and is returning to protect his title. However none of us are interested in his repeat as a champion. This season, a feat no other manager has been able to accomplish is on the line - the true honor, the absolute shame, and a historical feat of a three time last place punishment is on the line for John!! (@JPchamps)</p>
  <p>We are also trying to get a league get-together at an NFL game that we haven't been able to arrange for a few seasons now. There are a few games that I am looking at that would be a good value and hopefully a fun enough game at So-Fi Stadium. At the moment, Chargers games are a good value compared to the Rams - once the season kicks off I will try to bring up some games that could work.</p>
  <p>Finally, I do apologize for the last minute change to the waiver wire rules and making an executive decision on the change. Quite honestly, this was a setting that I should have made at the very beginning when we transitioned to FAAB waiver, but to get everyone used to the new system I opted out of it and in hindsight that was a mistake. This change in the waiver system does not disadvantage anybody in the league - it creates an equal opportunity for every league manager to pickup players off of the waiver wire on a daily basis, especially when mid-week injuries happen that would vault a backup player to the priority of the waiver add.</p>
  <p>This does not mean we no longer have Free Agency - players will be available to pickup via Free Agency on Sundays after the initial waivers run. Monday games will also be treated the same where players are going to become free agents once the initial waiver runs.</p>
  <p>Once again, this change benefits everyone, and does not give any manager an advantage or a disadvantage.</p>
  <p>With that, lets have a fun season and may the best manager win it all!!</p>
  <p>Commissioner<br>Toru</p>
`;

// The homepage intro above shows as a pop-up the first time a visitor loads the homepage
// before this date (once per browser session). After this date the pop-up stops appearing,
// but the intro is always readable from the nav menu under League Info > Welcome Message.
export const welcomePopupEndDate = "2026-09-14";

// Weekly recaps shown on the homepage. Most recent entry is shown expanded, older ones
// collapse into a "past recaps" accordion. Add a new entry each week - no need to remove old ones.
export const weeklyRecaps = [
  // {
  //   "week": 1,
  //   "title": "Week 1 Recap",
  //   "text": `<p>What a way to kick off the season...</p>`,
  // },
];

// Intro blurb shown at the top of the Events page (/src/routes/events)
export const eventsIntroText = `
  <p>Let's try to organize a league game day get together!! Below are several games that I have picked out that seem the most reasonably priced. Prices in green are the starting price in the 500 section (nosebleeds) and obviously the better seats as we get closer to the field are more expensive.</p>
  <p>Some information about SoFi for those that have never been:</p>
  <p>The "best" seats in terms of experiencing the stadium (field + screen) would the 200 and 300 section. the 100s are just too low and really need to look up at the screens and I think the screens are part of the experience.</p>
  <p>I have also sat at the 500s and this is mostly going to be looking at the screen as the field is very far and at certain areas you can't really see what's happening. I have never been at the 400s, but I would guess it's a little better than the 500s.</p>
  <p>Links to the ticketing sites are in each game card, they are defaulted to 8 ~ 10 ticket range.</p>
`;

/*   STEP 3   */
/*
League events: game days, watch parties, meetups, etc.
Uncomment (remove the //) before each line to make it live code.
Only "title" is required - the easiest option is just a title + "links" pointing to ticket
sites (Gametime, Ticketmaster, SeatGeek, VividSeats, etc.) and skip date/time/location/
description entirely, since the ticket page already has all of that info.
"startingPrice" (optional, a number) shows a "From $X" badge - this is a manual snapshot,
not a live price, so update it by hand whenever you check current prices again.
*/

export const events = [
  {
    "title": "Broncos vs. Chargers @ SoFi Stadium",
    "date": "Sunday, October 11, 2026",
    "location": "SoFi Stadium, Inglewood, CA",
    "startingPrice": 90,
    "links": [
      { "label": "Gametime", "url": "https://gametime.co/nfl-football/broncos-at-chargers-tickets/10-11-2026-inglewood-ca-so-fi-stadium/events/698f5489cdc32881d2db62de" },
      { "label": "SeatGeek", "url": "https://seatgeek.com/los-angeles-chargers-tickets/10-11-2026-inglewood-california-sofi-stadium/nfl/18014250?quantity=10" },
      { "label": "Ticketmaster", "url": "https://www.ticketmaster.com/los-angeles-chargers-v-denver-broncos-inglewood-california-10-11-2026/event/0A00646BA4B5E4AD" },
      { "label": "StubHub", "url": "https://www.stubhub.com/los-angeles-chargers-inglewood-tickets-10-11-2026/event/160425247/?backUrl=%2Flos-angeles-chargers-tickets%2Fgrouping%2F282490&lt=33.9562003&lg=-118.353132&quantity=10" },
      { "label": "VividSeats", "url": "https://www.vividseats.com/los-angeles-chargers-tickets-inglewood-sofi-stadium-3-1-2026/production/6491346?quantity=8" },
    ],
  },
  {
    "title": "Cardinals vs. Rams @ SoFi Stadium",
    "date": "Sunday, October 18, 2026",
    "location": "SoFi Stadium, Inglewood, CA",
    "startingPrice": 90,
    "links": [
      { "label": "Gametime", "url": "https://gametime.co/nfl-football/cardinals-at-rams-tickets/10-18-2026-inglewood-ca-so-fi-stadium/events/698f4738989909b5cba17565" },
      { "label": "SeatGeek", "url": "https://seatgeek.com/los-angeles-rams-tickets/10-18-2026-inglewood-california-sofi-stadium/nfl/18016697?quantity=10" },
      { "label": "Ticketmaster", "url": "https://www.ticketmaster.com/los-angeles-rams-vs-arizona-cardinals-inglewood-california-10-18-2026/event/0A006465880D44FB" },
      { "label": "StubHub", "url": "https://www.stubhub.com/los-angeles-rams-inglewood-tickets-10-18-2026/event/160436261/?backUrl=%2Flos-angeles-rams-tickets%2Fperformer%2F6183&lt=33.9562003&lg=-118.353132&quantity=10" },
      { "label": "VividSeats", "url": "https://www.vividseats.com/los-angeles-rams-tickets-inglewood-sofi-stadium-3-3-2026/production/6491567?quantity=8" },
    ],
  },
  {
    "title": "Chargers vs. Rams @ SoFi Stadium",
    "date": "Sunday, November 1, 2026",
    "location": "SoFi Stadium, Inglewood, CA",
    "startingPrice": 140,
    "links": [
      { "label": "Gametime", "url": "https://gametime.co/nfl-football/chargers-at-rams-tickets/11-1-2026-inglewood-ca-so-fi-stadium/events/698f4a4de8396f806db4af57" },
      { "label": "SeatGeek", "url": "https://seatgeek.com/los-angeles-rams-tickets/11-1-2026-inglewood-california-sofi-stadium/nfl/18016757?quantity=10" },
      { "label": "Ticketmaster", "url": "https://www.ticketmaster.com/los-angeles-rams-vs-los-angeles-inglewood-california-11-01-2026/event/0A00646588324539" },
      { "label": "StubHub", "url": "https://www.stubhub.com/los-angeles-rams-inglewood-tickets-11-1-2026/event/160436258/?backUrl=%2Flos-angeles-chargers-tickets%2Fgrouping%2F282490&lt=33.9562003&lg=-118.353132&quantity=10" },
      { "label": "VividSeats", "url": "https://www.vividseats.com/los-angeles-rams-tickets-inglewood-sofi-stadium-3-8-2026/production/6491648?quantity=8" },
    ],
  },
  {
    "title": "Texans vs. Chargers @ SoFi Stadium",
    "date": "Sunday, November 8, 2026",
    "location": "SoFi Stadium, Inglewood, CA",
    "startingPrice": 50,
    "links": [
      { "label": "Gametime", "url": "https://gametime.co/nfl-football/texans-at-chargers-tickets/11-8-2026-inglewood-ca-so-fi-stadium/events/698f59703067f01f34e741c9" },
      { "label": "SeatGeek", "url": "https://seatgeek.com/los-angeles-chargers-tickets/11-8-2026-inglewood-california-sofi-stadium/nfl/18014258?quantity=10" },
      { "label": "Ticketmaster", "url": "https://www.ticketmaster.com/los-angeles-chargers-v-houston-texans-inglewood-california-11-08-2026/event/0A00646BA4BEE4C6" },
      { "label": "StubHub", "url": "https://www.stubhub.com/los-angeles-chargers-inglewood-tickets-11-8-2026/event/160425251/?backUrl=%2Flos-angeles-chargers-tickets%2Fgrouping%2F282490&lt=33.9562003&lg=-118.353132&quantity=10" },
      { "label": "VividSeats", "url": "https://www.vividseats.com/los-angeles-chargers-tickets-inglewood-sofi-stadium-3-8-2026/production/6491380" },
    ],
  },
  {
    "title": "Jets vs. Chargers @ SoFi Stadium",
    "date": "Sunday, November 22, 2026",
    "location": "SoFi Stadium, Inglewood, CA",
    "startingPrice": 40,
    "links": [
      { "label": "Gametime", "url": "https://gametime.co/nfl-football/jets-at-chargers-tickets/11-22-2026-inglewood-ca-so-fi-stadium/events/698f56818501adce34d6e705" },
      { "label": "SeatGeek", "url": "https://seatgeek.com/los-angeles-chargers-tickets/11-22-2026-inglewood-california-sofi-stadium/nfl/18014262?quantity=10" },
      { "label": "Ticketmaster", "url": "https://www.ticketmaster.com/los-angeles-chargers-v-new-york-inglewood-california-11-22-2026/event/0A00646BA4DBE52E" },
      { "label": "StubHub", "url": "https://www.stubhub.com/los-angeles-chargers-inglewood-tickets-11-22-2026/event/160425250/?backUrl=%2Flos-angeles-chargers-tickets%2Fgrouping%2F282490&lt=33.9562003&lg=-118.353132&quantity=10" },
      { "label": "VividSeats", "url": "https://www.vividseats.com/los-angeles-chargers-tickets-inglewood-sofi-stadium-3-4-2026/production/6491358?quantity=8" },
    ],
  },
];

/*   STEP 4   */
/*
3 managers as an example. Uncomment (remove the //) before each line to make it live code
If you're having trouble, reference the Training Wheels' Manager Section
https://github.com/nmelhado/league-page/blob/master/TRAINING_WHEELS.md#ii-adding-managers-and-changing-the-homepage-text
*/

// To omit an optional field, set it's value to null

export const managers = [
    // {
    //   "roster": 1,  // ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy",
    //   "tradingScale": 10, // 1 - 10
    //   "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    // {
    //   "roster": 2,  // ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy",
    //   "tradingScale": 10, // 1 - 10
    //   "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    // {
    //   "roster": 3,  // ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy",
    //   "tradingScale": 10, // 1 - 10
    //   "preferredContact": "Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
  ]
  
  
  /*   !!  !!  IMPORTANT  !!  !! */
  /*
  Below is the most up to-date version of a manager. Please leave this commented out
  and don't delete it. This will be updated if any fields are added, removed or changed
  and will allow updates without causing merge conflicts
  */
  
    // {
    //   "roster": 3,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "managerID": "12345678",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy", // (optional)
    //   "tradingScale": 10, // 1 - 10 (optional)
    //   "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    
