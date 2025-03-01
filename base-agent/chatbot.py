import os
import sys
import json
import time
import secrets

from dotenv import load_dotenv

from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

from coinbase_agentkit import (
    AgentKit,
    AgentKitConfig,
    
    EthAccountWalletProvider,
    EthAccountWalletProviderConfig,
    
    cdp_api_action_provider,
    erc20_action_provider,
    pyth_action_provider,
    wallet_action_provider,
    weth_action_provider,
)
from coinbase_agentkit_langchain import get_langchain_tools

from eth_account import Account
import requests

"""
AgentKit Integration

This file serves as the entry point for integrating AgentKit into your chatbot.  
It defines your AI agent, enabling you to  
customize its behavior, connect it to blockchain networks, and extend its functionality  
with additional tools and providers.

# Key Steps to Customize Your Agent:

1. Select your LLM:
   - Modify the `ChatOpenAI` instantiation to choose your preferred LLM.

2. Set up your WalletProvider:
   - Learn more: https://github.com/coinbase/agentkit/tree/main/python/agentkit#evm-wallet-providers

3. Set up your Action Providers:
   - Action Providers define what your agent can do.  
   - Choose from built-in providers or create your own:
     - Built-in: https://github.com/coinbase/agentkit/tree/main/python/coinbase-agentkit#create-an-agentkit-instance-with-specified-action-providers
     - Custom: https://github.com/coinbase/agentkit/tree/main/python/coinbase-agentkit#creating-an-action-provider

4. Instantiate your Agent:
   - Pass the LLM, tools, and memory into your agent's initialization function to bring it to life.

# Next Steps:

- Explore the AgentKit README: https://github.com/coinbase/agentkit
- Learn more about available WalletProviders & Action Providers.
- Experiment with custom Action Providers for your unique use case.

## Want to contribute?
Join us in shaping AgentKit! Check out the contribution guide:  
- https://github.com/coinbase/agentkit/blob/main/CONTRIBUTING.md
- https://discord.gg/CDP
"""
# Configure a file to persist wallet data
wallet_data_file = "wallet_data.txt"

load_dotenv()

def get_space_random_seed():
    """Fetch a random seed from the specified API."""
    url = "https://op.spacecoin.xyz/api/v1/rand_seed"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching random seed: {e}")
        return None

def initialize_agent():
    """Initialize the agent with an Ethereum Account Wallet Provider."""

    seed = get_space_random_seed()
    # Ensure the seed is within the acceptable range
    seed_value = int(seed["value"], 16) % (2**63)
    # Initialize LLM: https://platform.openai.com/docs/models#gpt-4o
    llm = ChatOpenAI(model="gpt-4o-mini", seed=seed_value)

    print(seed, seed["value"])

    # Initialize WalletProvider: https://docs.cdp.coinbase.com/agentkit/docs/wallet-management
    private_key = os.getenv("PRIVATE_KEY")
    
    if not private_key:
        if os.path.exists(wallet_data_file):
            try:
                with open(wallet_data_file) as f:
                    wallet_data = json.load(f)
                    private_key = wallet_data.get("private_key")
                    print("Found private key in wallet_data.txt")
            except Exception as e:
                print(f"Error reading wallet data: {e}")
        
        if not private_key:
            # Generate new private key if none exists
            private_key = "0x" + secrets.token_hex(32)
            with open(wallet_data_file, "w") as f:
                json.dump({"private_key": private_key}, f)
            print("Created new private key and saved to wallet_data.txt")
            print("We recommend you save this private key to your .env file and delete wallet_data.txt afterwards.")

    assert private_key.startswith("0x"), "Private key must start with 0x hex prefix"
    
    # Create Ethereum account from private key
    account = Account.from_key(private_key)

    wallet_provider = EthAccountWalletProvider(
        config=EthAccountWalletProviderConfig(
            account=account,
            chain_id="84532"
        )
    )
    

    # Initialize AgentKit: https://docs.cdp.coinbase.com/agentkit/docs/agent-actions
    agentkit = AgentKit(AgentKitConfig(
        wallet_provider=wallet_provider,
        action_providers=[
            
            cdp_api_action_provider(),
            erc20_action_provider(),
            pyth_action_provider(),
            wallet_action_provider(),
            weth_action_provider(),
        ]
    ))

    

    # Transform agentkit configuration into langchain tools
    tools = get_langchain_tools(agentkit)
    
    # Store buffered conversation history in memory.
    memory = MemorySaver()
    
    config = {"configurable": {"thread_id": "Ethereum Account Chatbot"}}
    
    # Create ReAct Agent using the LLM and CDP Agentkit tools.
    return create_react_agent(
        llm,
        tools=tools,
        checkpointer=memory,
        state_modifier=(
            "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. "
            "You are empowered to interact onchain using your tools. If you ever need funds, you can request "
            "them from the faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet "
            "details and request funds from the user. Before executing your first action, get the wallet details "
            "to see what network you're on. If there is a 5XX (internal) HTTP error code, ask the user to try "
            "again later. If someone asks you to do something you can't do with your currently available tools, "
            "you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, "
            "recommend they go to docs.cdp.coinbase.com for more information. Be concise and helpful with your "
            "responses. Refrain from restating your tools' descriptions unless it is explicitly requested."
        ),
    ), config


# Autonomous Mode
def run_autonomous_mode(agent_executor, config, interval=10):
    """Run the agent autonomously with specified intervals."""
    print("Starting autonomous mode...")
    while True:
        try:
            # Provide instructions autonomously
            thought = (
                "Be creative and do something interesting on the blockchain. "
                "Choose an action or set of actions and execute it that highlights your abilities."
            )

            # Run agent in autonomous mode
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=thought)]}, config
            ):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")

            # Wait before the next action
            time.sleep(interval)

        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)


# Chat Mode
def run_chat_mode(agent_executor, config):
    """Run the agent interactively based on user input."""
    print("Starting chat mode... Type 'exit' to end.")
    while True:
        try:
            user_input = input("\nPrompt: ")
            if user_input.lower() == "exit":
                break

            # Run agent with the user's input in chat mode
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=user_input)]}, config
            ):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")

        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)


# Mode Selection
def choose_mode():
    """Choose whether to run in autonomous or chat mode based on user input."""
    while True:
        print("\nAvailable modes:")
        print("1. chat    - Interactive chat mode")
        print("2. auto    - Autonomous action mode")

        choice = input("\nChoose a mode (enter number or name): ").lower().strip()
        if choice in ["1", "chat"]:
            return "chat"
        elif choice in ["2", "auto"]:
            return "auto"
        print("Invalid choice. Please try again.")


def main():
    """Start the chatbot agent."""
    agent_executor, config = initialize_agent()

    mode = choose_mode()
    if mode == "chat":
        run_chat_mode(agent_executor=agent_executor, config=config)
    elif mode == "auto":
        run_autonomous_mode(agent_executor=agent_executor, config=config)


if __name__ == "__main__":
    print("Starting Agent...")
    main()
