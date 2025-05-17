// This is a program that allows two users to play Connect Four.

#include <stdbool.h>
#include <stdio.h>
#define ROWS 6
#define COLS 6
#define EMPTY '-'
#define RED 'R'
#define YELLOW 'Y'

// function that prints the current 6x6 board (but flips the rows)
void printBoard(char gameBoard[ROWS][COLS]) {

  // print each value of the board line by line
  for (int i = ROWS - 1; i > (-1); i--) {
    for (int j = 0; j < COLS; j++) {
      printf("%c", gameBoard[i][j]);
    }
    printf("\n");
  }
}

// function that switches the player turns
void switchTurn(char *turn) {

  // if the value at the pointer is R, then the new turn is Y
  if (*turn == RED) {
    *turn = YELLOW;

    // if the value at the pointer is Y, then the new turn is R
  } else if (*turn == YELLOW) {
    *turn = RED;
  }
}

// function that takes user input and returns a valid column number to place the
// piece in
int getInput(char gameBoard[ROWS][COLS], char turn) {
  int columnNumber;

  // based on the player turn, ask user to input a column number and only store
  // it if valid (column not full and within index bounds)
  if (turn == RED) {
    do {
      printf("Red, please enter a valid column number (0-5): ");
      scanf("%d", &columnNumber);
    } while (columnNumber > 5 || columnNumber < 0 ||
             gameBoard[ROWS - 1][columnNumber] != EMPTY);

  } else {
    do {
      printf("Yellow, please enter a valid column number (0-5): ");
      scanf("%d", &columnNumber);
    } while (columnNumber > 5 || columnNumber < 0 ||
             gameBoard[ROWS - 1][columnNumber] != EMPTY);
  }
  return columnNumber;
}

// function that takes the valid column number and inserts into the board by
// finding first empty cell in the column
void insertPiece(char gameBoard[ROWS][COLS], int columnEntered, char turn) {
  for (int i = 0; i < ROWS; i++) {
    if (gameBoard[i][columnEntered] == EMPTY) {
      gameBoard[i][columnEntered] = turn;
      break; // do not want pieces placed again and again
    }
  }
}

// function that checks if there is a four-in-a-row from a specific cell
bool checkOneDirection(char gameBoard[][COLS], int row, int col, int rowDir,
                       int colDir) {

  // assume no four-in-a-row
  bool isConnectFour = false;
  char currentPiece = gameBoard[row][col];

  // if cell is EMPTY, then no four-in-a-row
  if (currentPiece == EMPTY) {
    isConnectFour = false;
  }

  // current piece is the first piece in a four-in-a-row
  int inARow = 1;

  // complete three iterations in a row and column direction (excluding current
  // piece)
  for (int i = 1; i < 4; i++) {

    // if the row or column being checked is out of index bounds, then set
    // inARow to 0
    if (row + i * rowDir < 0 || col + i * colDir < 0 ||
        row + i * rowDir >= ROWS || col + i * colDir >= COLS) {
      inARow = 0;
    }

    // if the row and column being checked are equal to the current piece, then
    // increment inARow by 1
    if (gameBoard[row + i * rowDir][col + i * colDir] == currentPiece) {
      inARow++;
    }
  }

  // after 4 iterations, if inARow is equal to 4, that means there must be a
  // four-in-a-row
  if (inARow == 4) {
    isConnectFour = true;
  }
  return isConnectFour;
}

// by calling the checkOneDirection function, this function checks for a
// four-in-a-row in all directions from a specific cell
bool checkAllDirections(char gameboard[ROWS][COLS], int row, int col) {
  bool connectFour = false;

  // column four-in-a-row
  if (checkOneDirection(gameboard, row, col, 0, 1)) {
    connectFour = true;

    // row four-in-a-row
  } else if (checkOneDirection(gameboard, row, col, 1, 0)) {
    connectFour = true;

    // up-right-diagonal four-in-a-row
  } else if (checkOneDirection(gameboard, row, col, 1, 1)) {
    connectFour = true;

    // up-left-diagonal four-in-a-row
  } else if (checkOneDirection(gameboard, row, col, 1, (-1))) {
    connectFour = true;
  }

  return connectFour;
}

// function that calls checkAllDirections to check for a win from each cell in
// the array
bool checkWinner(char gameBoard[ROWS][COLS]) {
  // assume no winner
  bool isThereWinner = false;

  // loop through every row and column
  for (int i = 0; i < ROWS; i++) {
    for (int j = 0; j < COLS; j++) {
      // given that the cell is not EMPTY, check if there is a four-in-a-row
      // starting from this cell
      if (gameBoard[i][j] != EMPTY) {
        if (checkAllDirections(gameBoard, i, j)) {
          isThereWinner = true;
          break; // if winner is found, then end the loop
        }
      }
    }
  }

  return isThereWinner;
}

// function that checks if the board is full
bool isBoardFull(char gameBoard[ROWS][COLS]) {
  // assume board is full
  bool isBoardFull = true;

  // loop through every cell to check if it EMPTY
  for (int i = 0; i < ROWS; i++) {
    for (int j = 0; j < COLS; j++) {

      // if a cell is empty, then the board must not be full
      if (gameBoard[i][j] == EMPTY) {
        isBoardFull = false;
        break; // end the loop and return that the board is not full
      }
    }
  }

  return isBoardFull;
}

int main() {
  // define a 6x6 board and player turns
  char board[ROWS][COLS];

  // intialize first player as RED
  char playerTurn = RED;

  // define each value in the array as "-"
  for (int i = 0; i < ROWS; i++) {
    for (int j = 0; j < COLS; j++) {
      board[i][j] = EMPTY;
    }
  }

  // print the board, as for RED input and insert the piece into the board
  printBoard(board);
  int column;
  column = getInput(board, playerTurn);
  insertPiece(board, column, playerTurn);

  // check if there is a winner or if the board is full
  while (checkWinner(board) == false && isBoardFull(board) == false) {

    // if there is no winner and board has EMPTY cells, then switch turns and
    // continue gameplay
    switchTurn(&playerTurn);
    printBoard(board);
    column = getInput(board, playerTurn);
    insertPiece(board, column, playerTurn);
  }

  // once there is a winner or the board is full, check if there is a tie
  if (isBoardFull(board)) {
    printf("It's a tie\n");
    // if there is no tie and the current player is RED, declare RED as the
    // winner
  } else if (playerTurn == RED) {
    printf("Red wins!\n");
    // if there is no tie and the current player is YELLOW, declare YELLOW as
    // the winner
  } else if (playerTurn == YELLOW) {
    printf("Yellow wins!\n");
  }

  // print the final board
  printf("Final board: \n");
  printBoard(board);

  return 0;
}