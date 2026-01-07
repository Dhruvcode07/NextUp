from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import enum

class TokenStatus(str, enum.Enum):
    WAITING = "WAITING"
    CALLED = "CALLED"
    SERVING = "SERVING"
    COMPLETED = "COMPLETED"

class Service(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    code: str = Field(unique=True, index=True)
    sla_minutes: int = 10
    
    tokens: List["Token"] = Relationship(back_populates="service")

class Token(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    number: str
    priority: int = 3 # 1=VIP, 2=High, 3=Normal
    status: TokenStatus = Field(default=TokenStatus.WAITING)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    service_id: Optional[int] = Field(default=None, foreign_key="service.id")
    service: Optional[Service] = Relationship(back_populates="tokens")