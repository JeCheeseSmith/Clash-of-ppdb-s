# Simple Autobuild Script 
> This script is used to automatically update from the main branch on GitHub. It refreshed the files served by the webserver.
> > Make sure to follow the setup first!

This script regularly retrieves a copy of the repo. Then it refreshed the webserver. It outputs the logs to the Ubuntu syslog files.

Authentication towards the repository is done using Deploy Keys from GitHub. Read more [here](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys). 

### Step-by-step guide

1. Clone the repository

```bash
git clone git@github.com:JeCheeseSmith/Clash-of-ppdb-s.git
```

2. Create a script, called "script.sh", with the contents:

> This script fetches the latest branch from the repo and (re)installs any needed python packages.
```
#!/bin/bash

cd /home/app/Clash-of-ppdb-s/
git fetch --all && git checkout --force "origin/master"

cd /home/app/Clash-of-ppdb-s/src
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
```

3. Call the script frequently using CRON (user: app). It also logs towards the "syslog" under the name "ppdb"

```
*/5 * * * * /home/app/script.sh 2>&1 | logger -t ppdb
```

4. Rebuild the files & Reload the webserver frequently (e.g. user: watson)

```
*/5 * * * * cd /home/app/Clash-of-ppdb-s/src/frontend && sudo npm install && sudo npm run build | logger -t ppdb
*/5 * * * * sudo -u postgres psql ppdb -f /home/app/Clash-of-ppdb-s/sql/schema.sql
*/5 * * * * sudo systemctl restart webapp && sudo systemctl reload nginx | logger -t ppdb
```

NOTE: You can get the logs from the execute scripts by executing:
```bash
sudo cat /var/log/syslog | grep 'ppdb'
```




