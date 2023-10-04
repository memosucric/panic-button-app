import time
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

from roles_royce.utils import tenderly_simulate, simulate_tx, tenderly_share_simulation
from roles_royce.toolshed.disassembling.Aura.disassembling_aura import AuraDisassembler
from roles_royce.toolshed.disassembling.Balancer.disassembling_balancer import BalancerDisassembler

from dissa_aura import exit_1
load_dotenv()

def start_local_blockchain():
    ETH_FORK_NODE_URL = os.getenv("ETHEREUM_PW")
    LOCAL_NODE_DEFAULT_BLOCK = 17612540
    cmd = f"anvil --accounts 15 -f {ETH_FORK_NODE_URL} --fork-block-number {LOCAL_NODE_DEFAULT_BLOCK} --port 8546"
    subprocess.Popen(shlex.split(cmd))

def main():
    parser = argparse.ArgumentParser(description="This is the real ENSDAO disassembling script", epilog='build by karpatkey',
                                 formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    
    parser.add_argument("-e", "--execute", action='store_true', help="execute transaction")
    parser.add_argument("-sim", "--simulate", action='store_true', default=os.getenv("SIMULATE", "False").lower() == "true",
                        help="simulate transaction (default: False, or value of SIMULATE environment variable)")

    parser.add_argument("-p", "--percentage", type=int, default=100, help="percentage of liquidity to be removed")
    parser.add_argument("-s", "--positionId", type=str,help="The name of the position to execute the strategy for")
    parser.add_argument("-s", "--exitStrategy", type=str,help="Exit strategy to execute")
    parser.add_argument("-a", "--exitArguments", type=dict,help="Custom exit-arguments for each Exit strategy, i.e. max-slippage")

    args = parser.parse_args()
    config = vars(args)

    start_local = os.getenv("START_LOCAL_BLOCKCHAIN", "").lower() == "yes"
    if start_local:
        start_local_blockchain()
    
    roles = os.getenv("ENSDAOETH_DISASSEMBLER_ROLE")
    roles_mod = os.getenv("ENSDAOETH_ROLES_MOD")
    safe_address = os.getenv("ENSDAOETH_AVATAR") 
    private_key = os.getenv("PRIVATE_KEY")
    EOA_address = os.getenv("ENSDAOETH_EOA")
    
    simulate = args.simulate
    percentage = args.percentage
    position_id = args.positionId
    exit_strategy = args.exitStrategy
    exit_arguments = args.exitArguments
    

    if not private_key:
        print("Private key is not set!")
        return

    blockchain = "fork"
    if blockchain == "fork":
        w3 = Web3(HTTPProvider(f"http://localhost:8546"))
        w3.eth.send_transaction({"to": EOA_address, "value": Web3.to_wei(0.01, "ether")})
        print(w3.eth.get_balance(EOA_address))
        if position_id == "Aura_11" or position_id == "Aura_219":
            aura_disassembler = AuraDisassembler(w3=w3,
                                                 avatar_safe_address=safe_address,
                                                 roles_mod_address=roles_mod,
                                                 role=roles,
                                                 signer_address=EOA_address)
            if exit_strategy == "Exit_1":
                txn_transactable = aura_disassembler.exit_1(percentage=percentage,
                                                            exit_arguments=[{"rewards_address": exit_arguments['rewarder_address']}])
            elif exit_strategy == "Exit_2_1":
                txn_transactable = aura_disassembler.exit_2_1(percentage=percentage,
                                                            exit_arguments=[{"rewards_address": exit_arguments['rewarder_address'],
                                                                "max_slippage": exit_arguments['max_slippage']}])
            elif exit_strategy == "Exit_2_2":
                txn_transactable = aura_disassembler.exit_2_2(percentage=percentage,
                                                            exit_arguments=[{"rewards_address": exit_arguments['rewarder_address'],
                                                                "token_out_address": exit_arguments['token_out_address'],
                                                                "max_slippage": exit_arguments['max_slippage']}])
            elif exit_strategy == "Exit_2_3":
                txn_transactable = aura_disassembler.exit_2_3(percentage=percentage,
                                                            exit_arguments=[{"rewards_address": exit_arguments['rewarder_address'],
                                                                "amounts_out": exit_arguments['amounts_out'],
                                                                "max_slippage": exit_arguments['max_slippage']}])
            elif exit_strategy == "Exit_2_4":
                txn_transactable = aura_disassembler.exit_2_4(percentage=percentage,
                                                            exit_arguments=[{"rewards_address": exit_arguments['rewarder_address'], 
                                                                "max_slippage": exit_arguments['max_slippage']}])
        elif position_id == "Lido_15" or position_id == "Lido_149":
            pass
            #TODO: make the lido disassembler, to get this code working
            # lido_disassembler = LidoDisassembler(w3=w3,
            #                                      avatar_safe_address=safe_address,
            #                                      roles_mod_address=roles_mod,
            #                                      role=roles,
            #                                      signer_address=EOA_address)
            # if exit_strategy == "Exit_1":
            #     txn_transactable = lido_disassembler.exit_1(percentage=percentage) 
            # elif exit_strategy == "Exit_2":
            #     txn_transactable = lido_disassembler.exit_2(percentage=percentage)   
            # elif exit_strategy == "Exit_3":
            #     txn_transactable = lido_disassembler.exit_3(percentage=percentage)   
            # elif exit_strategy == "Exit_4":
            #     txn_transactable = lido_disassembler.exit_4(percentage=percentage,
            #                                                 exit_arguments=[{"max_slippage": exit_arguments['max_slippage']}])  
            # elif exit_strategy == "Exit_5":
            #     txn_transactable = lido_disassembler.exit_5(percentage=percentage,
            #                                                 exit_arguments=[{"max_slippage": exit_arguments['max_slippage']}])             
        if simulate:
            exit_tx = aura_disassembler.simulate(txn_transactable)
        else:
            exit_tx = aura_disassembler.send(txn_transactable, private_key)

        return exit_tx

    
if __name__ == "__main__":
    main()