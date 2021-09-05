voted = {}

def checkVote(name):
    if name in voted.keys():
        print(f"Kick {name} out")
    else:
        voted[name] = 1
        print("Welcome the new voter")

checkVote('John')
checkVote("Tom")

checkVote("Tom")







cache = {}

# Query is the question/data that you typed in the search bar.

def showResult(query):
    if query in cache.keys():
        cache[query] += 1
    else:
        cache[query] = 1

    google.search(query[url])


# Tackling worst case scenario in graphs

asked_list = ["Eric", "Sam", "Tom"]

def ask_question(name):
    if name in asked_list:
        print("Asked already.")
    else:
        ask() # Asks question
        asked_list.append(name)