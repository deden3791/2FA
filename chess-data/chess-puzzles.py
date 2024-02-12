import pandas as pd
from tqdm import tqdm

def load_puzzles():
    return pd.concat([chunk for chunk in tqdm(pd.read_csv("lichess_db_puzzle.csv.zst", chunksize=250000), desc='Loading puzzles', total=15)])

def export_sample(df):
    random_puzzles = df[["PuzzleId", "FEN", "Moves"]].sample(n=20)
    random_puzzles.to_json('../my-app/src/data/chess-puzzles.json', orient='records')

if __name__ == "__main__":
    df = load_puzzles()
    mate_df = df[df["Themes"].str.contains("mateIn1")]
    export_sample(mate_df)