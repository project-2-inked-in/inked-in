# App name

## Description

This is a project developed by Estefania and Pau as the project for the second module at Ironhack. The purpose of the application is ...

---

## Instructions

When cloning the project, change the <code>sample.env</code> for an <code>.env</code> with the values you consider:
```js
PORT=3000
MONGO_URL='mongodb://localhost:27017/app-name'
SESSION_SECRET='SecretOfYourOwnChoosing'
NODE_ENV='development'
```
Then, run:
```bash
npm install
```
To start the project run:
```bash
npm run start
```

To work on the project and have it listen for changes:
```bash
npm run dev
```

---

## Wireframes
Substitute this image with an image of your own app wireframes or designs

![](docs/wireframes.png)

---

## User stories (MVP)

What can the user do with the app?
- User can sign up and create and account
- User can choose between two roles: user or tattooer
- User/tattooer can login
- User/tattooer can log out
- User/tattooer can create their profile
- User/tattooer can update their profile
- User/tattooer can upload a profile photo
- User/tattooer can upload a tattoos photos ans tattooer can upload their work
- User/tattooer can visit other tattooer profile

## User stories (Backlog)

- User/tattooer can delete their profile
- User/tattooer can give like to tattooer photo
- User/tattooer can have favourites work from tattooers (from likes)
- User/tattooer can do reviews to tattoers, but not to himselfs
- User can see their reviews
- User can edit their reviews
- User can visit other users profiles
- User can ask appointment to tattooer
- User can send a DM to tattoer
- User/tattoor can see favoutire images in big size


---

## Models

User:

```js
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    timestamps: true
  }
);
```

---

## Routes

| Name  | Method | Endpoint    | Protected | Req.body            | Redirects |
|-------|--------|-------------|------|---------------------|-----------|
| Home  | GET   | /           | No   |                     |           |
| Login | GET    | /auth/login | No |                      |           |
| Login | POST | /auth/login   | No | { email, password }  | /         |
| Signup | GET    | /auth/signup | No |                      |           |
| Signup | POST | /auth/signup   | No | { username, password }  | /auth/login  |
| Welcome  | GET    | /welcome | Yes |                        |           |
| Profile | GET | /profile   | Yes |          |   |
| Profile | POST | /profile | Yes |
| 
---

## Useful links

- [Github Repo]()
- [Trello kanban](https://trello.com/b/h4l8ecjZ/inked-in)
- [Deployed version]()
- [Presentation slides](https://www.slides.com)



