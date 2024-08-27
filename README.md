# MeinOrganizer: Your Personal Organizer

![MeinOrganizer Desktop Table Mobile Mockup](./images/meinorganizer_dekstop-tablet-mobile.png)

**MeiOrganizer** is a web application designed to help you manage your personal projects, notes, lists, and budgets.

Whether you're tracking your daily to-dos, planning projects, or managing your expenses, MeinOrganizer provides a seamless and intuitive interface to keep everything organized.

**IMPORTANT: The app is in german**

## Features

- Projects: Organize and track projects
- Budgets: Track and manage your finances
- Notes: Create, edit and search your personal notes
- Calendar: Enter and search appointments in the calendar
- Timer: Increase your productivity with the pomodor focus timer
- Lists: Create lists
- Responsive, works any device (desktop, tablet, mobile), internet connection needed

## Technologies Used

- Javascript
- Node.js
- Express.js
- EJS
- MongoDB

## Installation

To get a loca copy of the project up and running, follow these steps:

1. clone the repository
2. install the dependencies: `npm install`
3. Create a .env file in the root directory and add the following variables:

```
NODE_ENV=production
EMAIL_USER=your_email
EMAIL_PW=your_email_password
HOST=your_email_host
EMAIL=your_email
DB_URL=your_mongodb_connection_string
secret=your_secret
```

4. Start the server: `npm start`
5. Open your browser and navigate to: <http://localhost:3000> (or any other port number you prefer to use)

## Contributing

If you find bugs or have suggestions for improvements, please submit an issue using the issues tab above. If you would like to submit a PR with a fix, reference the issue you created.

## Known Issues (work in progress)

The timer function currently stops working correctly if the browser tab is inactive or the device goes on sleep mode.

## Contact

For questions or feedback, please contact:

- Email: <info@natgian.com>
- GitHub: [Link](https://github.com/natgian)
