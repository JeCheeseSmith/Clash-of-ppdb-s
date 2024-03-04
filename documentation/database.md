# Database
> This documentation explains the database and it's structure
> > Make sure to open ER-Diagram.pptx too!

We would like to store the majority of our information in the database. This allows us to shut down the activity of a specific user totally when the user is not playing. 

Some notes: 
1. Each Clan Request is a message and has a status. It is created by a NonMember and SendTo the ClanLeader and so on shared with the Guild.
2. Transfer Request is created by a friended Member (incl. Guild), send to another person.
3. An Update/Report should be created by the system/admin user.
4. A package consists of resources and troops. The troops themselves can be transferable or not. All troops are used to defend the package.
5. A transfer has a relation from and a relation to, to a settlement. This way a transfer can be easily changed to be captured by another nation.

A SQL setup file is provided [here](../sql/schema.sql). This drops the whole current database and creates a new one.
