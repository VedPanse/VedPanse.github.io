def calculate_factorial(num):
    if num == 0 or num == 1:
        return 1
    else:
        return calculate_factorial(num - 1) * num

print(calculate_factorial(6))