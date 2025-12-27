from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    ForeignKey, func, Numeric
)
from sqlalchemy.orm import relationship
from app.core.db_init import Base


class UserTable(Base): #User -> Order -> Payments
    __tablename__ = "users"

    id = Column(Integer, primary_key=True ,autoincrement=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, nullable=False, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    orders = relationship(
        "OrderTable",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    payments = relationship("PaymentTable", back_populates="user")


class ProductTable(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, nullable=False)
    image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    is_active = Column(Boolean, default=True)


class OrdersItemTable(Base):
    __tablename__ = "orders_items"
    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)

    order = relationship("OrderTable", back_populates="items")
    product = relationship("ProductTable")


class OrderTable(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("UserTable", back_populates="orders")
    items = relationship("OrdersItemTable", back_populates="order")
    payment = relationship(
        "PaymentTable",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan"
    )


class PaymentTable(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    pay_amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("UserTable", back_populates="payments")
    order = relationship("OrderTable", back_populates="payment")