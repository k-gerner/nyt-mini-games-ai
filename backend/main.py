from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import List
import asyncio
import logging

import ai.spelling_bee as spelling_bee
from utils.read_word_list import load_words
from utils.data_store import common_word_list

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the word lists
    # spelling_bee.word_list = load_words('data/all_words.txt')
    # spelling_bee.word_list = load_words('data/common_words.txt')
    common_word_list[:] = load_words('data/common_words.txt') 
    logging.info("Word list loaded successfully.")
    yield
    # Clean up the word lists and release the resources
    common_word_list.clear()

app = FastAPI(lifespan=lifespan)
# app = FastAPI()

origins = [
    "http://localhost:3000",  # React dev server
]

# Allow frontend on localhost:3000 to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PuzzleInput(BaseModel):
    puzzle: str

@app.post("/api/solve")
async def solve_puzzle(input: PuzzleInput):
    # Replace with your AI logic
    # Simulating a delay for the AI processing
    await asyncio.sleep(2)
    return {"solution": f"Solved version of '{input.puzzle}'"}

class SpellingBeeInput(BaseModel):
    center_letter: str
    outer_letters: List[str]

@app.post("/api/spelling_bee")
async def solve_spelling_bee(input: SpellingBeeInput):
    """
    Solve the Spelling Bee puzzle with the provided center letter and outer letters.
    
    Args:
        input (SpellingBeeInput): The input data containing the center letter and outer letters.
        
    Returns:
        dict: A dictionary containing the list of valid words.
    """
    valid_words = spelling_bee.run(input.center_letter, set(input.outer_letters))
    return {"words": valid_words}