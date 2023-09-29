import time
import requests
import socket
import os
import subprocess
import shlex
import argparse
import os
import logging
from dotenv import load_dotenv
from web3 import Web3, HTTPProvider
from web3.exceptions import TransactionNotFound
from dissa_aura import exit_1

load_dotenv()

def start_local_blockchain():
    ETH_FORK_NODE_URL = os.getenv("ETHEREUM_PW")
    LOCAL_NODE_DEFAULT_BLOCK = 17612540
    cmd = f"anvil --accounts 15 -f {ETH_FORK_NODE_URL} --fork-block-number {LOCAL_NODE_DEFAULT_BLOCK} --port 8546"
    subprocess.Popen(shlex.split(cmd))

def wait_for_server_up():
    max_retries = 30  # Number of retries
    retry_delay = 5  # Delay between retries in seconds

    for _ in range(max_retries):
        try:
            response = requests.get("http://localhost:8546")
            if response.status_code == 200:
                return True  # Server is up
        except requests.exceptions.RequestException:
            pass  # Server is not up yet

        time.sleep(retry_delay)

    return False  # Server didn't become available

def main():
    parser = argparse.ArgumentParser(description="Dummy testing script", epilog='This is the epilog',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument("-p", "--percentage", type=int, default=100, help="percentage of liquidity to be removed")
    parser.add_argument("-e", "--execute", action='store_true', help="execute transaction")
    parser.add_argument("--simulate", action='store_true', default=os.getenv("SIMULATE", "False").lower() == "true",
                        help="simulate transaction (default: False, or value of SIMULATE environment variable)")
    args = parser.parse_args()
    config = vars(args)
    start_local = os.getenv("START_LOCAL_BLOCKCHAIN", "").lower() == "yes"
    if start_local:
        start_local_blockchain()
        if not wait_for_server_up():
            print("Local blockchain server did not start within the expected time.")
            return

    roles = 4
    roles_mod = "0x1cFB0CD7B1111bf2054615C7C491a15C4A3303cc"
    safe_address = "0x849D52316331967b6fF1198e5E32A0eB168D039d"
    private_key = os.getenv("PRIVATE_KEY")
    EOA_address = "0xb11ea45e2d787323dFCF50cb52b4B3126b94810d"
    simulate = args.simulate
    if not private_key:
        print("Private key is not set!")
        return
    blockchain = "fork"
    if blockchain == "fork":
        w3 = Web3(HTTPProvider(f"http://localhost:8546"))
        w3.eth.send_transaction({"to": EOA_address, "value": Web3.to_wei(0.01, "ether")})
        print(w3.eth.get_balance(EOA_address))
        aura_rewards_addr = "0x6c3f6C327DE4aE51a2DfaAF3431b3c508ec8D3EB"
        tx = exit_1(simulate=simulate, w3=w3, avatar_safe_address=safe_address, roles_mod_address=roles_mod,
                    role=roles, private_key=private_key, args_dict={"rewarder_address": aura_rewards_addr})
        print(tx)

if __name__ == "__main__":
    main()
