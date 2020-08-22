const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const functions = require('firebase-functions');
const firestore = admin.firestore();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

/*
  Create slug
*/
app.post('/create', async (req, res) => {
  const slugsRef = firestore.collection('slugs');

  var errors = [];
  // Validate url
  if (!required(req.body.url) || !validURL(req.body.url)) errors.push('URL')
  // Validate slug
  if (!required(req.body.slug) || !minLength(req.body.slug, 4)) errors.push('SLUG')


  if (errors.length != 0) {
    // Send out error message if validation failed
    res.status(400).json({
      errors
    })
    return
  }


  // Check if slug existing
  const slug = await slugsRef.doc(req.body.slug).get();
  if (slug.exists) {
    res.status(200).json({
      error: 'SLUG_USED'
    })
    return
  }

  // Create new slug
  await slugsRef.doc(req.body.slug).set({
    destination: req.body.url,
    created: Date.now()
  })

  res.status(201).json({
    urlShorted: `https://gnow.ml/${req.body.slug}`
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
    res.redirect(`/?error=${req.params.slug}`)
  }
})
exports.app = functions.region('us-central1').https.onRequest(app);



/*
  Validation functions
*/
function required(str) {
  return str && str.length > 0
}
function minLength(str, minLength) {
  return str && str.length >= minLength
}
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str)
}