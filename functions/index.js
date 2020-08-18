const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const functions = require('firebase-functions');
const firestore = admin.firestore();
const express = require('express');

const app = express();

/*
  Create slug
*/
app.post('/create', async (req, res) => {
  const slugsRef = firestore.collection('slugs');

  // Check if request is correct
  if((!req.body.slug || !req.body.destination) || !isURL(req.body.destination)) {
    res.status(400).json({
      message: 'Bad request'
    })
    return
  }

  // Check if slug existing
  const slug = await slugsRef.doc(req.body.slug).get();
  if (slug.exists) {
    res.status(200).json({
      message: 'Slug already used'
    })
    return
  }

  // Create new slug
  await slugsRef.doc(req.body.slug).set({
    destination: req.body.destination,
    created: Date.now()
  })

  res.status(201).json({
    slug: req.body.slug,
    redirect: req.body.destination,
    message: `Created slug ${req.body.slug}`
  })
})



/*
  Get slug
*/
app.get('/:slug', async (req, res) => {
  const slugsRef = firestore.collection('slugs');
  
  const slug = await slugsRef.doc(req.params.slug).get();
  if (slug.exists) {
    res.redirect(slug.data().destination)
  } else {
    res.redirect('/?error')
  }
})

exports.app = functions.region('us-central1').https.onRequest(app);



/*
  Functions
*/
function isURL(str) {
  var urlRegex = '^(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
}