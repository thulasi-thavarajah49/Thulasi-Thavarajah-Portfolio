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
bool unoccupiedPosition(char board[][26], int row, int col) {
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
  return false;
}

// call checkLegalInDirection 8 times to check if a specific position has legal
// moves avaliable
bool checkLegalInAnyDirection(char board[][26], int n, int row, int col,
                              char color) {
  bool legalMovePossible = false;

  // check if the position is in bounds
  if (!positionInBounds(n, row, col) || !unoccupiedPosition(board, row, col)) {
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
      if (unoccupiedPosition(board, i, j) &&
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

int countOpponentTilesFlippedInDirection(char board[][26], int n, int row,
                                         int col, char computerColor,
                                         int deltaRow, int deltaCol) {
  int opponentTilesFlipped = 0;

  // walk in the input direction
  int newRow = row + deltaRow;
  int newCol = col + deltaCol;

  char opponentColor = (computerColor == BLACK) ? WHITE : BLACK;

  // while the piece is the opponent colour and the position is in bounds, walk
  // in that direction and count the tiles
  while (board[newRow][newCol] == opponentColor &&
         positionInBounds(n, newCol, newCol)) {
    opponentTilesFlipped++;
    newRow += deltaRow;
    newCol += deltaCol;
  }

  return opponentTilesFlipped;
}

int makeMove(const char board[][26], int n, char turn, int *row, int *col) {

  // initialize the best row, column, and corresponding score
  int bestRow = -1, bestCol = -1;
  int bestScore = -1;

  // store the row corners and column corners
  int rowCorners[] = {0, 0, n - 1, n - 1};
  int columnCorners[] = {0, n - 1, 0, n - 1};

  // initialize row and column directions
  int rowDirections[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
  int colDirections[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

  // cycle through the entire board
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {

      // check if a move is legal in any direction
      if (checkLegalInAnyDirection(board, n, i, j, turn)) {

        // if it is legal, then set the current score to 0
        int currentScore = 0;
        int directionsFlipped=0;

        // cycle through each direction
        for (int d = 0; d < 8; d++) {

          // if it is legal in that direction, then count the flipped tiles
          if (checkLegalInDirection(board, n, i, j, turn, rowDirections[d],
                                    colDirections[d])) {
            currentScore += countOpponentTilesFlippedInDirection(
                board, n, i, j, turn, rowDirections[d], colDirections[d]);
                directionsFlipped++;
          }
        }

        // if the move is in the corner, immediately choose it
        for (int t = 0; t < 4; t++) {
          if (i == rowCorners[t] && j == columnCorners[t]) {
            *row = i;
            *col = j;
            return 0; // return as the best move
          }
        }

        // if the move is on an edge, then adjust the score
        if (i == 0 || i == n - 1 || j == 0 || j == n - 1) {
          currentScore += 2;
        }

        //if the move makes the pieces more compact, it prevents opponent from cutting in
        if(directionsFlipped>2){
          currentScore +=3;
        }

        // choose the best move based on its score (accounts for edge moves and moves that optimize compactness)
        if (currentScore > bestScore ||
            (currentScore == bestScore &&
             (i < bestRow || (i == bestRow && j < bestCol)))) {
          bestScore = currentScore;
          bestRow = i;
          bestCol = j;
        }
      }
    }
  }

  // assign the best move
  *row = bestRow;
  *col = bestCol;

  return 0;
}

// function to check if board is full
bool isBoardFull(char board[26][26], int n) {

  // loop through every cell to check if it EMPTY
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {

      // if a cell is empty, then the board must not be full
      if (board[i][j] == UNOCCUPIED) {
        return false;
        // return that the board is not full
      }
    }
  }

  // if no return false, then board must be full
  return true;
}

// function to check if input move is valid
bool isMoveValid(char board[][26], int n, char row, char col, char colour) {
  int i = row - 'a';
  int j = col - 'a';

  // check if position is in bounds and unoccupied
  if (!positionInBounds(n, i, j) || board[i][j] != UNOCCUPIED) {
    return false;
  }

  // check if move is legal in any direction
  return checkLegalInAnyDirection(board, n, i, j, colour);
}

// function to check if there is a legal move available for a color
bool legalMoveAvailable(char board[26][26], char colour, int n) {
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      if (unoccupiedPosition(board, i, j) &&
          checkLegalInAnyDirection(board, n, i, j, colour)) {
        return true;
      }
    }
  }

  return false;
}

//function that switches the turns 
void switchTurn(char *turn) {
  // if the value at the pointer is B, then the new turn is W
  if (*turn == BLACK) {
    *turn = WHITE;

    // if the value at the pointer is W, then the new turn is B
  } else if (*turn == WHITE) {
    *turn = BLACK;
  }
}

//function that counts the pieces on the board and declares the winner 
void getWinner(char board[][26], int n){
  int blackPieces=0;
  int whitePieces=0;

  //cycle through the board and count black and white pieces 
  for (int i=0;i<n;i++){
    for (int j=0;j<n;j++){
      if(board[i][j]==BLACK){
        blackPieces++;
      }else if(board[i][j]==WHITE){
        whitePieces++;
      }
    }
  }

  //declare winner based on number of pieces 
  if(blackPieces>whitePieces){
    printf("B player wins.\n");
  }else if(whitePieces>blackPieces){
    printf("W player wins.\n");
  }
}

//int main(void) {
  //char board[26][26];
  //int n;

  //char computerColour;

  // take input board dimension
  //printf("Enter the board dimension: ");
  //scanf("%d", &n);

  // take in computer colour
  //printf("Computer plays (B/W) : ");
  //scanf(" %c", &computerColour);

  // initialize board and player turns
  //char userColour = (computerColour == BLACK) ? WHITE : BLACK;
  //initializeBoard(board, n);
  //printBoard(board, n);

  //char playerTurn;
  //if (computerColour == BLACK) {
    //playerTurn = computerColour;
  //} else if (userColour == BLACK) {
   // playerTurn = userColour;
  //}

  // game occurs when board is not full, and while either move has a valid move

  //while (!isBoardFull(board, n) && (legalMoveAvailable(board, computerColour, n) ||legalMoveAvailable(board, userColour, n))) {
    //if (playerTurn == computerColour) {
      //if (legalMoveAvailable(board, computerColour, n)) {
        //int *row, *col;
        //makeMove(board, n, computerColour, row, col);
        //flipTiles(board, n, computerColour, *row, *col);
        //printBoard(board, n);
      //} else if (!legalMoveAvailable(board, computerColour, n)) {
        //printf("%c player has no valid move.\n", computerColour);
     // }
   // } else if (playerTurn == userColour) {
    //  if (legalMoveAvailable(board, userColour, n)) {
    //    char userRow, userCol;
     //   printf("Enter move for colour %c (RowCol): ", userColour);
     //   scanf(" %c%c", &userRow, &userCol);
     //   if (checkLegalInAnyDirection(board, n, userRow - 'a', userCol - 'a', userColour)) {
     //     flipTiles(board, n, userColour, userRow, userCol);
      //    printBoard(board, n);
      //  } else if (!checkLegalInAnyDirection(board, n, userRow - 'a', userCol - 'a', userColour)) {
      //    printf("Invalid move.\n");
       //   break;}
     // } else if (!legalMoveAvailable(board, userColour, n)) {
     //   printf("%c player has no valid move. \n", userColour);
    //  }
   // }
  //  switchTurn(&playerTurn);
// }

 // getWinner(board, n);
 // return 0;
//}