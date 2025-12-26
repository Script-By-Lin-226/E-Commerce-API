from typing import Optional

from pydantic import BaseModel

class AddProductSchema(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    price: float
    stock: int

class ProductResponse(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    price: float
    stock: int
    class Config:
        orm_mode = True

