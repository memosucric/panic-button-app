import argparse
import mock
import pytest

from web3 import Web3

from scripts.mainGnosisDAOEthereum import start_the_engine, check_engine, gear_up, drive_away, main
from roles_royce.toolshed.disassembling.Aura.disassembling_aura import AuraDisassembler


JSON_FORM = {"simulate": True,
          "position_id": "Aura_33",
          "protocol": "Aura",
          "common_exec_config": {"percentage": 100},
          "position_exec_config": [
            {
              "function_name": "exit_1",
              "description": "Withdraw from Aura",
              "parameters": [
                {"rewards_address": "0xdd1fe5ad401d4777ce89959b7fa587e569bf125d",
                "max_slippage": 0.1}
              ]
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
    PERCENTAGE = JSON_FORM["common_exec_config"]['percentage']
    EXIT_STRATEGY = JSON_FORM["position_exec_config"][0]["function_name"]
    EXIT_ARGUMENTS = JSON_FORM["position_exec_config"][0]["parameters"]

    disassembler, txn_transactable = gear_up(PROTOCOL, W3, SAFE_ADDRESS, ROLES_MOD, ROLE, EOA_ADDRESS,
                                PERCENTAGE, EXIT_STRATEGY, EXIT_ARGUMENTS)
    assert disassembler.avatar_safe_address == '0x849D52316331967b6fF1198e5E32A0eB168D039d'    
    assert txn_transactable[0].data == "0xc32e7202000000000000000000000000000000000000000000000051869e87b8f26fdf540000000000000000000000000000000000000000000000000000000000000001"    

@pytest.mark.skip("WIP")   
def test_drive_away():
    PROTOCOL = JSON_FORM["protocol"]
    W3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8546'))
    SAFE_ADDRESS = "0x849D52316331967b6fF1198e5E32A0eB168D039d"
    ROLES_MOD = "0x1cFB0CD7B1111bf2054615C7C491a15C4A3303cc"
    ROLE = 4
    EOA_ADDRESS = "0xb11ea45e2d787323dFCF50cb52b4B3126b94810d"
    PERCENTAGE = JSON_FORM["common_exec_config"]['percentage']
    EXIT_STRATEGY = JSON_FORM["position_exec_config"][0]["function_name"]
    EXIT_ARGUMENTS = JSON_FORM["position_exec_config"][0]["parameters"]
    PRIVATE_KEY = "FILL"
    SIMULATE = True

    DISASSEMBLER, TXN_TRANSACTABLE = gear_up(PROTOCOL, W3, SAFE_ADDRESS, ROLES_MOD, ROLE, EOA_ADDRESS,
                                PERCENTAGE, EXIT_STRATEGY, EXIT_ARGUMENTS)
    response = drive_away(SIMULATE, DISASSEMBLER, TXN_TRANSACTABLE, PRIVATE_KEY, EOA_ADDRESS)

    assert response == ""


@pytest.mark.skip("WIP")
@mock.patch('argparse.ArgumentParser.parse_args',
            return_value=argparse.Namespace(execute=False, simulate=JSON_FORM['simulate'], percentage=JSON_FORM["common_exec_config"]['percentage'], 
                protocol=JSON_FORM["protocol"], exitStrategy=JSON_FORM["position_exec_config"][0]["function_name"],
                exitArguments=JSON_FORM["position_exec_config"][0]["parameters"]))
def test_main(mock_args):
    res = main()
    assert res.args.simulate == True
    assert res.EOA_address == "0x000"
    

