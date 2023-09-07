### Commands to test the main.py

- Fetch the latest roles_royce

```sh
git submodule update --init --recursive
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
