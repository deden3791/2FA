.PHONY: puzzles
puzzles:
	cd chess-data && poetry run python ./chess-puzzles.py

.PHONY: app
app:
	cd my-app && npm start
