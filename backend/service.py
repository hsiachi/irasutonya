from fastapi import FastAPI
from searcher import NeuralSearcher

app = FastAPI()

neural_searcher = NeuralSearcher()

@app.get("/api/search")
def search_startup(query: str, size: int):
    
    return neural_searcher.search(query, size)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    