import * as anchor from '@project-serum/anchor'
import { Spl } from '@project-serum/anchor'
import { Keypair } from '@solana/web3.js'
import { AnchorProgram } from '../target/types/anchor_program'

describe('anchor-program', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace
    .AnchorProgram as anchor.Program<AnchorProgram>

  const splProgram = Spl.token(provider)

  it('Is initialized!', async () => {
    const amount = new anchor.BN(100)
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('mint'), provider.wallet.publicKey.toBuffer()],
      program.programId,
    )

    const tokenAccount = await anchor.utils.token.associatedAddress({
      mint,
      owner: provider.wallet.publicKey,
    })

    // Add your test here.
    const tx = await program.methods
      .initializeMint(amount)
      .accounts({
        user: provider.wallet.publicKey,
        mint,
        tokenAccount,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc()
    console.log('Your transaction signature', tx)

    const tokenAccountData = await splProgram.account.token.fetch(tokenAccount)
    console.log('tokenAccountData', tokenAccountData.amount.toNumber())
  })

  it('Transfer!', async () => {
    const amount = new anchor.BN(30)
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('mint'), provider.wallet.publicKey.toBuffer()],
      program.programId,
    )

    const receiver = Keypair.generate().publicKey

    const srcTokenAccount = await anchor.utils.token.associatedAddress({
      mint,
      owner: provider.wallet.publicKey,
    })
    const dstTokenAccount = await anchor.utils.token.associatedAddress({
      mint,
      owner: receiver,
    })

    // Add your test here.
    const tx = await program.methods
      .transfer(amount)
      .accounts({
        user: provider.wallet.publicKey,
        receiver,
        mint,
        srcTokenAccount,
        dstTokenAccount,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc()
    console.log('Your transaction signature', tx)

    const srcTokenAccountData = await splProgram.account.token.fetch(
      srcTokenAccount,
    )
    console.log('srcTokenAccount', srcTokenAccountData.amount.toNumber())

    const dstTokenAccountData = await splProgram.account.token.fetch(
      dstTokenAccount,
    )
    console.log('dstTokenAccountData', dstTokenAccountData.amount.toNumber())
  })
})
