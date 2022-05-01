<h2>Swgoh Calculator API</h2>
<p>This is a Node API created to provide data to its companion React app for a calculator for computing the leveling cost of characters in the Star Wars: Game of Heroes mobile game.</p>

<h2>Future Plans</h2>
<p>The next step will be to create the first endpoint to provide a list of characters in the game. Once the first endpoint is done, a Redis cache will be added to cache the request daily, and the cache will be refreshed on a schedule at midnight every day. Next, an endpoint will be created that takes in a player's ally code and provides the player's list of characters, their levels, and star levels. This data will be available to the companion React client for customizing the player's experience in the client.</p>

<h2>Build Pipeline</h2>
<p>QA environment points to https://swgohcalculatorapi-qa.herokuapp.com.</p>
<p>Production environment points to https://swgohcalculatorapi.herokuapp.com.</p>
<p>For all code changes, a branch is cut off QA for each ticket, which is then squashed and merged into QA once the ticket is complete. The QA environment is then tested first prior to merging QA into production to avoid downtime from breaking changes.</p>

<h2>Built With</h2>
  <ul>
    <li>Node
    <li>TypeScript
    <li>JavaScript
    <li>Heroku
  </ul>

<h2>Authors</h2>
<p>Tim Thompson</p>