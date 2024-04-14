import psycopg2

# TODO Talk about database.py in backend docu

class DBConnection:
    """
    Class to initialise & abstract the database connection
    """
    def __init__(self):
        try:
            self.conn = psycopg2.connect(user="postgres", password="password", host="127.0.0.1", port="5432",
                                         database="ppdb")
        except:
            print('ERROR: Unable to connect to database')
            raise

    def close(self):
        self.conn.close()

    def get_connection(self):
        return self.conn

    def get_cursor(self):
        return self.conn.cursor()

    def commit(self):
        return self.conn.commit()

    def rollback(self):
        return self.conn.rollback()
