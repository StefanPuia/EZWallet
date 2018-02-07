# EZWallet

Install
-------
1. Download Node.js 
https://nodejs.org/en/

2. Download Git
https://git-scm.com/downloads

3. Clone repository
```bash
git clone https://github.com/StefanPuia/INSE-EZWallet.git
```

4. Install modules
```bash
cd INSE-EZWallet
npm install
```

Testing
-------
To run the server:
```bash
npm server
```

To stop the server (Ctrl+C or Command+C):
```bash
^C
```


# Development and deployment rules

Development
===========

Code:
-----

*   Using camel case for all variables, methods, objects etc.
*   Functions and variables start with a lowercase letter
*   Objects start with an uppercase letter

Files:
------

*   All static files (css, frontend js, images) will be uploaded to “/static/”
*   These files will be accessible in the html from the “/public/” folder

API:
----

*   The api will be using this system: /api/variable/method/params (e.g. “/api/transaction/get/10” )

Deployment
==========

There will be no commits on the master branch.

Branches
--------

*	Server: development of the server and the API
*	Client: development and design of the user interface and client scripts
*	SQL: sql code for creating, populating and querying the database

In-branch Committing:
---------------------

*   After one (or more) feature(s) is (are) finished (written and partially tested) on the branch.
*   Conflicts on the branch will be resolved between the branch team members.

Branch merging:
---------------

*   After one feature is finished (written and partially tested) on all branches
*   After each merge all the unit tests will be run on that feature, as well as all the previous ones to make sure they are still passing.
*   If any major failure occurs the master will be reverted to the previous commit until the bug is fixed.
*   Though they should not occur, major conflicts on the branch merging will be discussed between all the team members.