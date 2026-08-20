from Backend.models.account import Account
from Backend.DataBase.account import save_account, get_accounts, delete_all_accounts, update_account, delete_account

account1 = Account("Bank", "Checking", "ILS", 1000)

save_account(account1)

print(get_accounts())

account1.name = "Main Bank"

update_account(account1)

print(get_accounts())

delete_account(account1)

print(get_accounts())