# Signup
> This documentation explains the signup procedures

When hitting signup on the frontend, a POST Request is send to "/signin" on which an API function is called in app.py:
`def add_player()`

This function extracts the data from the provided JSON into a Player Object. Using the player_data_acces, the functionality towards the backend is called: `def add_user(self, obj, settlement_data_acces)`

This function creates a user and inserts it into the database. Then it setups the initial settlement by inserting a package with basic resources and settlement into the database.
Also, a welcome message is generated.