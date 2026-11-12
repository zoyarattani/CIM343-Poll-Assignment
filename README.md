
# Cookie Tracker – Drink Diary

**Course:** CIM 343 – Front End Fundamentals  
**Semester:** Fall 2026

**Video walkthrough:** [Watch my Drink Diary walkthrough](https://drive.google.com/file/d/1eSZfHUzX677c7-Qjcdbtynd52u0hUMVn/view?usp=sharing)

## What I tracked and why

For this assignment, I created Drink Diary, a website where users can keep track of what they drink throughout the day. Each entry includes the date, drink type, and amount in ounces. The available categories are water, coffee, tea, and juice.

I picked a drink tracker because it's a simple idea that I could easily test with different entries. I also liked being able to compare the drink types and see how the amounts added up over several days.

I used Express.js and cookie-parser to save entries, Chart.js for two charts, and p5.js for a drawing of cups based on the recorded drinks.

## Version 1 (Prompt v1)

[View Prompt v1](tracker-docs/prompt-v1.md)

### Version 1 dashboard

![Version 1 Dashboard](tracker-docs/images/v1-dashboard.png)

### What worked and what didn't

I started by testing whether I could add a drink and see it on the dashboard. I logged 16 ounces of water, then added 12 ounces of coffee. Both charts updated, and a second cup appeared in the p5.js drawing.

I also refreshed the dashboard, and the drinks were still there. When I clicked **Clear all data**, the entries disappeared as expected.

The issue I found was with the amount field. The browser stopped me from leaving it empty or entering a negative number, but it accepted 9999 ounces. I hadn't specified an upper limit in my first prompt, so that became one of the main things I wanted to change for Version 2.

## Version 2 – Final

[View Prompt v2 and the Version 1 test log](tracker-docs/prompt-v2.md)

For Version 2, I kept the same drink-tracking idea and simple design. I focused on making the form more specific about what it accepts and making the dashboard a little easier to read.

### Final form

![Version 2 Form](tracker-docs/images/v2-form.png)

The updated form has the same three fields, but the amount now needs to be a whole number between 1 and 64 ounces. I also made users choose a drink type instead of leaving one selected by default, and added a note under the amount field explaining the allowed range.

### Final dashboard

![Version 2 Dashboard](tracker-docs/images/v2-dashboard.png)

The final dashboard includes a summary of the number of drinks and total ounces, two charts, and the cup drawing. During testing, I added five entries, and the summary showed **5 drinks and 66 total ounces**.

I kept the styling pretty basic: a light background, green headings and buttons, plain borders, and no extra animations. I wanted it to look like a straightforward class project rather than a complicated dashboard.

### Cookie storage

![Version 2 Cookie in DevTools](tracker-docs/images/v2-cookie-devtools.png)

I opened Chrome DevTools and checked **Application → Cookies** to see the entries saved in `drinkDiary_v2`.

Version 1 uses `drinkDiary_v1` and Version 2 uses `drinkDiary_v2`, so testing one version doesn't overwrite the other one's entries. Each cookie is set to last seven days, and the code keeps only the most recent 30 entries to avoid storing too much information.

### Biggest changes from Version 1

The most useful change was the amount validation. Version 1 accepted 9999 ounces, while Version 2 blocks anything outside the 1–64 ounce range. I added checks in the Express route as well as restrictions on the HTML number input.

I also added a confirmation before clearing the data and a summary at the top of the dashboard. Those were small changes, but they made the app clearer to use.

## Testing and improvements

I tested Version 1 before writing my second prompt. These results helped me decide what to keep and what to change.

| What I tested in Version 1 | What happened | What I wanted for Version 2 |
|---|---|---|
| Added 16 oz of water | The drink appeared on the dashboard | Keep saving and displaying entries |
| Added 12 oz of coffee | Both charts updated and another cup appeared | Keep all three visualizations tied to saved data |
| Refreshed the dashboard | The entries stayed there | Keep cookie persistence |
| Left the amount empty | The browser asked me to fill out the field | Keep required-field validation |
| Entered -5 ounces | The browser blocked the value | Keep the minimum amount |
| Entered 9999 ounces | The form accepted it | Set a reasonable maximum of 64 ounces |
| Clicked Clear all data | The saved entries disappeared immediately | Ask for confirmation before clearing |

### Testing Version 2

| What I tested | What happened |
|---|---|
| Added five drinks | The summary showed 5 drinks and 66 oz |
| Checked the charts | The bar chart showed dates and totals, and the doughnut chart showed the drink categories |
| Checked the p5.js drawing | Five labeled cups appeared with different fill levels and colors |
| Opened DevTools | I could see `drinkDiary_v2` and its saved value |
| Tried entering 9999 ounces | The browser showed that the amount had to be between 1 and 64 |
| Clicked Clear all data | A confirmation popup appeared |
| Clicked Cancel | The entries remained on the dashboard |
| Tried confirming Clear all data | I initially got a 404 page because the POST route was in the wrong place in `app.js` |

### What I learned from testing

When I first tried the app with normal entries, it seemed fine. The charts changed, the cups appeared, and the data stayed saved. Trying unusual values was what helped me find a problem with the form.

I made my second prompt more specific about valid inputs rather than just asking for an amount field. I also realized that the clear button needed a confirmation, since someone could easily click it by mistake.

Testing the completed version mattered too. The confirmation popup worked, but I found a separate routing issue when I actually tried to clear the data. That wasn't obvious from just looking at the dashboard.

## Hand edits I made

I added the AI-generated tracker code to my existing `app.js` instead of starting a separate Express project. I kept the routes from my previous poll assignment and left the Version 1 tracker routes in place so they could be compared with Version 2.

The main hand edit was fixing the Version 2 **Clear all data** route. When I tried to clear the entries, Express sent me to a 404 page. I looked through `app.js` and found that the POST route for clearing the cookie was below the 404 handler. I moved that route above the handler so Express could reach it, then restarted the server.

I also made the `tracker-docs` folder, saved the screenshots, and updated this README with the testing notes, code explanations, and video link.

## How my code works

The code for both tracker versions is in [app.js](app.js). These are the main parts I looked at to understand how the tracker saves and displays its data.

### Saving the cookie

This section comes from the Version 2 POST route after it checks the submitted values:

```javascript
const drinks = readDrinkDiaryV2(req);

drinks.push({
  date: date,
  drink: drink,
  ounces: ounces
});

const recentDrinks = drinks.slice(-30);

res.cookie('drinkDiary_v2', JSON.stringify(recentDrinks), {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax'
});

res.redirect('/tracker/v2/dashboard');
```

First, `readDrinkDiaryV2(req)` gets the drinks that were previously saved. Inside that helper, `req.cookies` is used to read the cookie, and `JSON.parse()` turns the stored text back into an array.

`drinks.push()` adds the new entry to that array. I used `.slice(-30)` to keep the last 30 entries because cookies have limited storage space. Then `JSON.stringify()` converts the list back into text, and `res.cookie()` saves it under the Version 2 cookie name for seven days.

After saving, `res.redirect()` takes the user to the dashboard so the new entry can be displayed.

### Getting the data to the dashboard

This is an excerpt from the beginning of the Version 2 dashboard route:

```javascript
app.get('/tracker/v2/dashboard', function (req, res) {
  const drinks = readDrinkDiaryV2(req);

  const totalDrinks = drinks.length;
  const totalOunces = drinks.reduce(function (sum, entry) {
    return sum + Number(entry.ounces || 0);
  }, 0);

  const safeDrinks = JSON.stringify(drinks).replace(/</g, '\\u003c');

  // The route continues by sending the dashboard HTML.
```

When someone opens the dashboard, Express reads the `drinkDiary_v2` cookie again. `drinks.length` gives the number of entries, and `.reduce()` adds up all the ounces for the summary at the top.

The route also turns the entries into JSON so the JavaScript in the page can use them. In the HTML sent by Express, the data is inserted with:

```javascript
const entries = ${safeDrinks};
```

That's what connects the stored drinks to the charts and cup drawing. The full route, including the HTML, is in `app.js`.

### Chart 1 – Drinks by Day

```javascript
const dates = [...new Set(entries.map(function (entry) {
  return entry.date;
}))].sort();

const dailyTotals = dates.map(function (date) {
  return entries
    .filter(function (entry) {
      return entry.date === date;
    })
    .reduce(function (sum, entry) {
      return sum + entry.ounces;
    }, 0);
});
```

The bar chart shows total ounces by date. The code first collects the dates from the saved entries. `Set` removes duplicates, which matters if more than one drink was logged on the same day, and `.sort()` puts the dates in order.

For each date, `.filter()` finds the entries from that day, and `.reduce()` adds their ounces. So if I log 16 ounces and 20 ounces on the same day, the chart shows one bar at 36 ounces. The dates are on the x-axis and ounces are on the y-axis.

### Chart 2 – Types of Drinks

```javascript
const drinkTypes = ['Water', 'Coffee', 'Tea', 'Juice'];

const drinkTotals = drinkTypes.map(function (type) {
  return entries
    .filter(function (entry) {
      return entry.drink === type;
    })
    .reduce(function (sum, entry) {
      return sum + entry.ounces;
    }, 0);
});
```

The doughnut chart compares how many ounces were recorded for each type of drink. It uses `.filter()` to find entries for one category at a time, then `.reduce()` to add the amounts together.

Each category has its own color: blue for water, brown for coffee, green for tea, and orange for juice. The values come from the cookie data, so adding another drink changes the chart instead of showing a fixed example.

### p5.js sketch – My Drink Cups

This is the calculation used to decide how high the liquid should be drawn inside each cup:

```javascript
const fillHeight = Math.min(entry.ounces / 64, 1) * 65;
```

The drawing also uses different colors for the categories:

```javascript
const colors = {
  Water: '#8ab6d6',
  Coffee: '#a78970',
  Tea: '#83a78a',
  Juice: '#e8b174'
};
```

The sketch draws one cup for each entry. The drink category decides the liquid color, while the ounces control the fill height. Since Version 2 allows up to 64 ounces, a 16-ounce entry fills about one-quarter of the cup, and a 32-ounce entry fills about half.

It also puts the drink name and amount underneath each cup. When more drinks are added, more cups appear in rows. If the cookie is empty, the drawing says **No drinks logged yet.**

### Clearing the cookie

```javascript
app.post('/tracker/v2/dashboard', function (req, res) {
  res.clearCookie('drinkDiary_v2');
  res.redirect('/tracker/v2/dashboard');
});
```

When the user confirms the **Clear all data** action, the form sends a POST request to this route. `res.clearCookie()` removes the Version 2 cookie, and the redirect loads the dashboard again without those entries.

The button also has a browser confirmation. Choosing **Cancel** stops the POST request, which is why the saved drinks stay there. This route only clears `drinkDiary_v2`, not the Version 1 cookie.

## Something the AI got wrong

The first issue I found was the missing upper limit on the amount field. I tested the form with 9999 ounces and it accepted the entry. My first prompt said to include an amount field, but I hadn't explained what a reasonable amount should be. In Prompt v2, I specifically requested whole numbers from 1 to 64 and validation in Express as well as the form.

I also ran into the 404 error when clearing Version 2 data. In that case, the issue wasn't the button's appearance or the cookie itself. The clear route had been inserted after the 404 handler, so the request never reached it. I moved the route to the right place in `app.js`.

Both issues reminded me that I still needed to check the code and test the actual behavior, even when the AI generated most of the project.

## Running the tracker

Run these commands in the project terminal:

```bash
npm install
npm start
```

The Express app runs on port 3000 by default.

| Page | URL |
|---|---|
| Version 1 form | http://localhost:3000/tracker/v1 |
| Version 1 dashboard | http://localhost:3000/tracker/v1/dashboard |
| Version 2 form | http://localhost:3000/tracker/v2 |
| Version 2 dashboard | http://localhost:3000/tracker/v2/dashboard |

**Technologies used:** HTML, CSS, JavaScript, Express.js, cookie-parser, Chart.js, and p5.js.

---

# Previous Express and Poll Assignment

This repository also contains my earlier CIM 343 Express assignment, including the website theme color poll and some task and list management routes.

## Website Theme Color Poll

The poll asks: **Which color would you choose for a website theme?**

The five options are red, blue, yellow, green, and purple. I added green and purple to the original class example.

The poll uses Express.js, Handlebars, Sequelize, SQLite, and Chart.js. Votes are saved in the database and displayed in a bar chart.

[View my poll code](views/charts.hbs)

To open the poll, run `npm install` and `npm start`, then visit http://localhost:3000/chart.

## Other Express App Features

The project also includes task management, list management, a p5.js visualization, and the Drink Diary tracker. The main routes are in [app.js](app.js), the Handlebars templates are in `views`, and the static files are in `public`.
