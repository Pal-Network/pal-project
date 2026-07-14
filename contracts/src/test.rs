use crate::{EscrowError, PalEscrow, PalEscrowClient};
use soroban_sdk::{
    testutils::Address as _,
    token::{StellarAssetClient, TokenClient},
    Address, Env,
};

fn setup_token<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let contract_id = env.register_stellar_asset_contract(admin.clone());
    (
        TokenClient::new(env, &contract_id),
        StellarAssetClient::new(env, &contract_id),
    )
}

#[test]
fn create_then_release_pays_beneficiary() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let (token, token_admin) = setup_token(&env, &admin);
    token_admin.mint(&depositor, &1_000);

    let contract_id = env.register_contract(None, PalEscrow);
    let client = PalEscrowClient::new(&env, &contract_id);

    client.create(&1, &depositor, &beneficiary, &token.address, &500);

    assert_eq!(token.balance(&depositor), 500);
    assert_eq!(token.balance(&contract_id), 500);

    client.release(&1);

    assert_eq!(token.balance(&beneficiary), 500);
    assert_eq!(token.balance(&contract_id), 0);

    let escrow = client.get_escrow(&1);
    assert!(escrow.released);
    assert!(!escrow.refunded);
}

#[test]
fn create_then_refund_returns_depositor_funds() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let (token, token_admin) = setup_token(&env, &admin);
    token_admin.mint(&depositor, &1_000);

    let contract_id = env.register_contract(None, PalEscrow);
    let client = PalEscrowClient::new(&env, &contract_id);

    client.create(&1, &depositor, &beneficiary, &token.address, &500);
    client.refund(&1);

    assert_eq!(token.balance(&depositor), 1_000);
    assert_eq!(token.balance(&beneficiary), 0);

    let escrow = client.get_escrow(&1);
    assert!(escrow.refunded);
}

#[test]
fn cannot_resolve_twice() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let (token, token_admin) = setup_token(&env, &admin);
    token_admin.mint(&depositor, &1_000);

    let contract_id = env.register_contract(None, PalEscrow);
    let client = PalEscrowClient::new(&env, &contract_id);

    client.create(&1, &depositor, &beneficiary, &token.address, &500);
    client.release(&1);

    let result = client.try_release(&1);
    assert_eq!(result, Err(Ok(EscrowError::AlreadyResolved)));
}

#[test]
fn rejects_duplicate_escrow_id() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let depositor = Address::generate(&env);
    let beneficiary = Address::generate(&env);
    let (token, token_admin) = setup_token(&env, &admin);
    token_admin.mint(&depositor, &1_000);

    let contract_id = env.register_contract(None, PalEscrow);
    let client = PalEscrowClient::new(&env, &contract_id);

    client.create(&1, &depositor, &beneficiary, &token.address, &500);
    let result = client.try_create(&1, &depositor, &beneficiary, &token.address, &500);

    assert_eq!(result, Err(Ok(EscrowError::AlreadyExists)));
}
