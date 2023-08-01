// import { expect } from 'chai'
// import { BigNumber } from 'ethers'
// import { deployments, ethers, getNamedAccounts, network } from 'hardhat'

// import { signCreateDropRequest } from '../lib/utils'

// const memory: any = {}

// describe('OnCyberAndFriends', function () {
//   before(async () => {
//     memory.signers = await ethers.getSigners()
//   })

//   beforeEach(async () => {
//     memory.namedAccounts = await getNamedAccounts()

//     await deployments.fixture()
//     memory.deployer = memory.signers[0]
//     memory.oncyber = memory.signers[1]
//     memory.manager = memory.signers[2]
//     memory.biconomyForwarder = memory.signers[3]
//     memory.other = memory.signers[4]
//     memory.other2 = memory.signers[5]
//     memory.other3 = memory.signers[6]
//     memory.other4 = memory.signers[7]
//     const contract = await deployments.diamond.deploy('DiamondOnCyberAndFriends', {
//       from: memory.deployer.address,
//       owner: memory.deployer.address,
//       facets: ['OnCyberAndFriendsFactoryFacet'],
//       execute: {
//         methodName: 'initialize',
//         args: [
//           'ipfs://',
//           memory.manager.address,
//           memory.biconomyForwarder.address,
//           memory.namedAccounts.opensea,
//           memory.oncyber.address,
//         ],
//       },
//     })
//     memory.abi = contract.abi
//     memory.contract = await ethers.getContractAt(memory.abi, contract.address, memory.deployer)
//   })

//   describe('WOW mint capacitor', () => {
//     it('shouldnt mint wow if not sender', async () => {
//       const uri = 'Qmsfzefi221ifjzifj'
//       const timeStart = parseInt((Date.now() / 1000 - 100).toString())
//       const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
//       const price = 0
//       const amountCap = 4
//       const shareCyber = 50

//       const signatureDrop = await signCreateDropRequest(
//         uri,
//         timeStart,
//         timeEnd,
//         BigNumber.from(price),
//         amountCap,
//         shareCyber,
//         memory.other.address,
//         0,
//         memory.manager
//       )
//       await memory.contract
//         .connect(memory.other)
//         .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)

//       const tokenId = 0

//       await expect(
//         memory.contract.connect(memory.other).mintTransfer(memory.other.address, tokenId, 1)
//       ).to.be.revertedWith('NS')
//     })

//     it('shouldnt mint wow if not correct token', async () => {
//       const id = 2

//       await expect(memory.contract.connect(memory.other).mintTransfer(memory.other.address, id, 1)).to.be.revertedWith(
//         'NT'
//       )
//     })

//     it('shouldnt mint wow token out of time', async () => {
//       const uri = 'Qmsfzefi221ifjzifj'
//       const timeStart = parseInt((Date.now() / 1000 - 1).toString())
//       const timeEnd = parseInt((Date.now() / 1000).toString())
//       const price = 0
//       const amountCap = 4
//       const shareCyber = 5

//       await network.provider.request({
//         method: 'hardhat_impersonateAccount',
//         params: ['0x09f717f77B5e7f2D2F37604fEC3D0e3D53eB9808'],
//       })

//       const wowContract = await ethers.getSigner('0x09f717f77B5e7f2D2F37604fEC3D0e3D53eB9808')
//       memory.deployer.sendTransaction({ to: wowContract.address, value: 1099510650775 })

//       for (let index = 0; index < 15; index++) {
//         const nonce = await memory.contract.minterNonce(memory.other.address)

//         const signatureDrop = await signCreateDropRequest(
//           uri,
//           timeStart,
//           timeEnd,
//           BigNumber.from(price),
//           amountCap,
//           shareCyber,
//           memory.other.address,
//           nonce,
//           memory.manager
//         )
//         await memory.contract
//           .connect(memory.other)
//           .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)
//       }

//       const id = 0

//       await expect(memory.contract.connect(wowContract).mintTransfer(memory.other.address, id, 1)).to.be.revertedWith(
//         'OOT'
//       )
//     })

//     it('shouldnt mint wow token cap reached', async () => {
//       const uri = 'Qmsfzefi221ifjzifj'
//       const timeStart = parseInt((Date.now() / 1000 - 1).toString())
//       const timeEnd = parseInt((Date.now() / 1000).toString())
//       const price = 0
//       const amountCap = 4
//       const shareCyber = 5

//       await network.provider.request({
//         method: 'hardhat_impersonateAccount',
//         params: ['0x09f717f77B5e7f2D2F37604fEC3D0e3D53eB9808'],
//       })

//       const wowContract = await ethers.getSigner('0x09f717f77B5e7f2D2F37604fEC3D0e3D53eB9808')
//       memory.deployer.sendTransaction({ to: wowContract.address, value: 1099510650775 })

//       for (let index = 0; index < 15; index++) {
//         const nonce = await memory.contract.minterNonce(memory.other.address)

//         const signatureDrop = await signCreateDropRequest(
//           uri,
//           timeStart,
//           timeEnd,
//           BigNumber.from(price),
//           amountCap,
//           shareCyber,
//           memory.other.address,
//           nonce,
//           memory.manager
//         )
//         await memory.contract
//           .connect(memory.other)
//           .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)
//       }

//       const id = 0

//       await expect(memory.contract.connect(wowContract).mintTransfer(memory.other.address, id, 5)).to.be.revertedWith(
//         'CR'
//       )
//     })

//     it('should mint wow token', async () => {
//       const uri = 'Qmsfzefi221ifjzifj'
//       const timeStart = parseInt((Date.now() / 1000 - 100).toString())
//       const timeEnd = parseInt((Date.now() / 1000 + 100000).toString())
//       const price = 0
//       const amountCap = 4
//       const shareCyber = 5

//       await network.provider.request({
//         method: 'hardhat_impersonateAccount',
//         params: ['0x09f717f77B5e7f2D2F37604fEC3D0e3D53eB9808'],
//       })

//       const wowContract = await ethers.getSigner('0x09f717f77B5e7f2D2F37604fEC3D0e3D53eB9808')
//       memory.deployer.sendTransaction({ to: wowContract.address, value: 1099510650775 })

//       for (let index = 0; index < 15; index++) {
//         const nonce = await memory.contract.minterNonce(memory.other.address)

//         const signatureDrop = await signCreateDropRequest(
//           uri,
//           timeStart,
//           timeEnd,
//           BigNumber.from(price),
//           amountCap,
//           shareCyber,
//           memory.other.address,
//           nonce,
//           memory.manager
//         )
//         await memory.contract
//           .connect(memory.other)
//           .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)
//       }

//       const id = 0

//       await memory.contract.connect(wowContract).mintTransfer(memory.other.address, id, 1)

//       expect(await memory.contract.balanceOf(memory.other.address, id + 14)).to.be.eq('1')
//     })
//   })
// })
