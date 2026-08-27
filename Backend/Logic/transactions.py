class Transaction:
    def __init__(self, account_id, amount, type, category_id, date, description, transaction_id=None):
        self.id = transaction_id
        self.account_id = account_id
        self.amount = amount
        self.type = type
        self.category_id = category_id
        self.date = date
        self.description = description