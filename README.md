# Travisia, Fallen Empire - README
> Web-based idle game in a medieval context. A project for the course Programming Project Databases (INFORMAT 1002WETDAT)
> > By Abobaker Rahman, Raadin Bahrami, Jonas Degruytere, Salaheddine Edfiri, Kars van Velzen

## Play the game [here!](https://team8.ua-ppdb.me/)

### Functionalities: 
- [X] Auto-Build to server (Follow Setup Guide)

### Code:
- [ ] Documented
- [ ] Beautiful?

## How to start?

> This guide Assumes you have an Ubuntu Server running with a Nginx Webserver & PostgreSQL installed. Optionally, like we did, you can retrieve your free SSL Certificate using Certbot. 
> > Don't forget to clone this repository!

#### 1. Install necessary dependencies
```bash
sudo apt install python3-psycopg2
```

#### 2. Create the database
First configure the database with `postgres` user:
```bash
sudo su postgres
psql
```
Then create a role 'app' that will create the database and be used by the application:
```sql
CREATE ROLE app WITH LOGIN 'password' CREATEDB;
CREATE DATABASE ppdb OWNER postgres;
ALTER USER postgres WITH PASSWORD 'password';
```

You need to 'trust' the role to be able to log in. Add the following line to `/etc/postgresql/9.6/main/pg_hba.conf` (you need root access, version may vary). __It needs to be the first rule (above local all all peer)__.
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# app
local   dbtutor         app                                     trust
```
and restart the service. Then initialize the database:
```bash
sudo systemctl restart postgresql

psql ppdb -f sql/schema.sql
```

#### 3. Download Python Dependencies

```bash
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
```

#### 4. Run development server
```bash
cd src/
python3 app.py
```

### Setup the React.js frontend development
> Currently, this is not properly linked with the backend build!

#### A. Install Node.js & npm
```bash
cd src/frontend/
sudo apt install nodejs
sudo apt install npm
sudo npm install -g n
sudo n lts
npm install
npm run dev
npm run build
```

### You can continue this tutorial to set this up on a server from here.

#### 5. Create user to run application
```bash
sudo adduser --disabled-login app
sudo su - app
```

#### 6. Test if wsgi entrypoint works
Instead of using the Flask debug server, we use gunicorn to serve the application.
```bash
cd src/
gunicorn --bind 0.0.0.0:5000 wsgi:app
```

#### 7. Enable the webservice
As an account with sudo access (not app), copy the file `service/webapp.service` to `/etc/systemd/system/` and enable the service:

```bash
sudo ln -s /home/app/Clash-of-ppdb-s/service/webapp.service /etc/systemd/system/

sudo systemctl enable webapp
sudo systemctl start webapp
```
A file `src/webapp.sock` should be created.

#### 8. Setup nginx
Link or copy the nginx server block configuration file to the right nginx folders:
```bash
sudo ln -s /home/app/Clash-of-ppdb-s/nginx/webapp /etc/nginx/sites-available/
sudo ln -s /home/app/Clash-of-ppdb-s/nginx/webapp /etc/nginx/sites-enabled/
```

Test the configuration with `sudo nginx -t`.

#### 9. Restart the server

Restart the server with `sudo systemctl restart nginx`. Your application should be available on port 80.
