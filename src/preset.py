from app import *

"""
This script will load some preset information into the game, providing a very basic example of the workings of the game. We recommend you to actually try it out, not all features are (fully) used.
"""

Player_obj = Player(name='a', password='', avatar=None, gems=50, xp=0, level=0, logout=None, pid=None)
player_data_access.add_user(Player_obj, settlement_data_acces, content_data_access, package_data_acces)

Player_obj = Player(name='b', password='', avatar=None, gems=50, xp=0, level=0, logout=None, pid=None)
player_data_access.add_user(Player_obj, settlement_data_acces, content_data_access, package_data_acces)

Player_obj = Player(name='c', password='', avatar=None, gems=50, xp=0, level=0, logout=None, pid=None)
player_data_access.add_user(Player_obj, settlement_data_acces, content_data_access, package_data_acces)

Player_obj = Player(name='d', password='', avatar=None, gems=50, xp=0, level=0, logout=None, pid=None)
player_data_access.add_user(Player_obj, settlement_data_acces, content_data_access, package_data_acces)

# Make a and b friends
cursor = connection.get_cursor()
cursor.execute('INSERT INTO friend(pname1, pname2) VALUES(%s,%s);', ('a', 'b'))
connection.commit()

# Set a and c in a clan
clan_data_acces.add_clan(Clan('a Clan', 'a', 'Clan of a', 'We are cool'))
cursor.execute('INSERT INTO member(pname, cname) VALUES (%s,%s);', ('c', 'a Clan'))

# Set very high values for a settlement
cursor.execute('UPDATE building SET level=2 WHERE name=%s and sid=%s;', ('Castle', 1))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE building SET level=3 WHERE name=%s and sid=%s;', ('Castle', 1))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE building SET level=4 WHERE name=%s and sid=%s;', ('Castle', 1))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE building SET level=5 WHERE name=%s and sid=%s;', ('Castle', 1))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE building SET level=6 WHERE name=%s and sid=%s;', ('Castle', 1))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE package SET stone=100000000, wood=1000000, food=1000000, steel=100000000 WHERE id=1;')
cursor.execute('INSERT INTO troops(pid, sname, amount, transferable, discovered) VALUES (%s,%s,%s,%s,%s);', (1, 'Halbardier', 500, True, True))
cursor.execute('INSERT INTO troops(pid, sname, amount, transferable, discovered) VALUES (%s,%s,%s,%s,%s);', (1, 'Bandit', 500, True, True))

# Set very high values for settlement d
cursor.execute('UPDATE building SET level=2 WHERE name=%s and sid=%s;', ('Castle', 4))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE building SET level=3 WHERE name=%s and sid=%s;', ('Castle', 4))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE building SET level=4 WHERE name=%s and sid=%s;', ('Castle', 4))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE building SET level=5 WHERE name=%s and sid=%s;', ('Castle', 4))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE building SET level=6 WHERE name=%s and sid=%s;', ('Castle', 4))
settlement_data_acces.upgradeCastle(1)
cursor.execute('UPDATE package SET stone=100000000, wood=1000000, food=1000000, steel=100000000 WHERE id=4;')
cursor.execute('INSERT INTO troops(pid, sname, amount, transferable, discovered) VALUES (%s,%s,%s,%s,%s);', (4, 'Halbardier', 500, True, True))
cursor.execute('INSERT INTO troops(pid, sname, amount, transferable, discovered) VALUES (%s,%s,%s,%s,%s);', (4, 'Bandit', 500, True, True))

connection.commit()

resources = [0, 5000, 5000, 5000, 5000, 0, 0, 0]
soldiers = [["Halbardier", 15, "True"], ["Bandit", 5, "False"]]

# a gives resources to friend b
transfer_data_acces.createTransfer(2, False, 1, False, soldiers, resources, 'transfer', 'a', timer_data_acces, package_data_acces, clan_data_acces, friend_data_access, soldier_data_acces)

# d attacks a
transfer_data_acces.createTransfer(1, False, 4, False, soldiers, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'attack', 'd',  timer_data_acces, package_data_acces, clan_data_acces, friend_data_access, soldier_data_acces)

# a spies on d
transfer_data_acces.createEspionage(4, 1, False, timer_data_acces)

# a attacks the transfer attack to d
transfer_data_acces.createTransfer(2, True, 1, False, soldiers, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'attack', 'a',  timer_data_acces, package_data_acces, clan_data_acces, friend_data_access, soldier_data_acces)



