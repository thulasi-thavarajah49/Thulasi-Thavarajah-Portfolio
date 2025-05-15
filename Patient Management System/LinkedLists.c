#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// create a node data structure and create alias for node as patient
typedef struct node {
  int ID;
  char name[101];
  int severity;
  struct node *nextPatient; // pointer to next node
} patient;

// create the queue that stores the most urgent patient
typedef struct list{
  patient *headPatient;
} queue;

bool patientAlreadyExists(queue *pQueue, int ID) {

  // initialize pointer to the head patient
  patient *currentPatient = pQueue->headPatient;

  // cycle through the linked list
  while (currentPatient != NULL) {

    // if the current patient's ID is the same as the input ID
    if (currentPatient->ID == ID) {
      return true;
    }

    // make the new current patient the next patient of the current patient
    currentPatient = currentPatient->nextPatient;
  }
  return false;
}

// function to add patient - (create and insert node)
void addPatient(queue *pQueue, int ID, char name[101], int severity) {

  // if patient exists, then print an error
  if (patientAlreadyExists(pQueue, ID)) {
    printf("Error: Patient %d already exists.\n", ID);
    return;
  }

  patient *newPatient =
      (patient *)malloc(sizeof(patient)); // allocate memory for new patient

  // if enough memory space, then create a new patient
  if (newPatient != NULL) {
    newPatient->ID = ID; //(*newPatient).ID = ID;
    strcpy(newPatient->name, name);
    newPatient->severity = severity;
    newPatient->nextPatient = NULL; // link to smtg soon
  }

  // insert patient at the front of the queue if the head patient's severity is
  // less, than make this patient the new head patient
  if (pQueue->headPatient == NULL || pQueue->headPatient->severity < severity) {
    newPatient->nextPatient =
        pQueue->headPatient; // link the old head patient to the new patient
    pQueue->headPatient =
        newPatient; // replace the head patient with the new patient
  } else // if patient is an intermediate severity, insert them in between
         // patients

  {
    patient *currentPatient =
        pQueue->headPatient; // pointer to current patient should point to head
                             // patient

    // while there is a next patient for the current patient, and that patient
    // is equal or more sever than the new patient, keep cycling through the
    // list

    while ((currentPatient->nextPatient) &&
           (currentPatient->nextPatient->severity >= severity)) {
      currentPatient =
          currentPatient->nextPatient; // the new current patient is the next
                                       // patient of the old current patient
    }

    // once patient less severe or end of the list is found, insert the patient
    newPatient->nextPatient =
        currentPatient->nextPatient; // the new patient's next patient is the
                                     // current patient's next patient
    currentPatient->nextPatient =
        newPatient; // the current patient's new next patient is the new patient
  }

  printf("Patient %d Added.\n", ID);
}

// function to treat patient - (delete first node)
void treatPatient(queue *pQueue) {

  // if there is no head patient, then the list is empty
  if (pQueue->headPatient == NULL) {
    printf("Queue is empty.\n");
    return; // immediately return
  }

  // if there is a head patient, then remove the head patient, and make the
  // new head patient the next patient of the current head patient
  else if (pQueue->headPatient) {
    patient *currentPatient =
        pQueue->headPatient; // store the current first patient
    pQueue->headPatient =
        currentPatient->nextPatient; // make the head patient the next patient
                                     // of the current first patient

    printf("Patient %d Treated.\n", currentPatient->ID);
    free(currentPatient); // free the memory of the current head patient
  }
}

// function to remove patient - (find specific node and delete node)

void removePatient(queue *pQueue, int ID) {

  // if there is no list, then patient cannot be found
  if (pQueue->headPatient == NULL) {
    printf("Error: Patient %d not found.\n", ID);
    return;
  }

  // store the head patient as the current patient, and the initialize a
  // preceding patient
  patient *currentPatient = pQueue->headPatient;
  patient *previousPatient = NULL;

  // check head patient
  if (currentPatient->ID == ID) {

    // if the current patient's ID is the input ID, then make the head patient's
    // next patient the head patient
    pQueue->headPatient = currentPatient->nextPatient;

    printf("Patient %d Removed.\n", ID);
    free(currentPatient); // free the head patient's memory
    return;
  }

  // otherwise, cycle through the entire list until ID found, or end found
  while ((currentPatient != NULL) && (currentPatient->ID != ID)) {
    previousPatient =
        currentPatient; // make the current patient the previous patient
    currentPatient = currentPatient->nextPatient; // get the next patient
  }

  // otherwise, if end of list is reached, then print error
  if (currentPatient == NULL) {
    printf("Error: Patient %d not found.\n", ID);
    return;
  }

  // if the current patient's ID is a match, then remove the patient
  else if (currentPatient->ID == ID) {
    previousPatient->nextPatient =
        currentPatient->nextPatient; // remove link between current patient and
                                     // succeeding patient
    printf("Patient %d Removed.\n", ID);
    free(currentPatient); // free the memory of the current patient
    return;
  }
}

// function to display queue - (display all nodes)
void displayQueue(queue *pQueue) {
  // if queue empty
  if (pQueue->headPatient == NULL) {
    printf("Queue is empty.\n");
    return;
  }

  patient *currentPatient = pQueue->headPatient;

  // print queue
  while (currentPatient != NULL) {
    printf("%s %d\n", currentPatient->name, currentPatient->severity);

    // move to the next patient
    currentPatient = currentPatient->nextPatient; 
  }
}

// function that ends program and frees all memory - (delete all nodes and free
// memory)

void endProgram(queue *pQueue) {

  // store current patient
  patient *currentPatient = pQueue->headPatient;

  // cycle through the list
  while (currentPatient != NULL) {
    patient *temp = currentPatient;
    currentPatient = currentPatient->nextPatient;
    free(temp);
  }

  //remove everyone in the queue
  pQueue->headPatient = NULL;
}

int main() {
  queue Queue = {NULL};
  char input;
  int ID, severity;
  char name[100];

  while (scanf(" %c", &input)) {
    if (input == 'A') {
      scanf("%d %s %d", &ID, name, &severity);
      addPatient(&Queue, ID, name, severity);
    } else if (input == 'T') {
      treatPatient(&Queue);
    } else if (input == 'R') {
      scanf("%d", &ID);
      removePatient(&Queue, ID);
    } else if (input == 'D') {
      displayQueue(&Queue);
    } else if (input == 'Q') {
      endProgram(&Queue);
      break;
    }
  }

  return 0;
}