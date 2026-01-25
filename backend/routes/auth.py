from fastapi import APIRouter
from backend.database import users_collection

router = APIRouter(prefix="/auth")

@router.get("/test")
def test_auth():
    return {"status": "auth route working"}

@router.get("/mongo-test")
def mongo_test():
    users_collection.insert_one({"test": "working"})
    return {"status": "MongoDB connected"}
