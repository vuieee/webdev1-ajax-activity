# AJAX

A dynamic, front-end web application built for Web Development I that interacts with a RESTful API to manage a contact list. 

## Features
* **Read:** Fetches and displays a list of contacts from an external API.
* **Create:** Allows users to add new contacts via a modal form.
* **Update:** Enables editing of existing contact information.
* **Delete:** Safely removes contacts from the database.
* **Validation:** Prevents the submission of duplicate email addresses.

## Languages Used
* HTML5
* CSS3 (Internal styling)
* Vanilla JavaScript (ES6)
* Asynchronous JavaScript (`fetch`, `async/await`)
* REST API Integration

## API Documentation Reference
This project consumes the DCISM Contact List API, utilizing the following endpoints:
* `GET /read.php`
* `POST /add.php`
* `POST /edit.php`
* `POST /delete.php`
