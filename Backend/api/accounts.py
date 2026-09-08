from fastapi import APIRouter, Cookie
from pydantic import BaseModel
from Backend.DataBase.account import (
    get_accounts,
    save_account,
    update_account,
    delete_account
)

from Backend.Logic.account import Account
from Backend.Auth.auth import get_current_user


router = APIRouter()


class AccountRequest(BaseModel):
    name: str
    type: str
    currency: str
    balance: float


@router.get("/accounts")
def read_accounts(
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    return get_accounts(user_id)


@router.post("/accounts")
def remember_account(
    account: AccountRequest,
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    new_account = Account(
        account.name,
        account.type,
        account.currency,
        account.balance
    )
    save_account(new_account, user_id)
    return new_account


@router.put("/accounts/{id}")
def edit_account(
    id: int,
    account: AccountRequest,
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    updated_account = Account(
        account.name,
        account.type,
        account.currency,
        account.balance,
        id
    )
    update_account(updated_account, user_id)
    return updated_account


@router.delete("/accounts/{id}")
def remove_account(
    id: int,
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    account = Account(
        "",
        "",
        "",
        0,
        id
    )
    delete_account(account, user_id)
    return {
        "message": "Account deleted"
    }