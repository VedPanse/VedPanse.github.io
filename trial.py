def f(x):
    return (3*x)**0.5

sample_points = [k for k in range(3.25, 6, 0.25)]
width = 0.5

print(sum([f(k) for k in sample_points]) * width)
