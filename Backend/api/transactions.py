from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from Backend.DataBase.transactions import get_transaction, get_transactions, add_transaction, update_transaction, delete_transaction
from Backend.Logic.transactions import Transaction
from Backend.DataBase.account import get_account_balance, update_balance

router = APIRouter()

class TransactionRequest(BaseModel):
    account_id: int
    amount: int
    type: str
    category_id: int
    date:str
    description: str

@router.get("/transactions")
def read_transactions():
    return get_transactions()

@router.post("/transactions")
def save_transaction(data: TransactionRequest):
    new_transaction = Transaction(data.account_id, data.amount, data.type, data.category_id, data.date, data.description)
    add_transaction(new_transaction)
    current_balance = get_account_balance(data.account_id)
    if data.type.lower() == "income":
        new_balance = current_balance + data.amount
    else:
        new_balance = current_balance - data.amount
    update_balance(data.account_id, new_balance)
    return {"message": "Transaction created successfully"}

@router.delete("/transactions/{id}")
def remove_transaction(id: int):
    delete_transaction(id)