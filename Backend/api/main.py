from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from Backend.DataBase.account import get_accounts, save_account, update_account, delete_account
from Backend.models.account import Account

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"])

class AccountRequest(BaseModel):
    name: str
    type: str
    currency: str
    balance: int

@app.get("/accounts")
def read_accounts():
    return get_accounts()

@app.post("/accounts")
def remember_account(account: AccountRequest):
    account = Account(account.name, account.type, account.currency, account.balance)
    return save_account(account)

@app.put("/accounts/{id}")
def edit_account(id: int, account: AccountRequest):
    account = Account(account.name, account.type, account.currency, account.balance, id)
    return update_account(account)

@app.delete("/accounts/{id}")
def remove_account(id: int):
    account = Account("", "", "", 0, id)
    delete_account(account)