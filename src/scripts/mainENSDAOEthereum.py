import argparse
import os
from dotenv import load_dotenv
from web3 import Web3
from roles_royce.toolshed.disassembling.Aura.disassembling_aura import AuraDisassembler

load_dotenv()


def main():
  parser = argparse.ArgumentParser(description="This is the real ENS DAO disassembling script",
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

  roles = os.getenv("ENSDAOETH_DISASSEMBLER_ROLE")
  roles_mod = os.getenv("ENSDAOETH_ROLES_MOD")
  safe_address = os.getenv("ENSDAOETH_AVATAR")
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

  # TODO: sanity check with ETH balance

  if protocol == "Aura":
    disassembler = AuraDisassembler(w3=w3,
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
      exit_tx = disassembler.simulate(txn_transactable)
    else:
      # TODO: add a sanity check with the 'check' function of the roles and the amount of ETH needed
      exit_tx = disassembler.send(txn_transactable, private_key)
    # TODO: build the dictionary to be returned
    """
    {"status" : 200,
    "link": etherscan or tenderly link
    "message": "Transaction executed successfully" or "Transaction reverted"
    }
    """
    # The simulate function should also return the status: successful or reverted
    return exit_tx
  except Exception as e:
    return {"status": 500, "message": f"Error: {e}"}


if __name__ == "__main__":
  main()
