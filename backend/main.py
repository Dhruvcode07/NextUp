import os
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# --- Database Setup ---
# FIXED LINE BELOW: Checks for Cloud Database first
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://qms_user:securepassword@postgres_db/qms_db")

# Handle the specific case where Render gives a "postgres://" URL but SQLAlchemy needs "postgresql://"
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Models ---
class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True)

class Token(Base):
    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, index=True)
    service_id = Column(Integer)
    status = Column(String, default="pending") # pending, serving, completed
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# --- App & CORS ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class ServiceCreate(BaseModel):
    name: str
    code: str

class TokenCreate(BaseModel):
    service_id: int

# --- Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

# 1. Create Department
@app.post("/services/")
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = Service(name=service.name, code=service.code)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

# 2. Get All Departments
@app.get("/services/")
def read_services(db: Session = Depends(get_db)):
    return db.query(Service).all()

# 3. Issue a Token (Kiosk)
@app.post("/issue-token/")
def issue_token(token_data: TokenCreate, db: Session = Depends(get_db)):
    # Get service code (e.g., "A")
    service = db.query(Service).filter(Service.id == token_data.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Count tickets for this service today to generate number (A-001)
    count = db.query(Token).filter(Token.service_id == token_data.service_id).count()
    token_number = f"{service.code}-{count + 1:03d}"
    
    new_token = Token(number=token_number, service_id=token_data.service_id, status="pending")
    db.add(new_token)
    db.commit()
    db.refresh(new_token)
    return new_token

# 4. Get Queue Status (Staff Dashboard)
@app.get("/queue/")
def get_queue(db: Session = Depends(get_db)):
    # Return all tokens that are NOT completed
    return db.query(Token).filter(Token.status != "completed").order_by(Token.id).all()

# 5. Update Token Status (Call Next / Complete)
@app.put("/tokens/{token_id}/update")
def update_token(token_id: int, status: str, db: Session = Depends(get_db)):
    token = db.query(Token).filter(Token.id == token_id).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    
    token.status = status
    db.commit()
    return {"message": "Status updated"}