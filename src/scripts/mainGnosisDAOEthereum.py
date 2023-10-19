import os
import argparse

from dotenv import load_dotenv

from eth_account import Account
from web3 import Web3

from roles_royce.toolshed.disassembling.Aura.disassembling_aura import AuraDisassembler
from roles_royce.toolshed.disassembling.Balancer.disassembling_balancer import BalancerDisassembler
from roles_royce.toolshed.disassembling.utils import Disassembler
from roles_royce.utils import TenderlyCredentials

load_dotenv()
ACCOUNT_ID = "FILL"
PROJECT = "FILL"
API_TOKEN = "FILL"


def start_the_engine():
  w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_ENDPOINT")))
  if not w3.is_connected():
    w3 = Web3(Web3.HTTPProvider(os.getenv("FALLBACK_RPC_ENDPOINT")))
    if not w3.is_connected():
      raise Exception("No connection to RPC endpoint")

  return w3

def check_engine(w3: Web3, private_key: str):
  if not private_key:
    raise Exception("Private key is not set!")
  else:
    EOA_address = Account.from_key(private_key).address
    eth_balance = w3.eth.get_balance(EOA_address)
    if eth_balance <= 0.1:
      raise Exception("Not enough ETH balance in EOA")
    else:
      return EOA_address

def gear_up(protocol: str, w3: Web3, safe_address: str, roles_mod: str, role: str, EOA_address: str,
              percentage: int, exit_strategy: str, exit_arguments: list[dict]):
  if protocol == "Aura":
    disassembler = AuraDisassembler(w3=w3,
                                    avatar_safe_address=safe_address,
                                    roles_mod_address=roles_mod,
                                    role=role,
                                    tenderly_credentials=TenderlyCredentials(account_id=ACCOUNT_ID,
                                    project=PROJECT, api_token=API_TOKEN),
                                    signer_address=EOA_address)
  elif protocol == "Balancer":
    disassembler = BalancerDisassembler(w3=w3,
                                    avatar_safe_address=safe_address,
                                    roles_mod_address=roles_mod,
                                    role=role,
                                    tenderly_credentials=TenderlyCredentials(account_id=ACCOUNT_ID,
                                    project=PROJECT, api_token=API_TOKEN),
                                    signer_address=EOA_address)
  else:
    raise Exception("Invalid protocol")

  exit_strategy = getattr(disassembler, exit_strategy)

  txn_transactable = exit_strategy(percentage=percentage, exit_arguments=exit_arguments)

  return disassembler, txn_transactable

def drive_away(simulate: bool, disassembler: Disassembler, txn_transactable: list, private_key: str,
                EOA_address: str):
  try:
    if simulate:
      sim_data, sim_link = disassembler.simulate(txn_transactable)
      if sim_data['transaction']['status']:
        response_message = {"status" : 200, "link": sim_link, 
                            "message": "Transaction executed successfully"}
      else:
        response_message = {"status" : 200, "link": "", 
                          "message": "Transaction reverted"}
    else:
      check_exit_tx = disassembler.check(txn_transactable, account= EOA_address)
      if check_exit_tx:
        exit_tx = disassembler.send(txn_transactable, private_key)
        response_message = {"status" : 200, "link": exit_tx, 
                            "message": "Transaction executed successfully"}
      else:
        response_message = {"status" : 200, "link": "", 
                          "message": "Transaction reverted"}
    return response_message
  except Exception as e:
    return {"status": 500, "message": f"Error: {e}"}

def main():
  parser = argparse.ArgumentParser(description="This is the real Gnosis DAO disassembling script",
                                   epilog='Build by karpatkey',
                                   formatter_class=argparse.ArgumentDefaultsHelpFormatter)

  parser.add_argument("-e", "--execute", action='store_true', help="execute transaction")
  parser.add_argument("-sim", "--simulate", action='store_true',
                      default=os.getenv("SIMULATE", "False").lower() == "true",
                      help="simulate transaction (default: False, or value of SIMULATE environment variable)")

  parser.add_argument("-p", "--percentage", type=int, default=100,
                      help="Percentage of liquidity to be removed, defaults to 100.")
  parser.add_argument("-", "--protocol", type=str, help="Protocol where the funds are deposited.")
  parser.add_argument("-s", "--exitStrategy", type=str, help="Exit strategy to execute, e.g. exit_2_1, exit_3")
  parser.add_argument("-a", "--exitArguments", type=list[dict],
                      help="List of dictionaries with the custom exit arguments for each position and exit strategy, " \
                           "e.g. { 'bpt_address': '0xsOmEAddResS', 'max_slippage': 0.01}")
  args = parser.parse_args()

  simulate = args.simulate
  percentage = args.percentage
  exit_strategy = args.exitStrategy
  exit_arguments = args.exitArguments
  protocol = args.protocol

  role = 4
  roles_mod = "0x1cFB0CD7B1111bf2054615C7C491a15C4A3303cc"
  safe_address = "0x849D52316331967b6fF1198e5E32A0eB168D039d"
  private_key = "FILL" 

  w3 = start_the_engine()

  EOA_address = check_engine(w3, private_key)

  disassembler, txn_transactable = gear_up(protocol, w3, safe_address, roles_mod, role, EOA_address,
                                percentage, exit_strategy, exit_arguments)

  tx_action = drive_away(simulate, disassembler, txn_transactable, private_key, EOA_address)

  return tx_action


if __name__ == "__main__":
  main()
