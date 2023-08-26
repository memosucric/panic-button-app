import os
import subprocess
import shlex
from web3 import Web3, HTTPProvider
from dotenv import load_dotenv

load_dotenv()

ETH_FORK_NODE_URL = os.getenv("ETHEREUM_PW")

LOCAL_NODE_DEFAULT_BLOCK = 17565000
cmd=f"anvil --accounts 15 -f {ETH_FORK_NODE_URL} --fork-block-number {LOCAL_NODE_DEFAULT_BLOCK} --port 8545"

subprocess.Popen(shlex.split(cmd))

w3 = Web3(HTTPProvider(f"http://localhost:8545"))

