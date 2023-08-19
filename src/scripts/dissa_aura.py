from roles_royce.roles_royce.protocols.eth import balancer, aura
from roles_royce.roles_royce import send
from scripts.abis import aura_rewards_contract_abi, balancer_pool_token_abi,balancer_vault_abi

print('crap')

def exit_aura_withdraw_and_unwrap(blockchain,percentage,safe_address,roles_mod,role,private_key,bpt_address,aura_rewards_contract_address,w3) -> None:
    
    aura_rewards_contract = w3.eth.contract(address=aura_rewards_contract_address,abi=aura_rewards_contract_abi)
    aura_rewards_amount = aura_rewards_contract.functions.balanceOf(safe_address).call()

    bpt_contract = w3.eth.contract(address=bpt_address, abi=balancer_pool_token_abi)
    bpt_pool_id = bpt_contract.functions.getPoolId().call()
    bpt_vault_address = bpt_contract.functions.getVault().call()

    vault_contract = w3.eth.contract(address=bpt_vault_address, abi=balancer_vault_abi)
    pool_id_tokens = vault_contract.functions.getPoolTokens(bpt_pool_id).call()[0]
    assets = [token for tokens in pool_id_tokens for token in tokens]

    withdraw_aura = aura.WithdrawAndUndwrapStakedBPT(reward_address=aura_rewards_contract_address, amount=int(aura_rewards_amount * 1))

    send([withdraw_aura], role=role, private_key=private_key,
                         roles_mod_address=roles_mod,
                         blockchain=blockchain, web3=w3)