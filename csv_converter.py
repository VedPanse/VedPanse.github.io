# import OS module
import os

# Get the list of all files and directories
def get_content(query):
    query = query.lower()
    return_list = []
    path = "static"
    dir_list = os.listdir(path)

    all_files = []
    # prints all files
    for items in dir_list:
        try:
            path_way = "static/" + items
            file_list = os.listdir(path_way)
            for item in file_list:
                item = f"{items}/{item}"
                all_files.append(item)
        except NotADirectoryError:
            pass



    html = []
    for items in all_files:
        if items[-5:] == ".html":
            html.append(items)


    all_content = {}


    for items in html:
        fs = open(f"static/{items.lower()}", "r")
        data = fs.read()
        fs.close()

        all_content[items] = data

    
    for key, value in all_content.items():
        if query in value:
            return_list.append(key)
    return return_list
            
