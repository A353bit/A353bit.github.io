import random

number = random.randint(1, 10)

# Gestione dell'input dell'utente con try-except per evitare ValueError
try:
    guess = int(input("indovina il numero tra 1 e 10: "))
    
    if guess == number:
        print("Hai vinto!")
    else:
        print("Sei stato cancellato!")
except ValueError:
    print("per favore digita un numero valido.")
