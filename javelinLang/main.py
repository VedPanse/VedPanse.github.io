import os
from tkinter import *
from tkinter import ttk

window = 1


class Color:
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    DARKCYAN = '\033[36m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


files = [f for f in os.listdir('.') if os.path.isfile(f)]
wd = None
for f in files:
    if (f[-3:]) == ".jL":
        wd = f

content = open(wd, "r")

f = content.read()
fs = f.split("\n")

variables = {}


def console(item):
    if item[:11].replace(" ", "") == "!println->":
        expression_val = item[12:]
        split_val = expression_val.split(" + ")
        statement = ""

        for item in split_val:
            if '"' in item:
                statement += item.replace('"', '')
            else:
                if item in variables.keys():
                    statement += variables[item]
                else:
                    print(Color.RED + "Invalid" + Color.END)
        print(statement)

    elif item[0] == "$":
        var = item.split("=")[0][1:].replace(' ', '')
        value = item.split("=")[1][1:].replace('"', '')
        variables[var] = value

    elif item[:8] == "!add -> ":
        sub_array = item[8:]
        sub_array = sub_array.split(", ")
        array = []
        for item in sub_array:
            array.append(float(item))
        print(sum(array))

    else:
        return False


def tk_inter(item):
    global window
    if "!create_window(" in item:
        dimensions = item[15:-1]
        width = 0
        height = 0
        title = "Tk"
        try:
            width = dimensions.replace(" ", '').split(",")[0]
            height = dimensions.replace(" ", "").split(",")[1]
            title = dimensions.replace(" ", "").split(",")[2]

        except:
            width = 0
            height = 0
        finally:
            window = Tk()
            window.minsize(width, height)
            window.title(title.replace('"', ''))

    elif "!write -> " in item:

        pseudo = item.split(" ||| ")
        coordinate = pseudo[-1]
        x = coordinate.split(", ")[0]
        y = coordinate.split(", ")[1]
        try:
            font_size = coordinate.split(", ")[2]
        except:
            font_size = 12
        consider = item.split(" ||| ")[0]
        expression_val = consider[10:]
        split_val = expression_val.split(" + ")
        statement = ""

        for item in split_val:
            if '"' in item:
                statement += item.replace('"', '')
            else:
                if item in variables.keys():
                    statement += variables[item]
                else:
                    print(Color.RED + "Invalid" + Color.END)

        label = Label(window, text=statement, font=("Arial", font_size))
        label.grid(row=x, column=y)

    elif "!head -> " in item:
        pseudo = item.split(" ||| ")
        coordinate = pseudo[-1]
        x = coordinate.split(", ")[0]
        y = coordinate.split(", ")[1]
        try:
            font_size = coordinate.split(", ")[2]
        except:
            font_size = 18
        consider = item.split(" ||| ")[0]
        expression_val = consider[10:]
        split_val = expression_val.split(" + ")
        statement = ""

        for item in split_val:
            if '"' in item:
                statement += item.replace('"', '')
            else:
                if item in variables.keys():
                    statement += variables[item]
                else:
                    print(Color.RED + "Invalid" + Color.END)
        label = Label(window, text=statement, font=("Arial", font_size))
        label.grid(row=x, column=y)

    elif '!button ->' in item:
        original_val = item[11:]
        expression_val = original_val.split(" ||| ")[0]
        coordinate = original_val.split(" ||| ")[1].split(", ")

        width = int(coordinate[0])
        height = int(coordinate[1])
        function = coordinate[2]

        split_val = expression_val.split(" + ")
        statement = ""

        for item in split_val:
            if '"' in item:
                statement += item.replace('"', '')
            else:
                if item in variables.keys():
                    statement += variables[item]
                else:
                    print(Color.RED + "Invalid" + Color.END)
        btn = ttk.Button(text=statement, command=function)
        btn.grid(row=width, column=height)

    elif "!create_canvas(" in item:
        params = item.split(" ||| ")[0][15:-1].split(", ")
        width = params[0]
        height = params[1]
        bg = params[2].replace('"', '')

        x = item.split(" ||| ")[1].split(", ")[0]
        y = item.split(" ||| ")[1].split(", ")[1]

        C = Canvas(window, bg=bg, width=width, height=height)
        C.grid(row=x, column=y)

    elif "!input ->" in item:
        stringy = item[10:].split(" ||| ")[0].replace('"', '')
        coord = item[10:].split(" ||| ")[1].split(" // ")[0]
        width = int(item[10:].split(" ||| ")[1].split(" // ")[1])
        x = int(coord.split(", ")[0])
        y = int(coord.split(", ")[1])

        enter = Entry(window)
        enter.insert(0, stringy)
        enter.config(width=width)
        enter.grid(row=x, column=y)

    # elif "!image ->" in item:
    #     expression = item[10:]
    #     image = expression.split(" ||| ")[0].replace('"', '')
    #     coor = expression.split(" ||| ")[1].split(" // ")[0]
    #     wh = expression.split(" ||| ")[1].split(" // ")[1]
    #     x = int(coor.split(", ")[0])
    #     y = int(coor.split(", ")[1])
    #
    #     width = wh.split(", ")[0]
    #     height = wh.split(", ")[1]
    #
    #     canvas = Canvas(window, width=300, height=300)
    #     canvas.pack()
    #     img = ImageTk.PhotoImage(Image.open("ball.png"))
    #     canvas.create_image(20, 20, anchor=NW, image=img)
    #
    #     C.grid(row=x, column=y)

    elif "!close()" in item:
        window.mainloop()


try:
    fs.remove("")
except:
    pass

for i in fs:
    console(i)
    tk_inter(i)
