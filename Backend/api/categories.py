from fastapi import APIRouter
from pydantic import BaseModel

from Backend.DataBase.category import (get_categories, get_category, add_category, update_category, delete_category)
from Backend.Logic.category import Category

router = APIRouter()

class CategoryRequest(BaseModel):
    name: str
    type: str


@router.get("/categories")
def read_categories():
    return get_categories()


@router.get("/categories/{id}")
def read_category(id: int):
    return get_category(id)


@router.post("/categories")
def save_category(data: CategoryRequest):
    category = Category(data.name, data.type)
    return add_category(category)


@router.put("/categories/{id}")
def edit_category(id: int, data: CategoryRequest):
    category = Category(data.name, data.type, id)
    update_category(category)
    return category.id


@router.delete("/categories/{id}")
def remove_category(id: int):
    category = Category("", "", id)
    delete_category(category)
    return {"message": "Category deleted"}