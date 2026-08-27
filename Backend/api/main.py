from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Backend.api import accounts
from Backend.api import transactions
from Backend.api import categories

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(categories.router)