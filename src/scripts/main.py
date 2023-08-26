from web3.exceptions import TransactionNotFound
import time
from dissa_aura import exit_aura_withdraw_and_unwrap

import socket
import os
import subprocess
import shlex
from web3 import Web3, HTTPProvider
from dotenv import load_dotenv

import argparse
import os

load_dotenv()

def main():

    parser = argparse.ArgumentParser(description="Dummy testing script", epilog='This is the epilog',
                                 formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument("-p", "--percentage", type=int, default=100, help="percentage of liquidity to be removed")
    parser.add_argument("-e", "--execute", action='store_true', help="execute transaction")
    args = parser.parse_args()
    config = vars(args)

    ETH_FORK_NODE_URL = os.getenv("ETHEREUM_PW")
    LOCAL_NODE_DEFAULT_BLOCK = 17565000
    cmd=f"anvil --accounts 15 -f {ETH_FORK_NODE_URL} --fork-block-number {LOCAL_NODE_DEFAULT_BLOCK} --port 8546"
    subprocess.Popen(shlex.split(cmd))

    roles = 1
    roles_mod = "0x1cFB0CD7B1111bf2054615C7C491a15C4A3303cc"
    safe_address = "0x849D52316331967b6fF1198e5E32A0eB168D039d"
    private_key = "blabla"
    blockchain = "fork"

    if blockchain == "fork":
        w3 = Web3(HTTPProvider(f"http://localhost:8546"))
        aura_rewards_addr = "0x59D66C58E83A26d6a0E35114323f65c3945c89c1"

        tx = exit_aura_withdraw_and_unwrap(w3=w3, safe_address=safe_address, aura_rewards_addr=aura_rewards_addr,
                                       role=roles, roles_mod=roles_mod, private_key=private_key, blockchain=blockchain)
        print('daar is em',tx)

# if txn_receipt.status == 1:
#     txns_message = '*Txn hash (Success):* <https://gnosisscan.io/tx/%s|%s>\n' % (executed_txn.hex(), executed_txn.hex())
# else:
#     txns_message = '*Txn hash (Fail):* <https://gnosisscan.io/tx/%s|%s>\n' % (executed_txn.hex(), executed_txn.hex())

# print(txns_message)
if __name__ == "__main__":
    main()
