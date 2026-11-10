/******************************************************************************

Scrivere un programma C che risolva il seguente problema.

 
Acquisire da tastiera due numeri naturali. 
Si consideri i naturali acquisiti come il dividendo ed il divisore di una divisione.
Visualizzare il quoziente intero ed il resto se il divisore è diverso da zero. 
Altrimenti visualizzare un messaggio di errore.
*******************************************************************************/
#include <stdio.h>

int main(void)
{
    int num1, num2, quoziente, resto;

    printf("inserisci il dividendo: ");
    scanf("%d", &num1);
    
    printf("inserisci il divisore: ");
    scanf("%d", &num2);

    if (num2 != 0) {
        quoziente = num1 / num2;
        resto = num1 % num2;
    
        printf("quoziente intero: %d, con resto: %d\n", quoziente, resto); 
    } else {
        printf("impossibile dividere per zero.\n");
    }
    
    return 0;
}
