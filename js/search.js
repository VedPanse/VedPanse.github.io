var query;
var sequence = []

document.querySelector("#search-box").addEventListener("keydown", (e) => {

    if (e.keyCode === 13) {
        query = e.target.value.toLowerCase().trim();

        if (query !== "") {
            sequence = []
            getList()
            appendo()
        }
    }
});

function appendo() {
    if (sequence.length === 0) {
        document.querySelector("#nothingness").style.display = "block";
        document.querySelector("#somethingness").style.display = "none";
    } else {
        document.querySelector("#nothingness").style.display = "none";
        document.querySelector("#somethingness").style.display = "block";


        document.querySelector("div#somethingness").innerHTML = "";
        for (let i = 0; i < sequence.length; i++) {
            var suggestion = document.createElement("div");
            var title = document.createElement("a");
            var desc = document.createElement("p");
            var href;
            var go = document.createElement("a");
            go.innerHTML = "&nbsp;Go there &#8250;";
            go.classList.add("go-there");
            title.innerHTML = sequence[i];

            switch (sequence[i]) {
                case "Ved Panse - HomePage":
                    desc.innerHTML = "Welcome to my personal website."
                    href = "index.html"
                    break;
                case "Ved Panse - Blogs":
                    desc.innerHTML = "Hello. I am Ved Panse. This is my blog page."
                    href = "templates/blogs/index.html"
                    break;
                case "Ved Panse - Documentations":
                    desc.innerHTML = "Welcome to my documentations and research website. Here, I have pusblished my research papers and documentations on the softwares that I either built or keenly studied."
                    href = "templates/docs/index.html"
                    break;
                case "Ved Panse - Social Work":
                    desc.innerHTML = "This website is dedicated for archiving my experiences of trying to bring positive changes in the society."
                    href = "templates/social/index.html"
                    break;
                case "Ved Panse - Videos":
                    desc.innerHTML = "Through this website, I want to share some of my experiences in the form of videos."
                    href = "templates/video/index.html"
                    break;
                case "Ved Panse - Credits":
                    desc.innerHTML = "This website is dedicated to attribute all the other websites and people who made building my personal website possible."
                    href = "templates/credits/index.html"
                    break;
                case "Ved Panse - My Passion for Cricket | Blog":
                    desc.innerHTML = "I felt like sharing my interest in cricket with you. In this blog, I describe how I developed this interest. From a young age, I was fascinated by the very idea of cricket: staying within 22 yards and hitting the ball past 107 yards."
                    href = "templates/blogs/cricket.html"
                    break;
            }

            title.href = href;
            go.href = href;

            suggestion.appendChild(title);
            suggestion.appendChild(desc);
            suggestion.appendChild(go)

            suggestion.style.marginBottom = "5%";
            document.querySelector("div#somethingness").appendChild(suggestion);
        }
    }
}


function getList() {
    if (indexContent.toLowerCase().includes(query)) {
        sequence.push("Ved Panse - HomePage");
    }

    if (blogContent.toLowerCase().includes(query)) {
        sequence.push("Ved Panse - Blogs");
    }
    if (documentationContent.toLowerCase().includes(query)) {
        sequence.push("Ved Panse - Documentations");
    }

    if (socialContent.toLowerCase().includes(query)) {
        sequence.push("Ved Panse - Social Work");
    }

    if (videosContent.toLowerCase().includes(query)) {
        sequence.push("Ved Panse - Videos");
    }
    if (credits.toLowerCase().includes(query)) {
        sequence.push("Ved Panse - Credits");
    }

    if (blogContent.toLowerCase().includes(query)) {
        sequence.push("Ved Panse - My Passion for Cricket | Blog");
    }

}

const indexContent = `Advent of Code 2021


What have I been upto?



Spread Warmth

The Leo Club members set out to spread warmth in the catastrophic winter cold for the landless by providing them warm clothes.

View Minutes 

Advent of Code, 2021

Advent of Code is an Advent calendar of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language you like.

View Repository  Official Website 

Algorithms Explained

'Algorithms Explained' is a technical documentation on the basics of how algorithms work.

Read Blog 
About Me



About Me
Hi there. I am Ved Panse and I live in India. I am an aspiring AI Expert, and I possess a deep interest in the fundamentals of Computer Science. I like innovating things that would make my life easier. Geek life apart, I am also keen on playing sports, especially cricket (I am a batsman). I have tried many things in my life, ranging from playing different sports to developing web applications for MNCs like Magna Inc, and the activity I like doing the most is computer programming (apart from watching sports when it is being broadcasted).

Download CV 
HTML • 100%
CSS • 99%
JavaScript • 85%
Python • 95%
Kotlin • 15%
Java • 2%


I can describe my life in short as

A student

'Algorithms Explained' is a technical documentation on the basics of how algorithms work.

Read Blog 

A sportsman

My opinions on where and how aspirant programmers should start, and remain productive throughout their journey.

Read Blog 

An aspiring AI expert

I felt like sharing my interest in cricket with you. In this blog, I describe how I developed this interest. From a young age, I was fascinated by the very idea of cricket: staying within 22 yards and hitting the ball past 107 yards.

Read Blog 

A competitor

'Algorithms Explained' is a technical documentation on the basics of how algorithms work.

Read Blog 

A Music Band member

My opinions on where and how aspirant programmers should start, and remain productive throughout their journey.

Read Blog 

A Drama Club member

I felt like sharing my interest in cricket with you. In this blog, I describe how I developed this interest. From a young age, I was fascinated by the very idea of cricket: staying within 22 yards and hitting the ball past 107 yards.

Read Blog 

A Dance Club member

'Algorithms Explained' is a technical documentation on the basics of how algorithms work.

Read Blog 

An editor

My opinions on where and how aspirant programmers should start, and remain productive throughout their journey.

Read Blog 

A social worker

I felt like sharing my interest in cricket with you. In this blog, I describe how I developed this interest. From a young age, I was fascinated by the very idea of cricket: staying within 22 yards and hitting the ball past 107 yards.

Read Blog 
Projects



Projects

javelinLang

javelinLang is an open-source DSL that helps to build GUIs quickly and easily. It was developed in Python.

View Repository  View Documentation 

eAuthentication

A tiny little project that enables eAuthentication for any primitive website. It was built in Python.

View Repository 

Image Parser

This program scrapes all the text from an image by using Machine Learning and AI. It looks cool.

View Repository 




Internships


BancBridge

I was assigned to come up with new designs for the new BancBridge website. Throughout my internship, I got to learn many things and work with different groups with mutual aims.

Learn More 

Magna International

Through my BancBridge internship, I got the opportunity to develope software for Magna International as well. I was tasked with developing a software for handling uploads and downloads from the clients.

Learn More 




Social Work

Spread Warmth

The Leo Club members set out to spread warmth in the catastrophic winter cold for the landless by providing them warm clothes.

View Minutes 

Linking Generations

Being a member of the Board of Directors of a social service club, I, along with my group, took the initiative of meeting children from an orphanage home and taking them to an old age home for interaction.

Learn More 
GitHub
Visit my GitHub account for some more crazy projects.

Take me there 
CodePen
Visit my CodePen account for some more cool concept websites.

Take me there 
Committing to Social Work
View the webpage where I pen down my experiences of trying to make a wide social impact.

Take me there 
Blogs



Blogs


Algorithms Explained

'Algorithms Explained' is a technical documentation on the basics of how algorithms work.

Read Blog 

Programming Dilemma

My opinions on where and how aspirant programmers should start, and remain productive throughout their journey.

Read Blog 

My Passion for Cricket
I felt like sharing my interest in cricket with you. In this blog, I describe how I developed this interest.
Read Blog 
The Blog Collection
Visit my blog collection for more blogs.
Take me there 
The Documentations Collection
Visit my documentation and research collection.
Take me there 
Contact Me`;

const blogContent = `Introductory blog



Programming Dilemma

My opinions on where and how aspirant programmers should start, and remain productive throughout their journey.

Read Blog 

My Passion for Cricket

I felt like sharing my interest in cricket with you. In this blog, I describe how I developed this interest.

Read Blog `;

const documentationContent = `Documentations
Welcome to documentations. This webpage contains discussions on various technical topics.

javelinLang
javelinLang is an open-source DSL for simplifying GUIs in Python.



Documentation

javelinLang
javelinLang is an open-source DSL for simplifying GUIs in Python.



Research
This section contains simple explanations and some of my research on problems




Documentation

The Travelling Salesman
This documentation introduces the infamous "travelling salesman problem" and accentuates the efforts and the logical thinking going about to solve this problem.



Read Documentation 


Documentation

javelinLang
'javelinLang' is a technical documentation on the basics of how algorithms work.



Read Documentation 


Documentation

The Travelling Salesman
This documentation introduces the infamous "travelling salesman problem" and accentuates the efforts and the logical thinking going about to solve this problem.



Read Documentation 

Python Programming
This section contains simple explanations and some of my research on problems




Documentation

The Travelling Salesman
This documentation introduces the infamous "travelling salesman problem" and accentuates the efforts and the logical thinking going about to solve this problem.



Read Documentation 


Documentation

javelinLang
'javelinLang' is a technical documentation on the basics of how algorithms work.



Read Documentation 


Documentation

The Travelling Salesman
This documentation introduces the infamous "travelling salesman problem" and accentuates the efforts and the logical thinking going about to solve this problem.



Read Documentation 

Web Development
This section contains simple explanations and some of my research on problems




Documentation

The Travelling Salesman
This documentation introduces the infamous "travelling salesman problem" and accentuates the efforts and the logical thinking going about to solve this problem.



Read Documentation 


Documentation

javelinLang
'javelinLang' is a technical documentation on the basics of how algorithms work.



Read Documentation 


Documentation

The Travelling Salesman
This documentation introduces the infamous "travelling salesman problem" and accentuates the efforts and the logical thinking going about to solve this problem.



Read Documentation 

`

const socialContent = `Committing to social work



WH-Leo Club


Spread Warmth

On December 12, 2021, the WH-Leo Club embarked on a mission to spread warmth in the winter of 2021 by donating clothes.

Read Minutes `;

const videosContent = `High Jump



Topic: High Jump


Attempt 1: Success

Oh yes! Cleared a height that I deemed good for my age (then) in the first attempt. I didn't expect to jump this high. Seemed like I had improved.

Watch Video 

Attempt 2: Fail

A height of 150cm seemed monstrous for me to clear in the first attempt. I hoped I would get it right in the coming attempts.

Watch Video 

Attempt 3: The suspense

After failing to clear the height of 150cm in the first attempt and the second attempt, I have got only one more attempt to clear the level. Will I make it to the finals?

Watch Video 





The final 'decider' round

My best friend and I had made it to the finals! And we had to compete between ourselves to grab the first position. Who will make it to the top position and qualify for the State Championships?

Watch Video 

Award distribution

The most awaited event: the award distribution. This did not mark my first rank in the tournament. Rather, it marked the great scale by which I had improved myself to become worthy enough to bag the gold medal in district championships, and qualify for the state level.

Watch Video `

const credits = `Attributes credits credit`

const cricketBlog = `My Passion for Cricket


I felt like sharing my interest in cricket with you. In this blog, I describe how I developed this interest. From a young age, I was fascinated by the very idea of cricket: staying within 22 yards and hitting the ball past 107 yards.




Cricket and India
In India, calling cricket "India's favorite game" would be underestimating the love of Indians towards this sport. Many people even call cricket a religion in India.

The number of people in India who play cricket daily surpasses the holding capacity of all the grounds in India. Thus, many of them take to the streets to play cricket.




My introduction to cricket
As my mother recalls it, my grandfather once took me on an evening stroll to show me a dog that lived just across the street (I was fascinated by dogs too). When we stepped out of the gate, we saw a group of kids playing cricket on the street. My young eyes were so fascinated as they played cricket that I compelled my grandfather to stay there for half an hour, holding me while I gazed at the kids playing.




Cricket and me
After that incident, I had developed a strange habit. Whenever anyone came to my house, I used to throw a ball at them and expect them to throw the ball back at me so that I could hit it with the bat.

Even today, all of my relatives ask me if I am still into cricket.




School team
It was no surprise for my family that I made it to my school's cricket team. I was the opening batsman for my school because I was reputed for being a big hitter. However, this was not true when it came to leather ball cricket.




Cricket today
As my interest in cricket was developing at a tender age, my passion for computers was rising too. As it turned out, I liked computers more. Regardless, I still respect cricket as I used to before. I try to stay as connected as I can.




Did you have such a passion for anything too? Let me know here.`