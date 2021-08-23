import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { hasEthereum, requestAccount } from '../utils/ethereum'
import Minter from '../src/artifacts/contracts/Minter.sol/Minter.json'

export default function TotalSupply() {
    // UI state
    const [loading, setLoading] = useState(true)
    const [totalSupply, setTotalSupply] = useState(0)

    // Constants
    const TOTAL = 10000;

    useEffect( function() {
        async function fetchTotalSupply() {
            if(! hasEthereum()) {
                console.log('Install MetaMask')
                setLoading(false)
                return
            }
    
            await getTotalSupply()
        
            setLoading(false)
        }
        fetchTotalSupply();
    });

    // Get total supply of tokens from smart contract
    async function getTotalSupply() {
        try {
          // Interact with contract
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTER_ADDRESS, Minter.abi, provider)
          const data = await contract.totalSupply()
      
          setTotalSupply( data.toNumber() );
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <p>Tokens minted: { loading ? 'Loading...' : `${totalSupply}/${TOTAL}` }</p>
    )
}