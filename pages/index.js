import Head from 'next/head'
import { useState, useRef } from 'react'
import { ethers } from 'ethers'
import { hasEthereum } from '../utils/ethereum'
import Minter from '../src/artifacts/contracts/Minter.sol/Minter.json'
import TotalSupply from '../components/TotalSupply'
import Wallet from '../components/Wallet'

export default function Home() {
  // Constants
  const MINT_PRICE = 0.03;
  const MAX_MINT = 10;

  // UI state
  const [mintQuantity, setMintQuantity] = useState(1)
  const mintQuantityInputRef = useRef()
  const [mintError, setMintError] = useState(false)
  const [mintMessage, setMintMessage] = useState('')
  const [mintLoading, setMintLoading] = useState(false)

  // Call smart contract to mint NFT(s) from current address
  async function mintNFTs() {
    // Check quantity
    if ( mintQuantity < 1 ) {
      setMintMessage('You need to mint at least 1 NFT.')
      setMintError(true)
      mintQuantityInputRef.current.focus()
      return
    }
    if ( mintQuantity > MAX_MINT ) {
      setMintMessage('You can only mint a maximum of 10 NFTs.')
      setMintError(true)
      mintQuantityInputRef.current.focus()
      return
    }

    // Get wallet details
    if(!hasEthereum()) return
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()

      try {
        const address = await signer.getAddress()

        setMintLoading(true);
          // Interact with contract
          const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTER_ADDRESS, Minter.abi, signer)
          const totalPrice = MINT_PRICE * mintQuantity
          const transaction = await contract.mint(mintQuantity, { value: ethers.utils.parseEther(totalPrice.toString()) })
          await transaction.wait()

          mintQuantityInputRef.current.value = 0
          setMintMessage(`Congrats, you minted ${mintQuantity} token(s)!`)
          setMintError(false)
      } catch {
        setMintMessage('Connect your wallet first.');
        setMintError(true)
      }
    } catch(error) {
        setMintMessage(error.message)
        setMintError(true)
    }
    setMintLoading(false)
  }

  return (
    <div className="max-w-xl mt-36 mx-auto px-4">
      <Head>
        <title>Solidity Next.js Mint Starter</title>
        <meta name="description" content="Mint an NFT, or a number of NFTs, from the client-side." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wallet />
      <main className="space-y-8">
        { ! process.env.NEXT_PUBLIC_MINTER_ADDRESS ? (
            <p className="text-md">
              Please add a value to the <pre>NEXT_PUBLIC_MINTER_ADDRESS</pre> environment variable.
            </p>
        ) : (
          <>
            <h1 className="text-4xl font-semibold mb-8">
              Solidity Next.js Mint Starter
            </h1>
            <TotalSupply />
            <div className="space-y-8">
                <div className="bg-gray-100 p-4 lg:p-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">Mint NFTs</h2>
                    <label className="text-gray-600 text-sm mb-2 inline-block">
                      How many NFTs would you like to mint from the smart contract?
                    </label>
                    <div className="flex">
                      <input
                          className={ ! mintError ? "border p-4 text-center rounded-tl rounded-bl focus:outline-none focus:border-blue-600 w-2/3" : "border border-red-500 p-4 text-center rounded-tl rounded-bl focus:outline-none focus:border-blue-600 w-2/3"}
                          onChange={ e => setMintQuantity(e.target.value)}
                          value={mintQuantity}
                          placeholder="1"
                          type="number"
                          min="1"
                          max="10"
                          ref={mintQuantityInputRef}
                        />
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-tr rounded-br w-1/3"
                        onClick={mintNFTs}
                      >
                        { mintLoading ? 'Loading...' : 'Mint' }
                      </button>
                    </div>
                    { mintMessage && <span className={mintError ? "text-red-600 text-xs mt-2 block" : "text-green-600 text-xs mt-2 block"}>{ mintMessage }</span> }
                  </div>
                </div>
            </div>
          </>
        ) }
      </main>

      <footer className="mt-20 text-center">
        <a
          href="https://github.com/tomhirst/solidity-nextjs-mint-starter/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          Read the docs
        </a>
      </footer>
    </div>
  )
}
