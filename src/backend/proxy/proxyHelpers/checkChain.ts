import { AddEthereumChainParameter, Chain } from '../types'
import { web3, provider } from '../providerHelper'

// NOTE: This only works with MetaMask currently but could expand to other providers with EIP-3326
// Attempts to switch to the provided Ethereum chain with chainId
// If chainId is not added and addEthChainParams is passed, it will request to add the chain
// Returns empty string on success and human readable error message on failure
async function switchOrAddEthereumChain(chain: Chain) {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: web3.utils.toHex(chain.chainId) }]
    })
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (switchError: any) {
    // Not working with MM SDK: This error code indicates that the chain has not been added to MetaMask.
    // if (switchError.code === 4902) {
    // type guards to ensure the ethereum chain can be added
    const requiredFieldsAreSupplied =
      chain.chainMetadata !== undefined &&
      chain.chainMetadata.chainName !== undefined &&
      chain.chainMetadata.nativeCurrency !== undefined &&
      chain.chainMetadata.nativeCurrency.name !== undefined &&
      chain.chainMetadata.nativeCurrency.symbol !== undefined &&
      chain.chainMetadata.nativeCurrency.decimals === 18 &&
      chain.chainMetadata.rpcUrls !== undefined &&
      chain.chainMetadata.rpcUrls.length > 0
    if (chain.chainMetadata === undefined || !requiredFieldsAreSupplied) {
      console.log(JSON.stringify(chain.chainMetadata, null, 4))
      throw 'Chain is not added and the chain data was not provided or malformed. Please pass chain data on the next call.'
    }
    const chainParameter: AddEthereumChainParameter = {
      chainId: web3.utils.toHex(chain.chainId),
      ...chain.chainMetadata
    }
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [chainParameter]
      })
      return
    } catch (addError) {
      // handle "add" error
      throw `There was an error adding the chain. ${addError}`
    }
    // }
    // handle other "switch" errors
    // console.log(switchError.code)
    // throw `There was an error switching to the chain. ${switchError}`
  }
}

export async function checkChainId(chain: Chain) {
  //type guard
  if (chain === undefined || chain.chainId === undefined) {
    throw 'ChainId must be specified'
  }
  // need to check because only MetaMask supports `wallet_switchEthereumChain`
  const currentChainId: number = await web3.eth.getChainId()

  if (chain.chainId !== currentChainId.toString()) {
    // what does this return for non metamask? expected that it throws
    // shouldn't send txn in that instance
    await switchOrAddEthereumChain(chain)
    // not necessary for metamask. might be needed for other wallets
    // double check that user did not reject request to switch networks
    // const currentChainIdAfterSwitch: number = await web3.eth.getChainId()
    // if (chain.chainId !== currentChainIdAfterSwitch.toString()) {
    //   throw 'User rejected the chain swap request'
    // }
  }
}
