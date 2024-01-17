# Slidoku
Playing with Sudoku

Work in progress, not ready for consumption.

An interactive puzzle.

The idea is to combine a sliding-block puzzle gave with a sudoku, so the solution can only be arrived at by sliding a single, empty, cell around the board.

The board starts with a sudoku puzzle, which has a number of locked cells from which a unique solution can be reached, using solution techniques up to and including tuples, but nothing more complex. All other cells have numbers randomly assigned from the remaining numbers in the solution - there are known to be N sets of N numbers in an NxN puzzle. One cell is identified as the empty cell. The empty cell can be interactively swapped with one of it's neighbouring cells. When a number "lands" on a cell that has that number in the final solution, it is visually differentiated.

At time of writing, the code is focused on the generation of valid puzzles.
