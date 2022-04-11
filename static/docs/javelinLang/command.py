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


# Dijkstra's Algorithm

remaining_nodes = [node1, node2, node3] # Nodes that are remaining to be processed

while len(remaining_nodes) != 0: # Condition to check if the remaining_nodes still has any item or not
    node = min(remaining_nodes) # Gets minimum of remaining_nodes
    cost = costs[node]
    neighbors = graph[node]
    for n in neighbors.keys(): # Iterate through all the neighbors of the node
        new_cost = cost + neighbors
        if costs[n] > new_cost: # Get the cheapest of tours from neighbor to neighbor
            costs[n] = new_cost # Update the cost of the node.
            parents[n] = node
    remaining_nodes.pop(node) # Remove this node from remaining nodes.
    node = min(remaining_nodes) # Get another node and continue the while loop
