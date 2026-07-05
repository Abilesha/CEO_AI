"""
backend/api/auth.py — Simple demo auth (no Supabase keys needed)
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

DEMO_USERS = {
    "subasree8606@gmail.com": {"password": "12345678", "name": "Subasree", "role": "admin"},
}


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    email: str
    full_name: str
    role: str


@router.post("/login", response_model=LoginResponse, summary="Login")
async def login(body: LoginRequest):
    """Authenticate and return a session token."""
    user = DEMO_USERS.get(body.email.lower().strip())
    if not user or user["password"] != body.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return LoginResponse(
        access_token="demo-token-" + body.email,
        token_type="bearer",
        user_id="demo-id",
        email=body.email,
        full_name=user["name"],
        role=user["role"],
    )


@router.post("/logout", summary="Logout")
async def logout():
    return {"message": "Logged out successfully"}


@router.get("/me", summary="Get current user")
async def me():
    return {
        "id": "demo-id",
        "email": "subasree8606@gmail.com",
        "full_name": "Subasree",
        "role": "admin",
    }
