from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Backend.api import accounts
from Backend.api import transactions
from Backend.api import categories
from Backend.api import auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(categories.router)
app.include_router(auth.router)