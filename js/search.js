var query;
var sequence = []

document.querySelector("#search-box").addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
        sequence = []
        query = e.target.value;
        getList()
        alert(sequence);
    }
});

function getList() {
    if (indexContent.includes(query)) {
        sequence.push(true);
    } else {
        sequence.push(false)
    }

    if (blogContent.includes(query)) {
        sequence.push(true);
    } else {
        sequence.push(false)
    }
    if (documentationContent.includes(query)) {
        sequence.push(true);
    } else {
        sequence.push(false)
    }
    if (socialContent.includes(query)) {
        sequence.push(true);
    } else {
        sequence.push(false)
    }
    if (videosContent.includes(query)) {
        sequence.push(true);
    } else {
        sequence.push(false)
    }
    if (credits.includes(query)) {
        sequence.push(true);
    } else {
        sequence.push(false)
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