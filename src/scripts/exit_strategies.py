import os
from dotenv import load_dotenv

from safe import Safe
from web3 import Web3
from eth_account import Account

from roles_royce.protocols.eth import balancer, aura
from roles_royce.roles import send, check, build
from roles_royce.protocols.base import AvatarAddress, Address
from roles_royce.utils import tenderly_simulate, simulate_tx, tenderly_share_simulation
from abis import aura_rewards_contract_abi, balancer_pool_token_abi, balancer_vault_abi

load_dotenv()

def tenderly_simulate(tx_build, w3: Web3):
    block = w3.eth.block_number
    sim_data = simulate_tx(tx_build, block=block, account_id=os.getenv("TENDERLY_ID"),
                           project=os.getenv("TENDERLY_PROJECT"),
                           api_token=os.getenv("TENDERLY_API"),
                           sim_type='quick')
    simulate_link = tenderly_share_simulation(account_id=os.getenv("TENDERLY_ID"),
                                              project=os.getenv("TENDERLY_PROJECT"),
                                              api_token=os.getenv("TENDERLY_API"),
                                              simulation_id=sim_data['simulation']['id'])
    return simulate_link

def get_explorer_link(tx):
    if tx.status == 1:
      return '*Txn hash (Success):* https://gnosisscan.io/tx/{}\n'.format(tx.transactionHash.hex())
    else:
      return '*Txn hash (Fail):* https://gnosisscan.io/tx/{}\n'.format(tx.transactionHash.hex())

def exit_1(simulate: bool, w3: Web3, avatar_safe_address: str, roles_mod_address: str, role: int, private_key: str,
           args_dict: dict):
    # withdraw from any aura_rewards_contract
    aura_rewards_address = args_dict['aura_rewarder_address']
    aura_rewards_contract = w3.eth.contract(address=aura_rewards_address, abi=aura_rewards_contract_abi)
    aura_rewards_amount = aura_rewards_contract.functions.balanceOf(avatar_safe_address).call()
    withdraw_aura = aura.WithdrawAndUndwrapStakedBPT(reward_address=aura_rewards_address,
                                                   amount=int(aura_rewards_amount * 1))
    EOA_account = Account.from_key(private_key)
    withdraw_tx = build([withdraw_aura], role=role, account=EOA_account.address,
                        roles_mod_address=roles_mod_address,
                        web3=w3)
    if simulate:
        tenderly_simulate(withdraw_tx, w3)

    else:
        tx = send([withdraw_aura], role=role, private_key=private_key, roles_mod_address=roles_mod_address, web3=w3)
        get_explorer_link(tx)


def exit_2(simulate: bool, w3: Web3, avatar_safe_address: str, roles_mod_address: str, role: int, private_key: str,
           args_dict: dict):
    # withdraw from aura and exit pool from balancer in one single asset
    aura_rewards_address = args_dict['aura_rewarder_address']
    balancer_pool_id = args_dict['balancer_pool_id']
    balancer_pool_assets = args_dict['balancer_pool_assets']

    aura_rewards_contract = w3.eth.contract(address=aura_rewards_address, abi=aura_rewards_contract_abi)
    aura_rewards_amount = aura_rewards_contract.functions.balanceOf(avatar_safe_address).call()    
    withdraw_aura = aura.WithdrawAndUndwrapStakedBPT(reward_address=aura_rewards_address, amount=int(aura_rewards_amount * 1))

    withdraw_balancer = balancer.SingleAssetQueryExit(pool_id=balancer_pool_id,
                                                      avatar=avatar_safe_address,
                                                      assets=balancer_pool_assets,
                                                      min_amounts_out=[0, 0],  # Not used
                                                      bpt_amount_in=aura_rewards_amount,
                                                      exit_token_index=1)

    bpt_in, amounts_out = withdraw_balancer.call(web3=w3)
    amounts_out = [int(amount * 0.99) for amount in amounts_out]
    withdraw_balancer = balancer.SingleAssetExit(pool_id=balancer_pool_id,
                                                 avatar=avatar_safe_address,
                                                 assets=balancer_pool_assets,
                                                 min_amounts_out=amounts_out, bpt_amount_in=bpt_in, exit_token_index=1)
    EOA_account = Account.from_key(private_key)
    withdraw_tx = build([withdraw_aura, withdraw_balancer], role=role, account=EOA_account.address,
                        roles_mod_address=roles_mod_address,
                        web3=w3)
    if simulate:
        tenderly_simulate(withdraw_tx, w3)

    else:
        tx = send([withdraw_aura, withdraw_balancer], role=role, private_key=private_key, roles_mod_address=roles_mod_address, web3=w3)
        get_explorer_link(tx)