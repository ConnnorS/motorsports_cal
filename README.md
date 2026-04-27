# Motorsports Cal [work in progress]
Motorsports Cal is a simple Next.js + React project which brings together the calendars of major racing venues and tracks from around Australia into a single, searchable calendar with better filtering capabilities.

## Problem & Solution
We all love bringing our cars to the race track. Whether it's drag racing, roll racing, hot laps, or drifting, Australia has a plethora of venues that have these things on offer. However, finding the right time, place, and event is often a long process which involves checking the calendars of major tracks in your area and scrolling through event listing, all for the event to be changed last minute and your plans ruined.

Motorsports Cal fixes that by bringing together all the publicly accessible venues and timetables from motorsports venues around Australia into a single calendar with search and filtering capabilities. Users can select what venues they'd like to do to, the month or weekend they're interested in, and even find events by keyword so they're not overwhelmed with hundreds of options.

## Features
### Venue Selection and Keyword Search Displayed on a Viewable Calendar
![Screenshot of the calendar with venues selected and a search filter with the value "drift" applied](/images/simple_filter.png)

### Easy Month Switching and Selection
![alt text](/images/month_switch.png)

### View Event Description and Details
![alt text](/images/event_view.png)

## Upcoming Features
### More Advanced Search Features with Date Fine-Tuning
![alt text](/images/advanced_search.png)

### Event Bookmarking and Event Lists

### Support for More Venues

# Technical Guide

## Getting Setup
### Pre-Requisites
- Node.js 25.9 or later
- npm 11.12 or later

Very little is required for setup as this project currently doesn't use any databases or cloud resources.

It can be cloned with 
```
git clone https://github.com/ConnnorS/motorsports_cal.git
```

Once the project is open, cd into the `src` folder using:
```
cd src
```

Install all your Node packages using:
```
npm install
```

Finally, start your project using:
```
npm run dev
```

## Frameworks, Technologies, and Libraries
- Next.js w/ App Router
- TypeScript
- Mantine UI

## Using Public APIs

### The CMS API
The "CMS" API is a service and API which a lot of venues in Australia appear to be using to manage their events and what their websites use to get the events to display on their respective calendars. As of time of writing **Queensland Raceway, Lakeside Park, and Morgan Park** all use the CMS system. The API's url is something along the lines of `cms.[venue].com.au/api/v1/[venue]/event`. This provides some good flexibility and the ability to write the same code for multiple venues' API's. You'll find all the code for the CMS API venues in `src\app\_api\cms.ts`.

### Other APIs
APIs that other venues' websites use are hard-coded into their own files in `src\app\_api`

## Data Conversion and Data Flow

### The `IndividualEvent` Common Type