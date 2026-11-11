
# Prompt Script v1

## Goal
I want to make a simple website called Drink Diary that lets people keep track of what they drink throughout the day. Users should be able to enter their drinks and see their habits through charts and a drawing.

## Where it lives
- Add this tracker to my existing Express.js project.
- My main Express file is app.js.
- My project already uses cookie-parser.
- Do not delete or change any existing routes or files.
- Do not install any additional npm packages.
- Put the new routes in app.js before the existing 404 handler.

## Data
Each drink entry should contain:
- date: a string, such as "2026-11-11"
- drink: a string, such as "Water"
- ounces: a number, such as 16

Example:
{ date: "2026-11-11", drink: "Water", ounces: 16 }

Use the cookie name "drinkDiary_v1".

The cookie should last for 7 days using maxAge. Keep the 30 most recent entries so the cookie doesn't become too large.

## Routes (Express + cookie-parser)

### /tracker/v1
Create a page with a simple form where users can log a drink.

The form should include:
- A date input
- A dropdown with Water, Coffee, Tea, and Juice
- A number input for ounces
- An "Add Drink" button
- A link to the dashboard

When the user submits the form, read the existing entries using req.cookies, add the new entry, and save the updated list using res.cookie.

Use a POST handler for submitting the form.

### /tracker/v1/dashboard
Create a dashboard displaying the saved drink entries.

Read the data from req.cookies and use it to create two Chart.js charts and one p5.js sketch.

Include:
- A heading that says "My Drink Dashboard"
- A bar chart
- A doughnut chart
- A p5.js drawing
- A link back to the tracker
- A "Clear all data" button

Use a POST handler on the dashboard route to clear the cookie with res.clearCookie, then redirect back to the dashboard.

## Chart 1 (Chart.js)
Create a bar chart titled "Drinks by Day".

- X-axis: Dates
- Y-axis: Total ounces
- Each bar shows the total ounces recorded on that date.
- Use a muted green color for the bars.
- Calculate the totals using the saved cookie entries, not hard-coded data.

## Chart 2 (Chart.js)
Create a doughnut chart titled "Types of Drinks".

- Show the total ounces recorded for each drink category.
- Water should be blue.
- Coffee should be brown.
- Tea should be green.
- Juice should be orange.
- Include a legend showing each drink type.
- Calculate all values using the saved cookie entries.

## p5.js Sketch
Create a drawing called "My Drink Cups".

- Draw one small cup for each saved drink entry.
- The amount of liquid inside each cup depends on the number of ounces entered.
- Use different liquid colors based on the drink type.
- Display the drink name below each cup.
- The drawing should update when a new drink is recorded.
- Keep the sketch inside the dashboard layout alongside the charts.

## Design
I want the website to look like a simple student project, similar in style to a basic class website.

- Use plain HTML, CSS, and JavaScript.
- Use Arial or another simple font.
- Use a white or off-white background.
- Use muted green for headings and buttons.
- Keep the navigation and layout simple.
- Use normal-sized text and basic rectangular sections.
- Avoid gradients, glass effects, animations, oversized cards, and overly polished dashboard designs.
- Make it usable on a laptop and phone.
- Keep the wording natural and straightforward.

## Rules / Constraints
- Do not use React or other front-end frameworks.
- Store data in cookies on the Express server using cookie-parser.
- Do not use localStorage or document.cookie.
- Load Chart.js and p5.js using CDN links.
- Comment every function so I can understand the code.
- Include the "Clear all data" button.
- Do not change my existing Express application functionality.
- Add a comment above the new routes saying:
  // ----- Tracker v1 routes -----
- Give me code that I can add to my existing app.js file.
- Explain where the code should be pasted.
