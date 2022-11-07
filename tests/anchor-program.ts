import * as anchor from '@project-serum/anchor'
import { AnchorProgram } from '../target/types/anchor_program'

describe('anchor-program', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace
    .AnchorProgram as anchor.Program<AnchorProgram>

  it('Is initialized!', async () => {
    const amount = new anchor.BN(100)
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from('mint'),
        provider.wallet.publicKey.toBuffer(),
        amount.toArrayLike(Buffer, 'le', 8),
      ],
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
  })
})
