.PHONY: puzzles
puzzles:
	cd chess-data && poetry run python ./chess-puzzles.py
