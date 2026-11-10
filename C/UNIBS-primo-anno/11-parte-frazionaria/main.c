/******************************************************************************

Welcome to GDB Online.
  GDB online is an online compiler and debugger tool for C, C++, Python, PHP, Ruby, 
  C#, OCaml, VB, Perl, Swift, Prolog, Javascript, Pascal, COBOL, HTML, CSS, JS
  Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/

#include <stdio.h>

int main(void)
{
    float reale, parteFraz;
    int parteInt;

    scanf ("%f", &reale);
    parteInt = (int)reale;
    parteFraz = reale - parteInt;
    
    if(parteInt != 0) {
        printf ("Parte intera %d\n", parteInt);
        printf ("Parte frazionaria %.2f", parteFraz);

    } else printf("Hai inserito il numero 0");
    
    return 0;
}