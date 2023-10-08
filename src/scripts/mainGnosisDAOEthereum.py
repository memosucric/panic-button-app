import argparse
import os
from dotenv import load_dotenv
from web3 import Web3
from roles_royce.toolshed.disassembling.Aura.disassembling_aura import AuraDisassembler
from roles_royce.toolshed.disassembling.Balancer.disassembling_balancer import BalancerDisassembler

load_dotenv()


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
  parser.add_argument("-s", "--exit-strategy", type=str, help="Exit strategy to execute, e.g. exit_2_1, exit_3")
  parser.add_argument("-a", "--exit-arguments", type=list[dict],
                      help="List of dictionaries with the custom exit arguments for each position and exit strategy, " \
                           "e.g. { 'bpt_address': '0xsOmEAddResS', 'max_slippage': 0.01}")
  args = parser.parse_args()

  roles = os.getenv("GNOSISDAOETH_DISASSEMBLER_ROLE")
  roles_mod = os.getenv("GNOSISDAOETH_ROLES_MOD")
  safe_address = os.getenv("GNOSISDAOETH_AVATAR")
  private_key = os.getenv("PRIVATE_KEY")
  EOA_address = Web3.eth.account.from_key(private_key).address

  simulate = args.simulate
  percentage = args.percentage
  exit_strategy = args.exitStrategy
  exit_arguments = args.exitArguments
  protocol = args.protocol

  if not private_key:
    raise Exception("Private key is not set!")

  w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_ENDPOINT")))
  if not w3.is_connected():
    w3 = Web3(Web3.HTTPProvider(os.getenv("FALLBACK_RPC_ENDPOINT")))
    if not w3.is_connected():
      raise Exception("No connection to RPC endpoint")

  eth_balance = w3.eth.get_balance(EOA_address)
  if eth_balance <= 0.1:
    raise Exception("Not enough ETH balance in EOA")

  if protocol == "Aura":
    disassembler = AuraDisassembler(w3=w3,
                                    avatar_safe_address=safe_address,
                                    roles_mod_address=roles_mod,
                                    role=roles,
                                    signer_address=EOA_address)
  elif protocol == "Balancer":
    disassembler = BalancerDisassembler(w3=w3,
                                    avatar_safe_address=safe_address,
                                    roles_mod_address=roles_mod,
                                    role=roles,
                                    signer_address=EOA_address)
  else:
    raise Exception("Invalid protocol")

  exit_strategy = getattr(disassembler, exit_strategy)

  txn_transactable = exit_strategy(percentage=percentage, exit_arguments=exit_arguments)

  try:
    if simulate:
      tx_status, sim_link = disassembler.simulate(txn_transactable)
      if tx_status:
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


if __name__ == "__main__":
  main()
