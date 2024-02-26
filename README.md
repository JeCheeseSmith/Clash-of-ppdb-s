# Clash of ppdb's - README
> Web-based idle game in a medieval context. A project for the course Programming Project Databases (INFORMAT 1002WETDAT)
> > By Abobaker Rahman, Raadin Bahrami, Jonas Degruytere, Salaheddine Edfiri, Kars van Velzen

### Functionalities: 
- [X] Auto-Build to server (Follow Setup Guide)

### Code:
- [ ] Documented
- [ ] Beautifull?


## Design Choices Overview

Database variable names; same system in referring

## How to start?

###This Guide Assumes you have an Ubuntu Server running with Nginx Webserver inplace. You can use the nginx/webapp file as a starting config


We depend on the following technologies:

![stack](https://github.com/JoeyDP/PPDB-Template-App/blob/master/doc/stack.png?raw=true "Stack") //TO DO Replace image with our system


#### 1. Postgres database and Python interface
```bash
sudo apt install postgresql python3-psycopg2
```

//Deploy from Github using a Deploy Key

//Clone Build

//Explain simple auto build scripts

#### 2. Create the database
First configure the database with `postgres` user:
```bash
sudo su postgres
psql
```
Then create a role 'app' that will create the database and be used by the application:
```sql
CREATE ROLE app WITH LOGIN CREATEDB;
CREATE DATABASE ppdb OWNER app;
```

You need to 'trust' the role to be able to login. Add the following line to `/etc/postgresql/9.6/main/pg_hba.conf` (you need root access, version may vary). __It needs to be the first rule (above local all all peer)__.
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# app
local   dbtutor         app                                     trust
```
and restart the service. Then initialize the database:
```bash
sudo systemctl restart postgresql

psql ppdb -U app -f sql/schema.sql
```


#### 3. Download Dependencies

```bash
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
```


#### 4. Run development server
```bash
cd backend/
python app.py
```
Then visit https://team8.ua-ppdb.me/




These steps demonstrate how to run this application with nginx. They are to be executed in addition to the setup in quick start. Instead of running the built in Flask debug server, we use an industrial grade webserver and reverse proxy server: nginx.

#### 2. Create user to run application
```bash
sudo adduser --disabled-login app
sudo su - app
```

#### 5. Test if wsgi entrypoint works
Instead of using the Flask debug server, we use gunicorn to serve the application.
```bash
cd backend/
gunicorn --bind 0.0.0.0:5000 wsgi:app
```


#### 6. Enable the webservice
As an account with sudo acces (not app), copy the file `service/webapp.service` to `/etc/systemd/system/` and enable the service:

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

Restart the server with `sudo systemctl restart nginx`. Your application should be available on port 80.
