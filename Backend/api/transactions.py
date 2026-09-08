from fastapi import APIRouter, Cookie
from pydantic import BaseModel

from Backend.Auth.auth import get_current_user

from Backend.DataBase.transactions import (
    get_transaction,
    get_transactions,
    add_transaction,
    update_transaction,
    delete_transaction
)

from Backend.Logic.transactions import Transaction


router = APIRouter()


class TransactionRequest(BaseModel):
    account_id: int
    amount: float
    type: str
    category_id: int
    date: str
    description: str


@router.get("/transactions")
def read_transactions(
    session: str | None = Cookie(default=None)
):

    user_id = get_current_user(session)

    return get_transactions(user_id)


@router.get("/transactions/{id}")
def read_transaction(
    id: int,
    session: str | None = Cookie(default=None)
):

    user_id = get_current_user(session)

    transaction = get_transaction(
        id,
        user_id
    )

    if not transaction:
        return {
            "error": "Transaction not found"
        }

    return transaction


@router.post("/transactions")
def save_transaction(
    data: TransactionRequest,
    session: str | None = Cookie(default=None)
):

    user_id = get_current_user(session)

    transaction_type = data.type.capitalize()

    new_transaction = Transaction(
        data.account_id,
        data.amount,
        transaction_type,
        data.category_id,
        data.date,
        data.description
    )

    created, error = add_transaction(
        new_transaction,
        user_id
    )

    if not created:
        return {
            "error": error
        }

    return {
        "message": "Transaction created successfully",
        "id": new_transaction.id
    }


@router.put("/transactions/{id}")
def edit_transaction(
    id: int,
    data: TransactionRequest,
    session: str | None = Cookie(default=None)
):

    user_id = get_current_user(session)

    transaction_type = data.type.capitalize()

    updated_transaction = Transaction(
        data.account_id,
        data.amount,
        transaction_type,
        data.category_id,
        data.date,
        data.description,
        id
    )

    updated, error = update_transaction(
        updated_transaction,
        user_id
    )

    if not updated:
        return {
            "error": error
        }

    return {
        "message": "Transaction updated successfully"
    }


@router.delete("/transactions/{id}")
def remove_transaction(
    id: int,
    session: str | None = Cookie(default=None)
):

    user_id = get_current_user(session)

    deleted = delete_transaction(
        id,
        user_id
    )

    if not deleted:
        return {
            "error": "Transaction not found"
        }

    return {
        "message": "Transaction deleted successfully"
    }