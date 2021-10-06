$name = "Ved"

!create_window(800, 800, "Test")
!head -> "Just a Test" ||| 0, 0, 40
!write -> "Testing..." ||| 1, 0, 15
!create_canvas(300, 250, "yellow") ||| 6, 0
!input -> "Username" ||| 3, 0 // 20
!input -> "Password" ||| 4, 0 // 20
!button -> "Register" ||| 5, 0, submit
!image -> "image.jpeg" ||| 6, 0 // 120, 240
!close()