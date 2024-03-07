import pandas as pd
from tqdm import tqdm

def load_puzzles():
    return pd.concat([chunk for chunk in tqdm(pd.read_csv("lichess_db_puzzle.csv.zst", chunksize=250000), desc='Loading puzzles', total=15)])

def export_sample(df, difficulty):
    random_puzzles = df[["PuzzleId", "FEN", "Moves"]].sample(n=100)
    random_puzzles.to_json(f'../my-app/src/data/chess-puzzles-{difficulty}.json', orient='records')

if __name__ == "__main__":
    df = load_puzzles()

    puzzle_themes = df["Themes"].str.contains("mateIn1")
    
    easy_df = df[puzzle_themes & (df["Rating"] < 1000)]
    medium_df = df[puzzle_themes & (df["Rating"] >= 1000) & (df["Rating"] < 2000)]
    hard_df = df[puzzle_themes & (df["Rating"] >= 2000)]
    
    export_sample(easy_df, "easy")
    export_sample(medium_df, "medium")
    export_sample(hard_df, "hard")