# Travisia, Fallen Empire - README
> Web-based idle game in a medieval context. A project for the course Programming Project Databases (INFORMAT 1002WETDAT)
> > By Abobaker Rahman, Raadin Bahrami, Jonas Degruytere, Salaheddine Edfiri, Kars van Velzen

## Play the game [here!](https://team8.ua-ppdb.me/)

### Functionalities: 
- [X] Auto-Build to server (Follow Setup Guide)
- [X] Idle Game
- [X] Multiplayer Mechanics
- [X] Documentation

### TODO aanvullen met specs van assignment

## Documentation

For the workings of the game, refer to. the [documentation](documentation) in which every component is explained. We recommend reading from the database, to the backend to the frontend to get a solid grasp about the mechanics. 

## How to start?

> This guide assumes you have an Ubuntu Server running with a Nginx Webserver & PostgreSQL configured with a valid SSL Certificate. Optionally, like we did, you can retrieve your free SSL Certificate using [Certbot](https://certbot.eff.org/). 
> > Don't forget to clone this repository!

#### 0. Install Dependencies
- python3 ```sudo apt install nodejs ```
- psycopg2 ```sudo apt install python3-psycopg2```
- nodejs ```sudo apt install nodejs```
- npm ```sudo apt install npm```
- nginx ```sudo apt install nginx```
- postgresql ```sudo apt install postgresql```

#### 1. Create the database
First configure the database with `postgres` user:
```bash
sudo su postgres
psql
```
Create the database and adjust the password as written in [database.py](src/database.py)
```sql
CREATE DATABASE ppdb OWNER postgres;
ALTER USER postgres WITH PASSWORD 'password';
```

Then install the database and restarts postgresql
```bash
psql ppdb -f sql/schema.sql

sudo systemctl restart postgresql
```

#### 2. Install Python Dependencies

```bash
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
```

#### 3. Install npm packages & build the frontend files
```bash
cd src/frontend/
sudo npm install
sudo npm run build
```

#### 4. Create a user to run application
```bash
sudo adduser --disabled-login app
sudo su - app
```

#### 5. Test if wsgi entrypoint works
Instead of using the Flask debug server, we use gunicorn to serve the application.
```bash
cd src/
gunicorn --bind 0.0.0.0:5000 wsgi:app
```

#### 6. Enable the webservice
As an account with sudo access (not app), copy the file `service/webapp.service` to `/etc/systemd/system/` and enable the service:

```bash
sudo ln -s /home/app/Clash-of-ppdb-s/service/webapp.service /etc/systemd/system/

sudo systemctl enable webapp
sudo systemctl start webapp
```
A file `src/webapp.sock` should be created.

#### 7. Setup nginx
Link or copy the nginx server block configuration file to the right nginx folders:
```bash
sudo ln -s /home/app/Clash-of-ppdb-s/nginx/webapp /etc/nginx/sites-available/
sudo ln -s /home/app/Clash-of-ppdb-s/nginx/webapp /etc/nginx/sites-enabled/
```

Test the configuration with `sudo nginx -t`.

#### 8. Restart the server

Restart the server with `sudo systemctl restart nginx`. Your application should be available on port 443.