from datetime import datetime
class Account:
    def __init__(self, name, account_type, currency, balance=0, account_id=None):
        self.name = name
        self.type = account_type
        self.balance = balance
        self.currency = currency
        self.id = account_id
        self.transactions = []

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount

            transaction = Transaction(
                amount=amount,
                transaction_type="Deposit",
                date=datetime.now()
            )

            self.transactions.append(transaction)
            return True

        return False

    def withdraw(self, amount):
        if 0 < amount <= self.balance:
            self.balance -= amount

            transaction = Transaction(
                amount=amount,
                transaction_type="Withdrawal",
                date=datetime.now()
            )

            self.transactions.append(transaction)
            return True

        return False

    def get_balance(self):
        return self.balance

    def get_transactions(self):
        return self.transactions
