#![no_std]

use soroban_sdk::{contract, contractimpl, Env, Symbol};

#[contract]
pub struct HelloWorld;

#[contractimpl]
impl HelloWorld {
    pub fn hello(env: Env) -> Symbol {
        Symbol::new(&env, "hello")
    }
}
