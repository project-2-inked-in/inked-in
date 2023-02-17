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

---

## Models

User:

```js
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required. Please add a username.'],
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.Please add an email.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required. Please add a password.']
    },
    userRole: {
      type: String,
      enum: ['tattooer', 'user'],
      default: 'Choose between user o tattooer role',
      required: [true, 'Role is required. Please choose a user role.']
    },
    city: {
      type: String,
    },
    tattooNumber: {
      type: Number,
    },
    profileImage: {
      type: String,
      default: 'https://www.idsplus.net/wp-content/uploads/default-placeholder.png'
    },
    profileDescription: {
      type: String,
    },
    tattooStyle: {
      enum: ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant']
    },
    studio: {
      type: String
    },
    nextJourneys: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
```
Tattoo:
```js

const tattooSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true]
        },
        tattooImage: {
            type: String,
            required: [true, 'Image is required. Please add a image.'],
        },
        tattooPhotoStyle: {
            enum: ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant']
        },
        year: {
            type: Number
        },
        tattooer: {
            type: String
        },
        place: {
            type: String
        },
    },
    {
        timestamps: true
    });
```
Review:
```js

const reviewSchema = new Schema(
    {
    username: {
        type: String      
    },
    stars: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    comment: {
        type: String
    }
    });
```

Like: 
```js

const likeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        tattoo: {
            type: Schema.Types.ObjectId,
            ref: 'Tattoo'
        },
    },
    {
        timestamps: true
    });
```

Favorites: 
```js

const favoriteSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        tattoo: {
            type: Schema.Types.ObjectId,
            ref: 'Tattoo'
        },
    },
    {
        timestamps: true
    });
```

Contact:
```js 
const contactSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        tattooerId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String
        }, 
        contactform: {
            type: String
        },
        isChecked: {
            type: Boolean
        }
    },
    {
        timestamps: true
    });
```

---

## Routes

| Name       | Method | Endpoint           | Protected | Req.body            | Redirects |
|------------|--------|-------------       |-----------|---------------------|-----------|
| Home       | GET    | /                  | No        |                     |           |
| Login      | GET    | /auth/login        | No        |                     | /welcome  |
| Login      | POST   | /auth/login        | No        | { email, password } | / welcome |
| Signup     | GET    | /auth/signup       | No        |                     | /auth/signup |
| Signup     | POST   | /auth/signup       | No        | { username, password } | /auth/login  |
| SignTattoo | GET    | /auth/signTattooer | Yes       |                  | /welcome |
| SignTattoo | POST   | /auth/signTattooer | Yes       | { TattooStyle, city } | /welcome |
| Log Out    | GET    | /logout            | YES       |  | /auth/login |
| Welcome    | GET    | /welcome           | Yes       |                        |  /welcome |
| Profile    | GET    | /profile           | Yes       |          | /auth/profile |
| Edit Prof  | GET    | /profile/edit      | Yes       | | /auth/editProfile |
| Edit Prof  | POST   | /profile/edit      | Yes       |  { city, tattooNumber, profileDescription, tattooStyle, studio, nextJourneys } | /auth/editProfile |
| Unsubscribe | GET | /unsubscribe | Yes |  | /auth/signup |
| Tattooer Prof | GET | /tattooerId | Yes | | /tattooesPhotos/tattooer |
| Upload | GET | /upload | Yes | | /tattooesPhotos/uploadContent |
| Upload | POST | /upload | Yes | { tattooPhotoStyle, year, tattooer, place } | /users/profile |
| Edit photo | GET | /edit/photoId | Yes | | /tattooesPhotos/editPhotosContent |
| Edit photo | POST | /edit/photoId | Yes | { tattooPhotoStyle, year, tattooer, place } | /users/profile |
| Delete photo | GET | /delete/photoId | Yes | | /users/profile
| Search view | GET | /search | Yes | | /search |
| Search query | GET | /tattoer | Yes | | /search |
| Review | GET | /reviews | Yes | | /reviews/reviews |
| Review | POST | /reviews | Yes | { stars, comment } | /reviews/editReview |
| Edit Review | GET | /edit/reviewId | Yes | | /reviews/editReview |
| Edit Review | POST | /edit/reviewId | Yes | { stars, comment } | /reviews/tattooerId |
| Delete Review | GET | /delete/reviewId | Yes | | /reviews/tattooerId |
| Like | GET | /tattoerId | Yes | | /Back |
| Delete Like | GET | /delete/tattoerId | Yes | | /Back |
| See Favorites | GET | /myfavorites/ | Yes | | /favorites/myFavorites |
| Choise Favorites | GET | /tattooId | Yes | | /Back |
| Delete favorite | GET | /delete/tattooId | Yes | | /Back |
| Contact | GET | /tattooerId | Yes | | /Contact |
| Contact | POST | /tattoerId | Yes | { comment, contactform } | /tattoer/tattoerId | 
---

## Useful links

- [Github Repo]()
- [Trello kanban](https://trello.com/b/h4l8ecjZ/inked-in)
- [Deployed version](https://inkedin.fly.dev/)
- [Presentation slides](https://www.slides.com)



