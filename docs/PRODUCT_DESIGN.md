# Product Design Document: On-Chain Loyalty Points Platform

This document summarizes the key decisions, design iterations, and technical choices made during the development of the On-Chain Loyalty Points Platform. It consolidates all discussions from our initial concept to the current MVP.

## 1. High-Level Vision & Goal

**Vision:** To provide small businesses with a simple, secure tool to create and sell their own on-chain loyalty points, just like a traditional points card or stored-value system.

**Goal:** Build an intuitive platform that allows a business owner (like Alice) to offer a "Points Pre-Sale" to her loyal customers, giving them a new way to engage with her brand.

## 2. Core User Personas

We identified three primary user personas:

*   **Alice (The Business Owner):** A small business owner (e.g., coffee shop) who wants to engage customers and offer loyalty rewards on-chain. She is not crypto-native and needs a simple, intuitive interface.

*   **Bob (The Customer/Supporter):** A customer looking to support local businesses and earn loyalty points. They need a clear, secure way to purchase and manage their points.

*   **Charlie (The Promoter/Affiliate):** (Future) A user who wants to leverage their social network to support businesses and earn rewards for driving sales.

## 3. Product Scope & Assumptions

**IN SCOPE (MVP):**

*   A simple, clean web interface (dApp).
*   A process that both creates the EIP-1155 loyalty token AND the sale contract for the business owner in one flow.
*   A public page for each sale where customers can purchase loyalty points.
*   Functionality for the business owner to collect pre-sale proceeds.
*   Functionality for customers to claim their purchased loyalty points.
*   Basic business verification (Google Maps link, photo URLs).

**OUT OF SCOPE (for this MVP):**

*   User accounts (no AirAccount, no email login for this MVP).
*   Gasless transactions.
*   The affiliate/promoter system (QR codes, etc.).
*   Any point-of-sale integration for redeeming points for coffee.
*   Advanced business verification (e.g., image uploads, dynamic reputation algorithms).
*   Insurance Fund.

**Assumptions:**

*   We will build on an EVM-compatible Layer 2 (e.g., Sepolia for testnet) to keep transaction fees low.
*   Users will use self-custodial wallets (e.g., MetaMask).
*   The platform will frame PNTs as utility-focused loyalty points, not financial instruments, to align with legal clarity.

## 4. Core Product Flow (The User Journey)

### Phase 1: Create Your Digital Points Card (Business Owner)

1.  **Connect Wallet:** Alice connects her business's crypto wallet.
2.  **Basic Details:** Alice provides her Business Name, Loyalty Point Name, Symbol, Total Points for Pre-Sale, Price per Point, Pre-Sale Goal, Minimum Goal, and Sale Dates.
3.  **Build Trust & Verify:** Alice provides a Google Maps link and URLs for business photos (shopfront, interior, etc.).
4.  **Launch:** Alice reviews details and signs a transaction. The platform deploys her unique EIP-1155 loyalty token and a dedicated Sale contract.

### Phase 2: The Points Pre-Sale (Customer)

1.  **Discover:** Customers browse available pre-sales on the platform's `/sales` page.
2.  **View Details:** Customers visit an individual sale page (`/sale/[saleAddress]`) to see business verification details, loyalty point information, and sale parameters.
3.  **Purchase:** Customers connect their wallet, enter the amount of points to purchase, approve currency spending, and confirm the transaction.

### Phase 3: Pre-Sale Completion & Management

1.  **Finalization:** After the `SALE_END_TIME`, anyone can call `finalize()` on the Sale contract. The sale is marked as `Successful` if the Minimum Goal is met, or `Failed` otherwise.
2.  **Collect Proceeds (Business Owner):** If `Successful`, Alice can call `withdraw()` to collect the pre-sale currency.
3.  **Claim Points (Customer):** If `Successful`, customers can call `claim()` to receive their purchased loyalty points.
4.  **Get Refund (Customer):** If `Failed`, customers can call `refund()` to get their currency back.

## 5. Technical Architecture & Stack

**Smart Contracts:**

*   **Standard:** EIP-1155 (for fungible loyalty points). (Initial consideration of EIP-777 was dropped due to security concerns and deprecation by OpenZeppelin).
*   **Development Framework:** Foundry (Forge, Anvil). (Initial consideration of Hardhat was changed based on user preference).
*   **Contracts:**
    *   `OpenPNTs.sol`: The main EIP-1155 contract, owned by the platform, responsible for creating and managing all loyalty point types (Token IDs).
    *   `Sale.sol`: Manages the logic for a single pre-sale campaign (purchase, claim, refund, finalize). Implements ERC1155Receiver for safe token transfers.
    *   `SaleFactory.sol`: Deploys new `Sale` contracts and acts as a registry for all deployed sales.

**Frontend:**

*   **Framework:** Next.js (React).
*   **Styling:** Tailwind CSS.
*   **Web3 Integration:** Wagmi (for React hooks) and Viem (for low-level blockchain interactions). (Initial consideration of Ethers.js was changed based on user preference).
*   **Deployment:** Served via `pnpm dev` locally, with environment variables for contract addresses and RPC URLs.

**Development Environment:**

*   `dev.sh`: A shell script to automate local development setup (starts Anvil, deploys contracts, starts frontend). Loads sensitive variables from `.env.local`.
*   `deploy-sepolia.sh`: A shell script for deploying contracts to the Sepolia testnet, also loading variables from `.env.local`.
*   `.env.local`: For managing sensitive environment variables (private keys, API keys) locally, excluded from Git.
*   `template.env`: Provides a template for `.env.local`.

## 6. Trust & Risk Management

*   **Legal Framing:** The platform explicitly frames PNTs as utility-based loyalty points, not financial instruments or securities. Terms of Service will reflect this.
*   **Creator Verification (MVP):** Business owners provide Google Maps links and photo URLs to build trust with customers.
*   **Pre-Sale Limits:** The maximum pre-sale goal is limited (e.g., 1x self-reported monthly revenue) to align with the business's real-world scale and reduce risk of over-funding.
*   **Security:** Use of audited OpenZeppelin contracts, thorough testing, and a mature development stack. (Publicly known Anvil private key was identified as a security risk and replaced with a secure generation method).

## 7. Future Roadmap & Enhancements

*   **Advanced Business Verification:** Implement actual image uploads, integration with business registries, and dynamic reputation scoring.
*   **PNT Metadata Hosting:** Implement a robust solution for hosting PNT metadata (e.g., IPFS gateway, dedicated API).
*   **Insurance Fund:** Develop a smart contract and UI for a platform-level insurance fund to compensate customers in case of business default.
*   **Account Abstraction (AirAccount):** Integrate EIP-4337 for gasless transactions, social logins, and enhanced wallet security.
*   **Promoter/Affiliate System:** Implement the QR code-based system for customers to earn PNTs by promoting businesses.
*   **Point-of-Sale Integration:** Develop tools for businesses to easily redeem PNTs for goods/services.
*   **UI/UX Refinements:** Continuous improvement of the frontend user experience, error handling, and loading states.
*   **Soulbound Tokens (SBTs):** Explore using EIP-5192 for non-transferable tokens to represent loyalty tiers or achievements.

