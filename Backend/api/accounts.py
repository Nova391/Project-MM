from fastapi import APIRouter
from pydantic import BaseModel

from Backend.DataBase.account import get_accounts, save_account, update_account, delete_account
from Backend.Logic.account import Account

router = APIRouter()

class AccountRequest(BaseModel):
    name: str
    type: str
    currency: str
    balance: float

@router.get("/accounts")
def read_accounts():
    return get_accounts()

@router.post("/accounts")
def remember_account(account: AccountRequest):
    account = Account(
        account.name,
        account.type,
        account.currency,
        account.balance
    )
    return save_account(account)

@router.put("/accounts/{id}")
def edit_account(id: int, account: AccountRequest):
    account = Account(
        account.name,
        account.type,
        account.currency,
        account.balance,
        id
    )

    return update_account(account)

@router.delete("/accounts/{id}")
def remove_account(id: int):
    account = Account("", "", "", 0, id)
    delete_account(account)