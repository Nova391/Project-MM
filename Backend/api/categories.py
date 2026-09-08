from fastapi import APIRouter, Cookie
from pydantic import BaseModel
from Backend.Auth.auth import get_current_user
from Backend.DataBase.category import (
    get_categories,
    get_category,
    add_category,
    update_category,
    delete_category
)
from Backend.Logic.category import Category

router = APIRouter()


class CategoryRequest(BaseModel):
    name: str
    type: str


@router.get("/categories")
def read_categories(
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    return get_categories(user_id)


@router.get("/categories/{id}")
def read_category(
    id: int,
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    category = get_category(
        id,
        user_id
    )
    if not category:
        return {
            "error": "Category not found"
        }
    return category


@router.post("/categories")
def save_category(
    data: CategoryRequest,
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    category = Category(
        data.name,
        data.type
    )
    category_id = add_category(
        category,
        user_id
    )
    if category_id is None:
        return {
            "error": "Category already exists"
        }
    return {
        "message": "Category created successfully",
        "id": category_id
    }


@router.put("/categories/{id}")
def edit_category(
    id: int,
    data: CategoryRequest,
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    category = Category(
        data.name,
        data.type,
        id
    )
    updated = update_category(
        category,
        user_id
    )
    if not updated:
        return {
            "error": "Category not found"
        }
    return {
        "message": "Category updated successfully"
    }


@router.delete("/categories/{id}")
def remove_category(
    id: int,
    session: str | None = Cookie(default=None)
):
    user_id = get_current_user(session)
    category = Category(
        "",
        "",
        id
    )
    deleted = delete_category(
        category,
        user_id
    )
    if not deleted:
        return {
            "error": "Category not found"
        }
    return {
        "message": "Category deleted"
    }