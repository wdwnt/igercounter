# igercounter

Daily forecast of WDW page to be created and shared

 There is a page for weach park with index being Walt Disney World
 
## Sections

There are currently two different sections on each page and they are as follows

---
### Park Hours

- Park Hours will include each of the parks at a specific location (i.e. Magic Kingdom, EPCOT...)
- Each Park will display the following
    - Park image
    - Park Name
    - Park Hours for the current Day 
- These parks and hours are pulled from the [https://wdwnt-now-api.herokuapp.com](https://wdwnt-now-api.herokuapp.com/api/destinations/0/parks?sort=true) service.
     - The parks need to be setup in that system BEFORE a page can be added to this repo.

--- 
### Weather
- Provided by Dark Sky
- [weather.wdwnt.com](https://weather.wdwnt.com/api/wdw) is the internal service that gets the weather for each park
    - Each park will need to be setup in this repo BEFORE the weather can be pulled for the specific location

## App layout

- Each page needs to have a specific name that relates to the Park short code used for the [weather.wdwnt.com](https://weather.wdwnt.com/api/wdw) app.


| Pages         | Park Name       |
| ------------- |:-------------:| 
| index.html    | Walt Disney World | 
| dlr.html      | Disneyland Resort | 
| tdr.html      | Tokyo Disneyland | 
| dlp.html      | Disneyland Paris | 
| hkdl.html     | Hong Kong Disneyland | 
| shdl.html     | Shanghai Disneyland | 
