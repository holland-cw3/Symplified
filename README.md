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


# What we learned
Abhi, 

Caleb Holland,

# What's next for Symplified


# Screenshots


