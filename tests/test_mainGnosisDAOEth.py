import argparse
import mock
import pytest
from hexbytes import HexBytes

from web3 import Web3

from scripts.mainGnosisDAOEthereum import start_the_engine, check_engine, gear_up, drive_away, main
from roles_royce.toolshed.disassembling.Aura.disassembling_aura import AuraDisassembler

JSON_FORM = {"simulate": True,
          "position_id": "Balancer_106",
          "protocol": "Balancer",
          "common_exec_config": [{"name":"percentage","value": 100}],
          "position_exec_config": [
            {
              "function_name": "exit_1_1",
              "description": "Withdraw funds from the Balancer pool withdrawing all assets in proportional way (not used for pools in recovery mode!)",
              "parameters": [[
                {"name": "bpt_address",
                "value":"0xF4C0DD9B82DA36C07605df83c8a416F11724d88b"},
                {"name": "max_slippage",
                "value": 0.01}
              ]]
            }
            ]
        }

def test_start_the_engine(monkeypatch):
    # have an anvil instance running before testing
    monkeypatch.setenv('RPC_ENDPOINT', 'http://127.0.0.1:8546')
    w3 = start_the_engine()
    assert w3.is_connected

def test_check_engine():
    #This is the first private key of the anvil blockchain fork
    PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    W3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8546'))
    EOA = check_engine(w3=W3, private_key=PRIVATE_KEY)
    assert EOA == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

def test_gear_up():
    PROTOCOL = JSON_FORM["protocol"]
    W3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8546'))
    SAFE_ADDRESS = "0x849D52316331967b6fF1198e5E32A0eB168D039d"
    ROLES_MOD = "0x1cFB0CD7B1111bf2054615C7C491a15C4A3303cc"
    ROLE = 4
    EOA_ADDRESS = "0xb11ea45e2d787323dFCF50cb52b4B3126b94810d"
    PERCENTAGE = JSON_FORM["common_exec_config"][0]["value"]
    EXIT_STRATEGY = JSON_FORM["position_exec_config"][0]["function_name"]
    EXIT_ARGUMENTS = [JSON_FORM["position_exec_config"][0]["parameters"][0]]

    disassembler, txn_transactable = gear_up(PROTOCOL, W3, SAFE_ADDRESS, ROLES_MOD, ROLE, EOA_ADDRESS,
                                PERCENTAGE, EXIT_STRATEGY, EXIT_ARGUMENTS)
    assert disassembler.avatar_safe_address == '0x849D52316331967b6fF1198e5E32A0eB168D039d'    
    assert txn_transactable[0].data == """0x8bdb3913f4c0dd9b82da36c07605df83c8a416f11724d88b000200000000000000000026000000000000000000000000849d52316331967b6ff1198e5e32a0eb168d039d000000000000000000000000849d52316331967b6ff1198e5e32a0eb168d039d0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000006810e776880c02933d47db1b9fc05908e5386b96000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000"""   

#@pytest.mark.skip("WIP")   
def test_drive_away_simulate():
    PROTOCOL = JSON_FORM["protocol"]
    W3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8546'))
    SAFE_ADDRESS = "0x849D52316331967b6fF1198e5E32A0eB168D039d"
    ROLES_MOD = "0x1cFB0CD7B1111bf2054615C7C491a15C4A3303cc"
    ROLE = 4
    EOA_ADDRESS = "0xb11ea45e2d787323dFCF50cb52b4B3126b94810d"
    PERCENTAGE = JSON_FORM["common_exec_config"][0]['value']
    EXIT_STRATEGY = JSON_FORM["position_exec_config"][0]["function_name"]
    EXIT_ARGUMENTS = [JSON_FORM["position_exec_config"][0]["parameters"][0]]
    PRIVATE_KEY = "FILL"
    SIMULATE = True

    DISASSEMBLER, TXN_TRANSACTABLE = gear_up(PROTOCOL, W3, SAFE_ADDRESS, ROLES_MOD, ROLE, EOA_ADDRESS,
                                PERCENTAGE, EXIT_STRATEGY, EXIT_ARGUMENTS)
    tx_data, response = drive_away(SIMULATE, DISASSEMBLER, TXN_TRANSACTABLE, PRIVATE_KEY, EOA_ADDRESS)

#TODO: get some values out of the tenderly link to assert success
    assert tx_data['transaction']['status'] == True

#@pytest.mark.skip("WIP")   
def test_drive_away_send():
    PROTOCOL = JSON_FORM["protocol"]
    W3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8546'))
    SAFE_ADDRESS = "0x849D52316331967b6fF1198e5E32A0eB168D039d"
    ROLES_MOD = "0x1cFB0CD7B1111bf2054615C7C491a15C4A3303cc"
    ROLE = 1
    EOA_ADDRESS = "0xF2cB2a75Fe8eA689e9335f37383D238324EE9cD4"
    PERCENTAGE = JSON_FORM["common_exec_config"][0]['value']
    EXIT_STRATEGY = JSON_FORM["position_exec_config"][0]["function_name"]
    EXIT_ARGUMENTS = [JSON_FORM["position_exec_config"][0]["parameters"][0]]
    PRIVATE_KEY = "FILL"
    SIMULATE = False

    W3.eth.send_transaction({"to": EOA_ADDRESS, "value": Web3.to_wei(1, "ether"), "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"})

    DISASSEMBLER, TXN_TRANSACTABLE = gear_up(PROTOCOL, W3, SAFE_ADDRESS, ROLES_MOD, ROLE, EOA_ADDRESS,
                                PERCENTAGE, EXIT_STRATEGY, EXIT_ARGUMENTS)
    tx_data, response = drive_away(SIMULATE, DISASSEMBLER, TXN_TRANSACTABLE, PRIVATE_KEY, EOA_ADDRESS)
    #TODO this should not revert!
    assert response == {'status': 200, 'link': '', 'message': 'Transaction reverted'}

@pytest.mark.skip("WIP")
@mock.patch('argparse.ArgumentParser.parse_args',
            return_value=argparse.Namespace(execute=False, simulate=JSON_FORM['simulate'], percentage=JSON_FORM["common_exec_config"][0]['value'], 
                protocol=JSON_FORM["protocol"], exitStrategy=JSON_FORM["position_exec_config"][0]["function_name"],
                exitArguments=JSON_FORM["position_exec_config"][0]["parameters"]))
def test_main(mock_args):
    res = main()
    assert res.args.simulate == True
    assert res.EOA_address == "0x000"

    

