<img width="888" height="261" alt="logo (1)" src="https://github.com/user-attachments/assets/e4238000-a32d-4fcc-b185-e122e65bd2ba" />

# Inspiration

When you have a medical emergency, you go to the ER. Key word EMERGENCY. Often when you get there, you're asked to wait for your name to be called. 5 hours later, they call you up, not to resolve your symptoms, but rather for a doctor to take a screening assesment of your symptoms. We saw this form of paperwork as a rather large inefficiency, being a time sink, and pulling doctors away from resolving patient issues, all in a place that is supposed to be the fastest way to receive medical attention.

That's why we built Symplified, an app that reduces time in the ER waiting room by pre-screening patients for symptoms.

# What it does

Symplified collects basic information from users through a simple survey. Users are then able to take photos of their medical conditions and use Symplified's text-to-speech capabilities to describe their symptoms. Once the user has entered of all their information, Symplified uses a custom prompt to query Google Gemini to parse user input. All of this data is maintianed in MongoDB Atlas and is accessible to doctors using Symplified.  Once Doctors log in via Auth0's authentication services, they are able to see a dashboard of patients orderded by the severity of their medical conditions, as well as the amount of time they've been waiting. Doctors can then select who to examine next, streamlining the processes from ER waiting room to being face-to-face with a doctor.

# How we built it

Symplified was built using React (JS), Tailwind CSS, Auth0, MUI, Flask, MongoDB, and the Gemini API. 

We first started playing around with the Gemini API, prompting it to check if image recognition was possible for abrasions, and burns, while also 
building out our key frontend features that served as the basis for our applications input (text-to-speech, survey, camera feature).

With a fine tuned model, we then started building out our Doctor's Dashboard, which gives key insights into patients in the waiting room.

Next we dove in to MongoDB, figuring out how to store our patients data. Concurrently we also integrated Auth0 for doctors, as patient data needs to be kept secure.

We then created the frontend for patient profiles, giving AI powered insights into their symptoms and the risks they may be facing.

# Challenges we ran into

One of our biggest challenges was finding the right prompt to feed into Gemini. Some prompts gave us highly technical medical jargon which we couldn't comprehend, while other prompts failed to secure a straightforward diagnosis. After many rounds of testing we managed to develop a well-written prompt that gave us reliable and readable responses. Another roadblock we faced was integrating Auth0. Seeing as neither of us had worked with Auth0 before, it took some time to fully grasp how it worked. But we eventually figured it out and were able to seamlessly integrate Auth0 into our login page. Lastly, by far our biggest challenge, was staying awake for 24 hours after driving from Collge Park, Maryland at 5:00AM.


# What we learned

Abhyuday Srivatsa: I focused on developing Symplified's backend. I was able to improve on my skills with Python in general, but more specifically with Flask and API routing. I enjoyed bridging communication pipelines between our React frontend, Flask backend, and Mongo database. Lastly, I learnt a lot about prompt engineering and how to steer LLM's in the right direction

Caleb Holland: I focused on developing Symplified's frontend, and also did a bit of work with a little bit of everything. I continued to improve my ReactJS skills. And learned a bit about what it was like to not meet my standards for a UI. This was a challenge, and a life lesson. I look forward to continuing to learn!


# What's next for Symplified


# Screenshots (Graphic Image Warning)


Doctor View
<img width="1908" height="884" alt="image" src="https://github.com/user-attachments/assets/61557bd4-3c59-43b3-90d6-c9a810cabf38" />

Patient File
<img width="1918" height="885" alt="image" src="https://github.com/user-attachments/assets/70e5a8c1-9f7b-439e-9de8-a5784eb03526" />

Data Entry
<img width="1184" height="765" alt="Screenshot 2025-09-21 at 6 26 32 AM" src="https://github.com/user-attachments/assets/0155441f-6726-4014-8d8c-77a52f69d189" />





