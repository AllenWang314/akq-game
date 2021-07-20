import random

# script for generating cards for both opponents

cards = ["A", "K", "Q"]
arr = []

for _ in range(100):
    r = random.randint(0,2)
    tup = (cards[r], cards[(r + random.randint(1,2)) % 3])
    arr.append(tup)

def safety_check(arr):
    count = 0
    Acount = 0
    Kcount = 0
    Qcount = 0
    for tup in arr:
        count += 1
        if tup[0] == "A":
            Acount += 1
        elif tup[0] == "K":
            Kcount += 1
        elif tup[0] == "Q":
            Qcount += 1
        else:
            print("ERROR: card not one of A, K, Q")
        if (tup[0] == tup[1]):
            print("ERROR: players can't be dealt same card")
    print("Dealt A " + str(Acount / count) + "% of the time") 
    print("Dealt K " + str(Kcount / count) + "% of the time")
    print("Dealt Q " + str(Qcount / count) + "% of the time")

print(arr)
safety_check(arr)

print("Player 1 rounds:")

for i in range(len(arr)):
    print("Round " + str(i+1) + ": " + str(arr[i][0]))
    print()

print("Player 2 rounds:")

for i in range(len(arr)):
    print("Round " + str(i+1) + ": " + str(arr[i][1]))
    print()
