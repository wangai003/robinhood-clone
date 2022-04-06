# Robinsock

Robinsock is a clone of Robinhood. On Robinsock you can see the prices and history of hundreds of stocks. You can create Watchlists and add stocks to those watchlists to better keep track of the movements of your assets or future assets. You can pretend to link a bank account, or several, and pull pretend money from those banks into your Robinhoot account. Using the fake money you now have in your account, known as Buying Power, you can pretend to purchase stocks to add to your portfolio. Then later on when those assets increase, or more likely decrease, you can sell those assets to make a profit/loss. While you have assets you can see the performance of your own portfolio on your Dashboard as a graph similar to the one that shows you individual stock performances.

# Technologies Used

* Frontend:
  * Javascript
  * React
  * Redux
  * HTML/CSS
* Backend:
  * Python
  * Flask
  * SQLAlchemy

## Getting started:

1. Clone with ```https://github.com/pierikm/robinhood-clone.git```
2. Run ```pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt``` in the root directory to install dependencies
3. Create a .env file in the root directory, and fill in the details using the .env.example
4. Create a user in postgres with the same name and password as in the .env file ```CREATE <user> WITH PASSWORD <password> CREATEDB;```
5. Create a database in postgres with the same name as in the .env ```CREATE DATABASE <database> WITH OWNER <user>;```
6. Get into your pipenv, migrate your database, seed your database, and run your flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```
8. Open a seperate terminal then cd into the `react-app` folder and run ```npm install``` to install the dependencies for the frontend.
9. Run ```npm start``` in the `react-app` folder to start the frontend server.
