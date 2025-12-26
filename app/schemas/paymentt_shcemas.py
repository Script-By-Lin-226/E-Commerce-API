from pydantic import BaseModel
from typing import Literal

class Payment(BaseModel):
    paid_amount: float
    order_id: int
    payment_method: Literal["cash", "kbz", "aya"] = "cash"