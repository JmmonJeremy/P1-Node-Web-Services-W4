const mongodb = require('../db/connect');
const { ObjectId } = require('bson');

// fuction to return all contacts
const getAllContacts = async (req, res) => {
  try {
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get all "documents" in other words table rows or entries
    const result = await collection.find();
    // Turn each entry into an item in a list
    const contactsInfoList = await result.toArray();
    // See if there is anything in the table or "collection" & report
    var entries = contactsInfoList.length;
    if (entries === 0) {
      console.log('No documents found in the contacts collection.');
      return res.status(404).json({ message: 'No contacts found.' });
    } else {
      console.log(`There are "${entries}" documents in the contacts collection.`);
    }
    // Get & report the name of the 1st entry in the collection
    console.log(
      `"${contactsInfoList[0].firstName} ${contactsInfoList[0].lastName}" is the "first & last Name" for the 1st "contacts collection entry"`
    );
    // Set header and get 1st entry
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contactsInfoList);
  } catch (error) {
    console.error('Error fetching data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// function to get 1 contact
const getSpecificContact = async (req, res) => {
  try {
    // Create a variable to hold the object of the contact id
    const contactId = new ObjectId(req.params.id.toString());
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get a specific entry from the "document"
    const result = await collection.find({ _id: contactId });
    // Turn the entry into an item in a list
    const contactsInfoList = await result.toArray();
    // See if there is anything in the table or "collection" & report
    var entries = contactsInfoList.length;
    if (entries === 0) {
      console.log('No contact found in the contacts collection matches.');
      return res.status(404).json({ message: 'No matching contact found.' });
    } else {
      console.log(`There is "${entries}" matching contact in the contacts collection.`);
    }
    // Get & report the name of the 1st entry in the collection - the only entry
    console.log(
      `"${contactsInfoList[0].firstName} ${contactsInfoList[0].lastName}" is the "first & last Name" for the matching contact in the "contacts collection entry"`
    );
    // Set header and get 1st - only entry
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contactsInfoList[0]);
  } catch (error) {
    console.error('Error fetching data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// function to post or create a contact
const createContact = async (req, res) => {
  try {
    // Log the request body to check if it's being parsed
    console.log(`The following is prepped to be added:\n ${JSON.stringify(req.body, null, 2)}`);
    // Create the contact to be created
    const contact = {
      _id: new ObjectId(req.body._id),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Insert the new contact into the database
    const actionResult = await collection.insertOne(contact);
    // Return the id # and success
    console.log(actionResult);
    res.status(201).json(actionResult);
  } catch (error) {
    console.error('Error inserting data: ', error);
    res.status(500).json({ message: 'Error occured while creating contact.' });
  }
};

// function to post or create a contact
const updateContact = async (req, res) => {
  try {
    // Create a variable to hold the object of the contact id
    const contactId = new ObjectId(req.params.id.toString());
    // Create the contact to be created
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get a specific entry from the "document"
    const result = await collection.findOne({ _id: contactId });
    if (!result) {
      console.log('No matching contact found to update.');
      return res.status(404).json({ message: 'No matching contact found to update.' });
    }
    const name = result.firstName + ' ' + result.lastName;
    console.log(
      `${name}'s contact info with the id of "${contactId}" is being updated as follows:\n${JSON.stringify(req.body, null, 2)}`
    );
    // Update the matching contact
    const actionResult = await collection.replaceOne({ _id: contactId }, contact);

    // Check if a contact was updated
    if (actionResult.matchedCount === 0) {
      console.log('No matching contact found to update.');
      return res.status(404).json({ message: 'No matching contact found to update.' });
    } else {
      const message = `The contact "${name}" with the id of "${contactId}" was successfully updated in the contacts collection as requested.`;
      console.log(message);
      // Return the id # and success
      // res.status(200).json(message);
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error inserting data: ', error);
    res.status(500).json({ message: 'Error occured while updating contact.' });
  }
};

// function to post or create a contact
const removeContact = async (req, res) => {
  try {
    // Create a variable to hold the object of the contact id
    const contactId = new ObjectId(req.params.id.toString());
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get a specific entry from the "document"
    const result = await collection.findOne({ _id: contactId });
    if (!result) {
      console.log('No matching contact found to delete.');
      return res.status(404).json({ message: 'No matching contact found to delete.' });
    }
    const name = result.firstName + ' ' + result.lastName;
    console.log(`The contact "${name}" with the id of "${contactId}" is being deleted.`);
    // Update the matching contact
    const actionResult = await collection.deleteOne({ _id: contactId });

    // Check if a contact was updated
    if (actionResult.deletedCount === 0) {
      console.log('No matching contact found to delete.');
      return res.status(404).json({ message: 'No matching contact found to delete.' });
    } else {
      const message = `The contact "${name}" with the id of "${contactId}" was successfully deleted from the contacts collection as requested.`;
      console.log(message);
      // Return the id # and success
      res.status(200).json(message);
    }
  } catch (error) {
    console.error('Error inserting data: ', error);
    res.status(500).json({ message: 'Error occured while trying to remove the contact.' });
  }
};

module.exports = {
  getAllContacts,
  getSpecificContact,
  createContact,
  updateContact,
  removeContact
};
