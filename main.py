from Logic.account import Account
from DataBase.database import save_account, get_accounts, delete_account, delete_all_accounts


def main():
    account = Account("Bank", "bank", 5000, "ILS")

    save_account(account)

    accounts = get_accounts()

    for account in accounts:
        print(account)


# if __name__ == "__main__":
#    main()

get_accounts()