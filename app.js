var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var hbs = require('hbs');//added

var app = express();
const fs = require('fs');


const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Setting up your routes
//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
//var parametersRouter = require('./routes/parameters');

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
//app.use('/parameters',parametersRouter);

//Registering Partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))
hbs.registerPartial('partial_name', 'partial value');

const storage = path.join(__dirname, '..', 'data', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

const List = sequelize.define('List', {
  name: { type: DataTypes.STRING, allowNull: false },
});

const Task = sequelize.define('Task', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
});

// 1. A List can contain multiple Tasks
List.hasMany(Task, {
  onDelete: 'CASCADE'   // If a List is deleted, delete its Tasks
});

// 2. A Task belongs to a single List
Task.belongsTo(List);

// Define Poll model (kept inline for simplicity)
const Poll = sequelize.define('Poll', {
  color: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
});

// old version - Ensure database tables exist
/*
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Unable to sync database:', err);
});
*/


async function syncDatabase() {
  try {
    // 'alter: true' checks the current tables and adds missing columns
    // without deleting existing data.
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized! Missing columns have been added.");
  } catch (error) {
    console.error("❌ Sync failed:", error);
  }
}

syncDatabase();


// Register an equality helper so templates can do: {{#if (eq v1 v2)}}
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET page2 */
app.get('/page2', function (req, res, next) {
  res.render('page2', { title: 'Page2' });
});

/* GET home page. */
app.get('/parameters/:name', function (req, res) {
  //res.render('page2', { title: 'Page2' });
  // access the route parameter named `name` via `req.params.name`
  // res.send('user ' + req.params.name);
  res.render('index', { title: req.params.name });
});

app.get('/form', function (req, res) {
  res.render('form', { title: 'The Form' });
});

app.get('/addtask', function (req, res) {
  res.render('addtask', { title: 'The Form' });
});

/* POST create task */
app.post('/addtask', async function (req, res, next) {
  try {
    const created = await Task.create({ name: req.body.name, description: req.body.description });
    // render a clearer confirmation page for the saved task
    res.render('task_submitted', { title: 'Task Saved', task: created });
  } catch (err) {
    next(err);
  }
});



/* GET tasks list (JSON) */
app.get('/tasks', async function (req, res, next) {
  try {
    const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

/* GET tasks page (HTML) */
app.get('/taskspage', async function (req, res, next) {
  try {
    const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
    // render an HTML page with the tasks
    res.render('taskspage', { title: 'Tasks', tasks });
  } catch (err) {
    next(err);
  }
});

/* POST delete a task */
app.post('/tasks/:id/delete', async function (req, res, next) {
  try {
    const id = req.params.id;
    await Task.destroy({ where: { id } });
    // redirect back to the tasks page
    res.redirect('/taskspage');
  } catch (err) {
    next(err);
  }
});


/* GET single-chart route */
app.get('/chart', async function (req, res, next) {
  //res.render('charts', { title: 'Chart' });
  try {
    const poll = await Poll.findAll({ order: [['createdAt', 'DESC']] });


    // render an HTML page with the tasks
    res.render('charts', { title: 'Chart', poll, pollJSON: JSON.stringify(poll) });
  } catch (err) {
    next(err);
  }
});

/* POST chart form handler: increment existing color entry or create it, then redirect to /chart */
app.post('/chart', async function (req, res, next) {
  try {
    const color = req.body.color;
    if (!color) return res.redirect('/chart');
    // Find existing entry for this color
    const existing = await Poll.findOne({ where: { color } });
    if (existing) {
      // increment and save
      //existing.amount = (existing.amount || 0) + 1;
      if (existing.amount) {
        // If 'existing.amount' exists and is not 0 (it's "truthy")
        existing.amount = existing.amount + 1;
      } else {
        // If 'existing.amount' is missing (undefined) or 0 (it's "falsy")
        existing.amount = 1;
      }
      await existing.save();
    } else {
      // create new entry with amount 1
      await Poll.create({ color, amount: 1 });
    }
    // redirect back to the chart page
    res.redirect('/chart');
  } catch (err) {
    next(err);
  }
});

app.get('/p5', async function (req, res, next) {
  //res.render('p5js', { title: 'p5js' });
  try {
    const poll = await Poll.findAll({ order: [['createdAt', 'DESC']] });


    // render an HTML page with the tasks
    res.render('p5js', { title: 'p5js', pollJSON: JSON.stringify(poll) });
  } catch (err) {
    next(err);
  }
});

app.get('/addlist', function (req, res, next) {
  res.render('addlist', { title: 'Add List' });
});



app.post('/addlist', async function (req, res, next) {
  console.log('Received addlist POST:', req.body);
  try {
        // req.body is now the clean JSON object
        const list = await List.create(req.body, {
            include: [Task]
        });
        res.json(list);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/lists', async (req, res) => {
  try {
    // 1. Fetch Lists AND their associated Tasks
    const listsFromDB = await List.findAll({
      include: [Task], // This performs the SQL JOIN
      order: [['createdAt', 'DESC']] // Optional: Show newest lists first
    });

    // 2. Convert Sequelize Instances to Plain JSON
    // Handlebars often blocks access to complex prototype objects for security.
    // .map(l => l.get({ plain: true })) fixes this.
    const plainLists = listsFromDB.map(list => list.get({ plain: true }));

    // 3. Render the view and pass the data
    res.render('viewlists', { 
      lists: plainLists,
      pageTitle: 'All Lists' 
    });

  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).send('Error loading lists');
  }
});

app.get('/delete-all', async (req, res) => {
    try {
        // Deleting all Lists will automatically delete all Tasks 
        // because of the "onDelete: 'CASCADE'" setting in your association.
        await List.destroy({
            where: {}, // Empty object means "match everything"
            truncate: false // Set to true if you want to reset IDs to 1 (depends on DB support)
        });

        await Task.destroy({
            where: {}, // Empty object means "match everything"
            truncate: false // Set to true if you want to reset IDs to 1 (depends on DB support)
        });

        res.status(200).json({ message: 'All lists and tasks have been deleted.' });
    } catch (error) {
        console.error('Error clearing database:', error);
        res.status(500).json({ error: 'Failed to clear database' });
    }
});

// ----- Tracker v1 routes -----

// Reads saved drinks from the Version 1 cookie.
function readDrinkDiaryV1(req) {
  try {
    const saved = req.cookies.drinkDiary_v1;
    const parsed = typeof saved === 'string'
      ? JSON.parse(saved || '[]')
      : saved;

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

// Shows the form for adding drinks.
app.get('/tracker/v1', function (req, res) {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Drink Diary</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f8f5;
          color: #333;
          margin: 0;
        }

        main {
          max-width: 600px;
          margin: 40px auto;
          padding: 25px;
        }

        h1 { color: #426b50; }

        label {
          display: block;
          margin-top: 18px;
          margin-bottom: 6px;
        }

        input, select {
          box-sizing: border-box;
          width: 100%;
          padding: 10px;
          border: 1px solid #bbb;
          border-radius: 3px;
          font: inherit;
          background: white;
        }

        button {
          background: #426b50;
          color: white;
          border: none;
          padding: 11px 20px;
          margin-top: 22px;
          cursor: pointer;
          font: inherit;
        }

        a { color: #426b50; }
      </style>
    </head>
    <body>
      <main>
        <h1>Drink Diary</h1>
        <p>A simple way to keep track of what you drink each day.</p>

        <form action="/tracker/v1" method="POST">
          <label for="date">Date</label>
          <input type="date" id="date" name="date" required>

          <label for="drink">Drink Type</label>
          <select id="drink" name="drink" required>
            <option value="Water">Water</option>
            <option value="Coffee">Coffee</option>
            <option value="Tea">Tea</option>
            <option value="Juice">Juice</option>
          </select>

          <label for="ounces">Amount (oz)</label>
          <input type="number" id="ounces" name="ounces" min="1" required>

          <button type="submit">Add Drink</button>
        </form>

        <p><a href="/tracker/v1/dashboard">View Dashboard</a></p>
      </main>
    </body>
    </html>
  `);
});

// Saves a new drink to the cookie.
app.post('/tracker/v1', function (req, res) {
  const date = req.body.date;
  const drink = req.body.drink;
  const ounces = Number(req.body.ounces);

  // Check that the form has valid information.
  if (!date || !drink || !Number.isFinite(ounces) || ounces <= 0) {
    return res.status(400).send('Please enter valid drink information.');
  }

  // Get the drinks that were already saved.
  const drinks = readDrinkDiaryV1(req);

  // Add the new drink.
  drinks.push({
    date: date,
    drink: drink,
    ounces: ounces
  });

  // Keep only the most recent 30 entries.
  const recentDrinks = drinks.slice(-30);

  // Save the updated list in a cookie for 7 days.
  res.cookie('drinkDiary_v1', JSON.stringify(recentDrinks), {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  });

  // Go to the dashboard after saving.
  res.redirect('/tracker/v1/dashboard');
});

// Shows the Drink Diary dashboard.
app.get('/tracker/v1/dashboard', function (req, res) {
  const drinks = readDrinkDiaryV1(req);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Drink Diary Dashboard</title>

      <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"></script>

      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f8f8f5;
          color: #333;
          margin: 0;
        }

        main {
          max-width: 750px;
          margin: 35px auto;
          padding: 20px;
        }

        h1, h2 {
          color: #426b50;
        }

        h2 {
          font-size: 20px;
        }

        section {
          background: white;
          border: 1px solid #ddd;
          padding: 20px;
          margin: 20px 0;
        }

        .chart-area {
          position: relative;
          height: 270px;
        }

        a {
          color: #426b50;
        }

        button {
          background: #426b50;
          color: white;
          border: none;
          padding: 10px 16px;
          cursor: pointer;
          font: inherit;
        }

        #cupSketch {
          width: 100%;
          overflow-x: auto;
        }
      </style>
    </head>

    <body>
      <main>
        <h1>My Drink Dashboard</h1>
        <p>Here's a look at the drinks I've recorded.</p>

        <p><a href="/tracker/v1">Add Another Drink</a></p>

        <section>
          <h2>Drinks by Day</h2>
          <div class="chart-area">
            <canvas id="dailyChart"></canvas>
          </div>
        </section>

        <section>
          <h2>Types of Drinks</h2>
          <div class="chart-area">
            <canvas id="typeChart"></canvas>
          </div>
        </section>

        <section>
          <h2>My Drink Cups</h2>
          <p>Each cup represents a drink I've added.</p>
          <div id="cupSketch"></div>
        </section>

        <form action="/tracker/v1/dashboard" method="POST">
          <button type="submit">Clear all data</button>
        </form>
      </main>

      <script>
        // Get the drink entries sent by Express.
        const entries = ${JSON.stringify(drinks).replace(/</g, '\\u003c')};

        // Calculate the total ounces recorded each day.
        const dates = [...new Set(entries.map(entry => entry.date))].sort();

        const dailyTotals = dates.map(date => {
          return entries
            .filter(entry => entry.date === date)
            .reduce((sum, entry) => sum + entry.ounces, 0);
        });

        // Create a bar chart showing daily drink totals.
        new Chart(document.getElementById('dailyChart'), {
          type: 'bar',
          data: {
            labels: dates,
            datasets: [{
              label: 'Ounces',
              data: dailyTotals,
              backgroundColor: '#7a9b80'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Total Ounces per Day'
              }
            },
            scales: {
              x: {
                title: { display: true, text: 'Date' }
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Ounces' }
              }
            }
          }
        });

        // Calculate total ounces for each drink type.
        const drinkTypes = ['Water', 'Coffee', 'Tea', 'Juice'];

        const drinkTotals = drinkTypes.map(type => {
          return entries
            .filter(entry => entry.drink === type)
            .reduce((sum, entry) => sum + entry.ounces, 0);
        });

        // Create a doughnut chart showing drink categories.
        new Chart(document.getElementById('typeChart'), {
          type: 'doughnut',
          data: {
            labels: drinkTypes,
            datasets: [{
              data: drinkTotals,
              backgroundColor: [
                '#8ab6d6',
                '#a78970',
                '#83a78a',
                '#e8b174'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Ounces by Drink Type'
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        });

        // Draw one cup for each drink using p5.js.
        new p5(function(p) {
          let columns;

          p.setup = function() {
            const drawingWidth = Math.min(
              650,
              document.getElementById('cupSketch').clientWidth
            );

            columns = Math.max(1, Math.floor(drawingWidth / 110));
            const rows = Math.ceil(entries.length / columns);

            p.createCanvas(
              drawingWidth,
              Math.max(125, rows * 130)
            ).parent('cupSketch');

            p.noLoop();
          };

          p.draw = function() {
            p.background('#ffffff');
            p.textAlign(p.CENTER);
            p.textSize(12);

            if (entries.length === 0) {
              p.fill('#555555');
              p.noStroke();
              p.text('No drinks logged yet.', p.width / 2, 60);
              return;
            }

            const colors = {
              Water: '#8ab6d6',
              Coffee: '#a78970',
              Tea: '#83a78a',
              Juice: '#e8b174'
            };

            entries.forEach(function(entry, index) {
              const x = 20 + (index % columns) * 110;
              const y = 10 + Math.floor(index / columns) * 130;

              const fillHeight = Math.min(entry.ounces / 24, 1) * 60;

              // Fill the cup based on the recorded ounces.
              p.noStroke();
              p.fill(colors[entry.drink] || '#aaaaaa');
              p.rect(x + 3, y + 78 - fillHeight, 54, fillHeight);

              // Draw the outside of the cup.
              p.noFill();
              p.stroke('#555555');
              p.strokeWeight(2);
              p.rect(x, y + 10, 60, 70);

              // Show the drink type and ounces.
              p.noStroke();
              p.fill('#333333');
              p.text(entry.drink, x + 30, y + 100);
              p.text(entry.ounces + ' oz', x + 30, y + 116);
            });
          };
        });
      </script>
    </body>
    </html>
  `);
});

 // Clears all saved drinks from the Version 1 cookie.
app.post('/tracker/v1/dashboard', function (req, res) {
  // Delete the cookie containing the drink entries.
  res.clearCookie('drinkDiary_v1');

  // Return to the dashboard after clearing the data.
  res.redirect('/tracker/v1/dashboard');
});




app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
