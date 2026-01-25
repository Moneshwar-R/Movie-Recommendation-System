from fastapi import APIRouter

router = APIRouter(prefix="/user")

@router.get("/profile")
def get_profile():
    return {"message": "User profile"}
