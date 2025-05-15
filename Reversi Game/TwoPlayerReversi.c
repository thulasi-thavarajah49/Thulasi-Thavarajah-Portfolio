#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#define UNOCCUPIED 'U'
#define BLACK 'B'
#define WHITE 'W'

// initializes board with 2 white and 2 black pieces in the middle
void initializeBoard(char board[][26], int n) {
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      board[i][j] = UNOCCUPIED;
    }
  }

  // finds the middle of the board and places 2 black pieces and 2 white pieces
  board[(n / 2) - 1][(n / 2) - 1] = WHITE;
  board[(n / 2)][(n / 2)] = WHITE;
  board[(n / 2)][(n / 2) - 1] = BLACK;
  board[(n / 2) - 1][(n / 2)] = BLACK;
}

// prints board and corresponding column and row letters
void printBoard(char board[][26], int n) {

  // store alphabet in an array
  char alphabet[26] = "abcdefghijklmnopqrstuvwxyz";
  printf("  ");

  // print column letters
  for (int i = 0; i < n; i++) {
    printf("%c", alphabet[i]);
  }

  // print each row, column and corresponding row letter
  printf("\n");
  for (int i = 0; i < n; i++) {
    printf("%c ", alphabet[i]);
    for (int j = 0; j < n; j++) {
      printf("%c", board[i][j]);
    }
    printf("\n");
  }
}

// configure board based on player input
void configureBoard(char board[][26]) {

  // take in player, row and column inputs to configure board
  printf("Enter board configuration:\n");
  char player, row, col;
  int i, j;
  scanf(" %c%c%c", &player, &row, &col);

  // until the user enter !!!, keep taking in inputs and changing the board
  while (player != '!' && row != '!' && col != '!') {
    i = row - 'a';
    j = col - 'a';
    if (player == BLACK) {
      board[i][j] = BLACK;
    } else if (player == WHITE) {
      board[i][j] = WHITE;
    }
    scanf(" %c%c%c", &player, &row, &col);
  }
}

// check if a given position is within the bounds of the board
bool positionInBounds(int n, int row, int col) {
  bool isInBound = true;
  if (row < 0 || row >= n || col < 0 || col >= n) {
    isInBound = false;
  }
  return isInBound;
}

// check if a given position is valid if it is unoccupied
bool validPosition(char board[][26], int row, int col) {
  if (board[row][col] == UNOCCUPIED) {
    return true;
  } else {
    return false;
  }
}

// check if there is a legal move in a given direction
bool checkLegalInDirection(char board[][26], int n, int row, int col,
                           char color, int deltaRow, int deltaCol) {

  // get indices of adjacent piece in that direction and the opposite colour of
  // the input colour
  int newRow = row + deltaRow;
  int newCol = col + deltaCol;
  char oppositeColor = (color == BLACK) ? WHITE : BLACK;

  // if adjacent piece is same colour, unoccupied or out-of-bounds, then the
  // move is not legal
  if (board[newRow][newCol] == color || board[newRow][newCol] == UNOCCUPIED ||
      !positionInBounds(n, newRow, newCol)) {
    return false;
  }

  // if true, keep checking in the given direction until edge of board is hit,
  // or hit unoccupied piece or flanking piece found
  while (positionInBounds(n, newRow, newCol) &&
         board[newRow][newCol] == oppositeColor &&
         board[newRow][newCol] != UNOCCUPIED) {
    newRow += deltaRow;
    newCol += deltaCol;
  }

  // if edge of board hit, then not a legal move
  if (!positionInBounds(n, newRow, newCol)) {
    return false;
  }

  // if unoccupied piece hit, then not a legal move
  if (board[newRow][newCol] == UNOCCUPIED) {
    return false;
  }

  // if own colour hit, then legal move
  if (board[newRow][newCol] == color) {
    return true;
  }
}

// call checkLegalInDirection 8 times to check if a specific position has legal
// moves avaliable
bool checkLegalInAnyDirection(char board[][26], int n, int row, int col,
                              char color) {
  bool legalMovePossible = false;

  //check if the position is in bounds
  if (!positionInBounds(n, row, col)) {
    return false;
  }

  if (checkLegalInDirection(board, n, row, col, color, 1, 0)) {
    legalMovePossible = true;
  } else if (checkLegalInDirection(board, n, row, col, color, 0, 1)) {
    legalMovePossible = true;
  } else if (checkLegalInDirection(board, n, row, col, color, 1, 1)) {
    legalMovePossible = true;
  } else if (checkLegalInDirection(board, n, row, col, color, -1, -1)) {
    legalMovePossible = true;
  } else if (checkLegalInDirection(board, n, row, col, color, 0, -1)) {
    legalMovePossible = true;
  } else if (checkLegalInDirection(board, n, row, col, color, -1, 0)) {
    legalMovePossible = true;
  } else if (checkLegalInDirection(board, n, row, col, color, 1, -1)) {
    legalMovePossible = true;
  } else if (checkLegalInDirection(board, n, row, col, color, -1, 1)) {
    legalMovePossible = true;
  } else {
    legalMovePossible = false;
  }

  return legalMovePossible;
}

// cycle through the board, and if checkLegalInAnyDirection is true, then print
// the move
void printMoves(char board[][26], int n, char color) {
  printf("Available moves for %c:\n", color);
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      if (validPosition(board, i, j) &&
          checkLegalInAnyDirection(board, n, i, j, color)) {
        printf("%c%c\n", 97 + i, 97 + j);
      }
    }
  }
}

// flip tiles in all legal directions
void flipTiles(char board[][26], int n, char color, char row, char col) {
  int i = row - 'a';
  int j = col - 'a';
  board[i][j] = color;

  int newRow;
  int newCol;

  // store column and row directions as an array
  int rowDirections[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
  int colDirections[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

  // cycle through each direction
  for (int d = 0; d < 8; d++) {

    // if the move is legal in that direction, then walk in that direction
    if (checkLegalInDirection(board, n, i, j, color, rowDirections[d],
                              colDirections[d])) {
      newRow = i + rowDirections[d];
      newCol = j + colDirections[d];

      // while still in bounds and until own piece is hit, change the tiles to
      // the player colour
      while (positionInBounds(n, newRow, newCol) &&
             board[newRow][newCol] != color) {
        board[newRow][newCol] = color;
        newRow += rowDirections[d];
        newCol += colDirections[d];
      }
    }
  }
}

int main(void) {
  char board[26][26];
  int n;

  // take input board dimension
  printf("Enter the board dimension: ");
  scanf("%d", &n);

  // initialize the board and print the board
  initializeBoard(board, n);
  printBoard(board, n);

  // configure the board based on inputs and print the board
  configureBoard(board);
  printBoard(board, n);

  char player, row, col;

  // print the moves for each color
  printMoves(board, n, WHITE);
  printMoves(board, n, BLACK);

  // take in move input
  printf("Enter a move:\n");
  scanf(" %c%c%c", &player, &row, &col);

  // if move is legal and valid, then flip the tiles and then print the board

  // check if it is in-bounds before os

  if (checkLegalInAnyDirection(board, n, row - 'a', col - 'a', player)) {
    printf("Valid move.\n");
    flipTiles(board, n, player, row, col);
  } else {
    printf("Invalid move.\n");
  }

  printBoard(board, n);
  return 0;
}
