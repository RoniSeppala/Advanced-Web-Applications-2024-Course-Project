# Course project

## AI Declaration
In this project ChatGPT-4o, ChatGPT-o3-mini and ChatGPT-o3-mini-high as well as these modles through GitHub Copilot, have been used for various things. These modles have provided guiding on what tools to use, how to use these tools and bug spotting and bug fixing. GitHub Copilot inline autocomplete and Copilot edits have been used a few times for bug fixing. Testdata has also been mostly generated using AI, thus affecting the storage datastructure.

## Installation guidelines

This program can be accessed through a few ways.
1. Mirror the GitHub onto your local machine and run "npm run dev:client" and "npm run dev:server" from the root folder and from different terminals, though with this method google login and x login will not work as the keys will be missing

## How to use
### Login and Register
When entering the website, the user can register or login either with twitter, google or with email and password

### Website usage
Once logged in, the user can add boards, categories and todos by clicking respective add buttons.
The user can reorganise todos within a category as well as drag them to other categories within the same board.
The user can also reorganise categories by dragging and dropping them.
Categories and Todos can be deleted or have their color changed with their respective buttons.
Board, category and todo names can be edited by double clicking on them.

## Technology choises
In this section I will go through my technolgy choises, used npm packets and other relevant choises
### React
The front end is built with react and many libraries built for it.

#### React-color
React color and especially its ChromePicker has been used for the color changing UI

#### DnD-kit
Category and todo sorting and reordering is done with DnD-kit and its sortable variant.

#### Mui-material and Mui-icons
Mui-material and mui-icons have been used for the visual outlook and the responsive design.

#### React router
React router is used for redirecting the front end

### Express
Express is used to build the back end.

### MongoDB and Mongoose
All data on the back end is stored on a MongoDB database and managed with Mongoose

### Passport, Bcrypt, Express-session and Express-validator
Session managing and thus login and registering is done with Express-session and Passport. Password encryption is done with Bcrypt and inputvalidation for registering and logging in is done with Express-validator

## Point requests
### Assignment given
| Feature                                   | Point request     |
|-------------------------------------------|-------------------|
| Basic Features                            | 25                |
| Utilization of React                      | 3                 |
| Cards can be organised with drag and drop | 2                 |
| Columns can be reordered                  | 1                 |
| User can set the color of a card          | 1                 |
| Login with google and X                   | 3                 |
| Double-click to edit any content          | 4                 |
| **Sum**                                   | **39**            |

### Personal reguests
| Feature                                                                       | Point request     |
|-------------------------------------------------------------------------------|-------------------|
| Columns can be colored                                                        | 1                 |
| Registering and login have validation middlevare and provide user with errors | 1                 |
| Forms can be submitted with enter                                             | 1                 |
| **Sum**                                                                       | **3**             |