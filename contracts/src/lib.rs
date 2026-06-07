#![no_std]

use soroban_sdk::{contract, contracterror, contractimpl, contracttype, token, Address, Env};

#[contracttype]
#[derive(Clone)]
pub struct Escrow {
    pub depositor: Address,
    pub beneficiary: Address,
    pub token: Address,
    pub amount: i128,
    pub released: bool,
    pub refunded: bool,
}

#[contracttype]
enum DataKey {
    Escrow(u64),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum EscrowError {
    AlreadyExists = 1,
    NotFound = 2,
    AlreadyResolved = 3,
    InvalidAmount = 4,
}

#[contract]
pub struct PalEscrow;

#[contractimpl]
impl PalEscrow {
    /// Locks `amount` of `token` from `depositor`, held for `beneficiary` until
    /// released or refunded by the depositor.
    pub fn create(
        env: Env,
        id: u64,
        depositor: Address,
        beneficiary: Address,
        token: Address,
        amount: i128,
    ) -> Result<(), EscrowError> {
        if amount <= 0 {
            return Err(EscrowError::InvalidAmount);
        }

        let key = DataKey::Escrow(id);

        if env.storage().persistent().has(&key) {
            return Err(EscrowError::AlreadyExists);
        }

        depositor.require_auth();

        token::Client::new(&env, &token).transfer(
            &depositor,
            &env.current_contract_address(),
            &amount,
        );

        env.storage().persistent().set(
            &key,
            &Escrow {
                depositor,
                beneficiary,
                token,
                amount,
                released: false,
                refunded: false,
            },
        );

        Ok(())
    }

    /// Releases the escrowed funds to the beneficiary. Only the depositor can
    /// authorize this.
    pub fn release(env: Env, id: u64) -> Result<(), EscrowError> {
        let key = DataKey::Escrow(id);
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(EscrowError::NotFound)?;

        if escrow.released || escrow.refunded {
            return Err(EscrowError::AlreadyResolved);
        }

        escrow.depositor.require_auth();

        token::Client::new(&env, &escrow.token).transfer(
            &env.current_contract_address(),
            &escrow.beneficiary,
            &escrow.amount,
        );

        escrow.released = true;
        env.storage().persistent().set(&key, &escrow);

        Ok(())
    }

    /// Refunds the escrowed funds back to the depositor before release.
    pub fn refund(env: Env, id: u64) -> Result<(), EscrowError> {
        let key = DataKey::Escrow(id);
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(EscrowError::NotFound)?;

        if escrow.released || escrow.refunded {
            return Err(EscrowError::AlreadyResolved);
        }

        escrow.depositor.require_auth();

        token::Client::new(&env, &escrow.token).transfer(
            &env.current_contract_address(),
            &escrow.depositor,
            &escrow.amount,
        );

        escrow.refunded = true;
        env.storage().persistent().set(&key, &escrow);

        Ok(())
    }

    pub fn get_escrow(env: Env, id: u64) -> Result<Escrow, EscrowError> {
        env.storage()
            .persistent()
            .get(&DataKey::Escrow(id))
            .ok_or(EscrowError::NotFound)
    }
}

#[cfg(test)]
mod test;
