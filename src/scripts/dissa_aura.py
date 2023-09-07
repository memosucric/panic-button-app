from roles_royce.protocols.eth import balancer, aura
from roles_royce.roles import send, check, build
from roles_royce.protocols.base import AvatarAddress, Address
from roles_royce.utils import tenderly_simulate, simulate_tx, tenderly_share_simulation

from dotenv import load_dotenv
import os

from safe import Safe
from abis import aura_rewards_contract_abi, balancer_pool_token_abi,balancer_vault_abi

load_dotenv()

def exit_aura_withdraw_and_unwrap(simulate=bool, w3=None, safe_address=AvatarAddress, aura_rewards_addr=Address, role=int, roles_mod=Address, private_key=None, blockchain=None):
    aura_rewards_contract = w3.eth.contract(address=aura_rewards_addr,abi=aura_rewards_contract_abi)
    aura_rewards_amount = aura_rewards_contract.functions.balanceOf(safe_address).call()
    withdraw_aura = aura.WithdrawAndUndwrapStakedBPT(reward_address=aura_rewards_addr, amount=int(aura_rewards_amount * 1))
    EOA_account = "0xb11ea45e2d787323dFCF50cb52b4B3126b94810d"
    if simulate:
        withdraw_tx = build([withdraw_aura], role=role, account=EOA_account,
                           roles_mod_address=roles_mod,
                           web3=w3)
        sim_data = simulate_tx(withdraw_tx, block=17000000, account_id=os.getenv("TENDERLY_ID"), project=os.getenv("TENDERLY_PROJECT"),
                            api_token=os.getenv("TENDERLY_API"),
                            sim_type='quick')
        simulate_link = tenderly_share_simulation(account_id=os.getenv("TENDERLY_ID"), project=os.getenv("TENDERLY_PROJECT"), api_token=os.getenv("TENDERLY_API"),
                                    simulation_id=sim_data['simulation']['id'])
        return simulate_link
    else:
        tx = send([withdraw_aura], role=role, private_key=private_key, roles_mod_address=roles_mod, web3=w3)
        if tx.status == 1:
            return '*Txn hash (Success):* https://gnosisscan.io/tx/{}\n'.format(tx.transactionHash.hex())
        else:
            return '*Txn hash (Fail):* https://gnosisscan.io/tx/{}\n'.format(tx.transactionHash.hex())