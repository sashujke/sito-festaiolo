/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, OCaml, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
#include <stdio.h>

int main(void)
{
    int n,m;
    int somma = 0;
    printf ("Inserisci due numeri: \n");
    scanf ("%d%d", &n, &m);
    
    for(int i=n; i <= m; i++) {
        somma += 2 * i;
        }
            printf ("SOMMA: %d\n ", somma);

    return 0;
}
