from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from Backend.DataBase.transactions import get_transaction, get_transactions, add_transaction, update_transaction, delete_transaction
from Backend.Logic.transactions import Transaction

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
    transaction = Transaction(data.account_id, data.amount, data.type, data.category_id, data.date, data.description)
    return add_transaction(transaction)