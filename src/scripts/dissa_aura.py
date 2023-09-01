from roles_royce.protocols.eth import balancer, aura
from roles_royce.roles import send, check, build
from roles_royce.protocols.base import AvatarAddress, Address
from safe import Safe
from abis import aura_rewards_contract_abi, balancer_pool_token_abi,balancer_vault_abi

def exit_aura_withdraw_and_unwrap(w3, safe_address=AvatarAddress, aura_rewards_addr=Address, role=int, roles_mod=Address, private_key=None, blockchain=None):
    aura_rewards_contract = w3.eth.contract(address=aura_rewards_addr,abi=aura_rewards_contract_abi)
    aura_rewards_amount = aura_rewards_contract.functions.balanceOf(safe_address).call()
    withdraw_aura = aura.WithdrawAndUndwrapStakedBPT(reward_address=aura_rewards_addr, amount=int(aura_rewards_amount * 1))
    tx = send([withdraw_aura], role=role, private_key=private_key, roles_mod_address=roles_mod, web3=w3)