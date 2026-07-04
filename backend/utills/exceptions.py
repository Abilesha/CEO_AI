from fastapi import HTTPException


def bad_request(message: str):
    raise HTTPException(
        status_code=400,
        detail=message
    )


def not_found(message: str):
    raise HTTPException(
        status_code=404,
        detail=message
    )