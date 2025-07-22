# Robinsock

AZIX is a revolutionary blockchain-powered trading platform that tokenizes real-world stocks and enables decentralized trading. Built on cutting-edge blockchain technology, AZIX allows users to trade tokenized shares of global stocks, including emerging markets like the Nairobi Securities Exchange (NSE), while earning rewards through staking and DeFi features.

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

## Splash Page
From the splash page you can either sign up with the button in the center of the screen, or log in or sign up with the buttons in the top right of the navbar.

![image](https://user-images.githubusercontent.com/92738445/163467747-a775e38f-c844-47b0-9c3b-6257085e7b60.png)

## Portfolio

Users, once logged in, can view their portfolio from the home page. A graph showing their portfolio's performance over time is in the center of the screen. The time intervals of the graph can be changed from one day up to one year. On the right is your dashboard. The top of the dashboard is populated with the stocks you own and some brief metrics. Below the stocks you own are the watchlists you have created.

![image](https://user-images.githubusercontent.com/92738445/163470502-ae459328-7784-48a2-b385-0cc74d4ffe83.png)

## Watchlists

Clicking the "New Watchlist" button opens a modal that allows you to create a new watchlist with a custom name, as long as you don't have a watchlist with that name already

![image](https://user-images.githubusercontent.com/92738445/163471023-dec173d3-e308-4bee-ae54-fcd289633026.png)

Clicking the plus symbol next to a watchlists name unveils an edit button and a delete button. The edit button opens a modal allowing you to change the name of that watchlist, and the delete button deletes that watchlist.

![image](https://user-images.githubusercontent.com/92738445/163471263-12fee07c-2511-4783-ba6f-48295cf84e14.png)

![image](https://user-images.githubusercontent.com/92738445/163471210-00c6ad96-744a-4fae-9667-4e8d007d3d23.png)

![image](https://user-images.githubusercontent.com/92738445/163471484-c63530fc-faf2-464b-a909-98fe19f3af64.png)

## Accounts / Buying Power

To add a wallet or transfer buying power from a bank to your AzixWallet, you can either click the "Account" button in the top right corner and click "Transfers" in the dropdown menu, or you can click the "Buying Power" underneath the chart and then click "Deposit Funds".

![image](https://user-images.githubusercontent.com/92738445/163471642-e8e1b19b-fc61-49c4-9aae-31576d9694f1.png)

![image](https://user-images.githubusercontent.com/92738445/163472003-823cb37a-c72f-4eff-a7ad-2dca41c9240e.png)

From this page you can add a wallet, edit or delete that account, or use that wallet to add funds to your Azix account.

![image](https://user-images.githubusercontent.com/92738445/163472131-028c497b-0204-4f1c-ac38-3db6287570a8.png)

![image](https://user-images.githubusercontent.com/92738445/163472289-2453f14f-4e7a-4bca-b678-09a19e6cf26f.png)

![image](https://user-images.githubusercontent.com/92738445/163472336-ab3b2664-f43b-41ed-822c-0fef5d4ddc9a.png)

## Stocks

You can navigate to an individual stock page by either clicking on it in your dashboard or searching for it with the search bar. On the stock's page you can see a graph of its price over a period of time. Just like your portfolio chart you can switch the time range of the chart between one day up to one year. Below the chart are some more details about the company. On the right, if you own any, you can see how many shares of this stock you own. Also, there are buttons to add teh stock to one of your watchlists, buy the stock, sell the stock, and add buying power.

![image](https://user-images.githubusercontent.com/92738445/163472466-e07bce00-f6ba-4366-9fc6-b5800c7f588a.png)

![image](https://user-images.githubusercontent.com/92738445/163472625-0c113897-ca79-4acd-8aae-f0d79cdbbcdb.png)

Clicking the "Add to Lists" button opens a modal that allows you to add the stock to a watchlist.

![image](https://user-images.githubusercontent.com/92738445/163473257-09cdba9b-8bf0-4ae5-a962-4e1ff37b41fe.png)

Clicking the buy or sell buttons opens their respective forms.

![image](https://user-images.githubusercontent.com/92738445/163473310-433afa81-5bd4-4011-96a3-081af343a639.png)

![image](https://user-images.githubusercontent.com/92738445/163473332-3ffd8faa-13c1-4d5c-92ae-4a701cf908d0.png)

The "Buying Power" button works the same as on your portfolio.

![image](https://user-images.githubusercontent.com/92738445/163473492-8c08aacf-ac3f-40da-9301-8ec83fa97570.png)

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
