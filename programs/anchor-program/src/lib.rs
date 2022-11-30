use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub mod instructions;
pub use instructions::*;

#[program]
pub mod anchor_program {
  use super::*;

  pub fn initialize_mint<'a, 'b, 'c, 'info>(
    ctx: Context<'a, 'b, 'c, 'info, InitializeMint<'info>>,
    amount: u64,
  ) -> Result<()> {
    initialize_mint::exec(ctx, amount)
  }

  pub fn transfer<'a, 'b, 'c, 'info>(
    ctx: Context<'a, 'b, 'c, 'info, Transfer<'info>>,
    amount: u64,
  ) -> Result<()> {
    transfer::exec(ctx, amount)
  }
}
