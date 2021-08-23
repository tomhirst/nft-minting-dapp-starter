import { ethers } from 'ethers'

// Check for MetaMask wallet browser extension
function hasEthereum () {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

// Request wallet account
async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'})
}

export { hasEthereum, requestAccount }