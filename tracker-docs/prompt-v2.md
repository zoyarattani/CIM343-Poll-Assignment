
## Test log for v1

| What I tested | What happened | What I want instead |
|---|---|---|
| Added 16 oz of water | The entry saved and appeared on the dashboard. | Keep this working in v2. |
| Added 12 oz of coffee | Both charts updated, and a second cup appeared in the drawing. | Keep the charts and drawing updating with each entry. |
| Refreshed the dashboard | My saved entries were still there. | Keep the data saved after refreshing. |
| Clicked Clear all data | The saved entries disappeared from the dashboard. | Keep this feature, but add a confirmation before deleting everything. |
| Left the amount field empty | The browser asked me to fill out the field. | Keep the required field validation. |
| Entered -5 ounces | The browser did not let me submit the negative number. | Keep blocking negative amounts. |
| Entered 9999 ounces | The form accepted it even though that is an unrealistic amount for one drink. | Limit the amount to 1–64 ounces and show a helpful message for invalid input. |

### What I learned from testing

Most of Version 1 worked the way I expected. The drinks were saved in cookies, and the charts and cup drawing changed when I added another entry. Refreshing and clearing the data also worked.

The main issue I found was that the form accepted 9999 ounces. For Version 2, I want better input validation so users can only enter reasonable amounts. I also want to make the form and dashboard a little easier to use without making the design too complicated.

# Prompt Script v2 (Final)

## Goal

I want to improve my Drink Diary website, which helps people keep track of what they drink each day. Users should be able to record their drinks and see their habits through two charts and a drawing made with p5.js.

I already made Version 1 and tested it. Most of it worked, but I noticed that the form accepted unrealistic amounts like 9999 ounces. I want Version 2 to have better validation and a slightly more organized layout.

## Where it lives

- This is part of my existing Express.js application.
- My main Express file is app.js.
- The project already uses cookie-parser.
- Keep all my existing routes, including my poll assignment.
- Keep the Version 1 tracker routes exactly as they are.
- Add the Version 2 routes underneath the Version 1 routes, before the 404 handler.
- Do not install any additional npm packages.

## Data

Each drink entry should contain three fields:

- date: a string in YYYY-MM-DD format
- drink: a string representing the type of drink
- ounces: a number representing the amount consumed

Example:

{ date: "2026-11-11", drink: "Water", ounces: 16 }

Use the cookie name "drinkDiary_v2" so Version 2 has separate data from Version 1.

The cookie should last for 7 days using maxAge.

Only keep the 30 most recent entries to avoid exceeding the cookie size limit.

## Routes (Express + cookie-parser)

### /tracker/v2

Create a simple page for recording drinks.

The page should contain:

- A heading that says "Drink Diary"
- A short description of the website
- A date input
- A dropdown for Water, Coffee, Tea, and Juice
- A number input for ounces
- An "Add Drink" button
- A link to the dashboard

When the form is submitted:

1. Read the existing cookie data using req.cookies.
2. Check that the date is valid and in YYYY-MM-DD format.
3. Check that the drink type is one of the four allowed choices.
4. Check that ounces is a whole number between 1 and 64.
5. If the input is invalid, show a helpful error message without saving the entry.
6. If the input is valid, add it to the existing entries.
7. Keep only the 30 most recent entries.
8. Save the updated list using res.cookie.
9. Redirect to the Version 2 dashboard.

Use a POST route to handle form submissions.

Set the number input's min to 1 and max to 64, but also validate the value in Express so invalid requests cannot bypass the browser restrictions.

### /tracker/v2/dashboard

Create a dashboard displaying all saved drinks.

Read the data from req.cookies and use it to build both charts and the p5.js sketch.

Include:

- A heading saying "My Drink Dashboard"
- A short explanation of what the dashboard shows
- A summary showing the number of drinks recorded
- A bar chart showing total ounces per day
- A doughnut chart showing amounts by drink type
- A p5.js drawing of cups
- An "Add Another Drink" link
- A "Clear all data" button

If no drinks have been recorded, display a friendly message explaining that the user can add their first drink.

The Clear all data button should ask for confirmation before deleting anything.

Use a POST route that calls res.clearCookie to remove the Version 2 cookie and redirect back to the dashboard.

Do not delete Version 1 data.

## Chart 1 (Chart.js)

Create a bar chart titled "Drinks by Day".

- Chart type: Bar
- X-axis: Date
- Y-axis: Total ounces
- Each bar represents the total ounces recorded on that date.
- Use muted green bars.
- Sort the dates in chronological order.
- Include readable axis labels.
- Calculate the data from the saved cookie entries.

## Chart 2 (Chart.js)

Create a doughnut chart titled "Types of Drinks".

- Chart type: Doughnut
- Show the total ounces for each drink category.
- Water: muted blue
- Coffee: light brown
- Tea: muted green
- Juice: soft orange
- Include a legend identifying each drink type.
- Calculate the amounts from the cookie data.
- Do not use hard-coded totals.

## p5.js Sketch

Create a drawing called "My Drink Cups".

- Draw one cup for each saved drink entry.
- The liquid level should depend on the number of ounces entered.
- A drink with more ounces should have a fuller cup.
- Since the maximum is 64 ounces, use 64 as the full-cup amount.
- Use a different liquid color for each drink type.
- Show the drink name and ounces underneath each cup.
- Arrange the cups in rows if there are several entries.
- Make sure the cups fit inside the dashboard section.
- If there are no entries, display "No drinks logged yet."
- The drawing must update whenever the saved data changes.

## Design

I want the website to look like a normal student-made class project, not a professional analytics dashboard.

Keep the design similar to my FreshTrack project, which uses a simple, easy-to-follow layout.

Use:

- A white or off-white background
- Muted green headings and buttons
- Arial or another basic font
- Simple navigation links
- Normal-sized headings and text
- Basic borders and rectangular sections
- Consistent spacing between form fields
- A layout that works on both desktop and mobile

Avoid:

- Gradients
- Glass effects
- Oversized dashboard cards
- Excessive rounded corners
- Unnecessary animations
- Emoji decorations
- Complicated navigation
- Overly polished AI-generated styling

I want the website to feel clean and organized without being overly designed.

## Improvements from Version 1

Based on my testing, make these changes:

1. Limit drink amounts to whole numbers between 1 and 64 ounces.
2. Show a helpful message when someone enters invalid information.
3. Ask for confirmation before clearing saved data.
4. Show the total number of recorded drinks on the dashboard.
5. Improve spacing and readability without making the design too complicated.
6. Keep both charts and the p5.js sketch updated using the saved cookie data.
7. Include a clear empty state when no drinks have been recorded.

## Rules / Constraints

- Use plain HTML, CSS, and JavaScript.
- Do not use React or front-end frameworks.
- Use Express.js and cookie-parser for saving and reading data.
- Do not use localStorage or document.cookie.
- Load Chart.js and p5.js through CDN links.
- Comment every function so I can understand it.
- Handle empty or invalid cookie data without crashing the website.
- Safely pass the cookie data into the dashboard JavaScript.
- Keep the existing Version 1 code unchanged.
- Do not change my previous assignment routes.
- Add this comment above the new routes:

  // ----- Tracker v2 routes -----

- Give me the complete Version 2 code to add to app.js.
- Clearly explain where the code should be pasted.
