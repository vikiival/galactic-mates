# Galactic Mates

Welcome to the Galactic Mates project, which is submitted as a part of the EthDenver BUILDathon! This project combines Space randomness with AI agents, to bring the next generation of Aliens to our lives.  

## **Overview**
The system is a dApp that generates personalized AI waifus based on user input and randomness, then mints them as NFTs on blockchain managed by Base AI-Agent kit. It integrates multiple components, including **Spacecoin Orbitport**, **Farcaster Frames v2**, **Base**,  **Base Agent**,and **AI Waifu Generator (koda.art)**.  

---

## **Architecture Components**  

### **1. Frontend (User Interaction)**
- **Farcaster Frames v2** provides an interactive UI, allowing users to engage with the app through social and blockchain-integrated experiences.  
- Users submit inputs through a **random form** (e.g., "How lonely are you?" slider + personality analysis).  

### **2. Agent Personality Generation**
- The system combines:  
  - **Space randomness** (sourced from **Spacecoin OrbitPort**).  
  - **User input** (personality analysis and randomness).  
- This generates a **unique agent personality**, determining attributes for the AI waifu.  

### **3. Image Generation**
- The generated personality prompt is sent to **koda.art (AI Waifu Generator)**.  
- The model creates a **custom anime waifu** based on the agent’s characteristics.  

### **4. Blockchain & NFT Minting**
- The generated waifu is tokenized as an **NFT on Base (L2 blockchain)**.  
- The **tokenId is derived from the seed**, ensuring uniqueness and verifiability.  
- The NFT is stored and managed **on-chain**, enabling ownership, trading, and social interactions.  

## **Workflow Summary**
1. **User opens the app** → interact w/ **Farcaster Frames v2**.  
2. **Random form input** → personality + space randomness determine agent traits.  
3. **AI-generated waifu** → prompt sent to **koda.art** for image creation.  
4. **NFT Minting on Base** → unique token with seed as **tokenId**.  
5. **User owns the waifu NFT** → trade, showcase, or interact with it.
6. **Base Agent-AI Kit**  → interacts with the Base

## Installation

To get started with Galactic Mates, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/galactic-mates.git
    ```
2. Navigate to the project directory:
    ```bash
    cd galactic-mates
    ```
3. Install the dependencies in respective subdirectories to start the respective flow and base agents:

## Usage

You will be able to interact with each agent individually in your prompt, future interactions are WIP!

