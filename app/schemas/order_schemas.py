from typing import List

from pydantic import BaseModel

class OrderSchema(BaseModel):
    product_id: int
    quantity: int

class OrderCreateSchema(BaseModel):
    items: List[OrderSchema]