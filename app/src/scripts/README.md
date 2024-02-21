### Commands to test the main.py

- Fetch the latest roles_royce

```sh
git submodule update --init --recursive
```

- To update the roles_royce submodule to the latest changes

```sh
git submodule update --remote --merge
```

- Install the latest rolce_royce submodule

```sh
pip3.10 install ./roles_royce
```

- Install the latest dependency

```sh
pip3.10 install -r requirements.txt
```

- Start the Anvil in docker container

```sh
docker run --name anvil -p 8546:8546 ghcr.io/foundry-rs/foundry:latest 'anvil --accounts 15 -f https://rpc.mevblocker.io/ --fork-block-number 17612540 --port 8546 --host 0.0.0.0'
```

- Set the ENVs

```sh
export SIMULATE=True
export TENDERLY_PROJECT=dk
export TENDERLY_API=lol-lollololololol
export TENDERLY_ID=lol-lol-lol-lol-lol
export PRIVATE_KEY="lol lol lol"
```

- Run python script

```sh
python3.10 src/scripts/main.py
```

### docker-compose local testing

- Create .env file

```sh
nano .env
```

Copy all the content into the file

```
GOOGLE_CLIENT_ID=''
GOOGLE_CLIENT_EMAIL=''
GOOGLE_PRIVATE_KEY=
GOOGLE_PROJECT_ID=
DATA_WAREHOUSE_ENV=
#  'use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_SECRET=
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

TENDERLY_PROJECT=
TENDERLY_API=
TENDERLY_ID=
PRIVATE_KEY=

```

- Run below command to execute the script

```sh
docker compose up
```

Ps: For the docker-compose example I have changed the line 42 in main_GnosisDAO.py (anvil is container name)

Debugging:

- Get into application container

```sh
docker exec -it app /bin/sh
```

then run python script manually

```sh
python3 src/scripts/main_GnosisDAO.py
```

You will see that in backend its working fine, so we need to debug from front end side!
